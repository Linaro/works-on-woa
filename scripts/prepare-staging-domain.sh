#!/usr/bin/env bash
# Prepares staging.worksonwoa.com for a fresh SST deployment by:
# 1. Finding any CloudFront distribution that currently has staging.worksonwoa.com
#    as an alternate domain name and removing it
# 2. Deleting the Route 53 A/AAAA alias records for staging.worksonwoa.com
#
# Both steps are skipped if the Route 53 A record and the CloudFront alternate
# domain name already agree (i.e. the current deployment already owns the domain
# correctly and no cleanup is needed).
#
# This is necessary because SST v2 (staging branch) and SST v3 (staging-new branch)
# each create their own CloudFront distribution, and CloudFront enforces that a
# CNAME can only be attached to one distribution at a time.
#
# Usage: ./scripts/prepare-staging-domain.sh

set -euo pipefail

DOMAIN="staging.worksonwoa.com"
HOSTED_ZONE="staging.worksonwoa.com"

echo "Looking up hosted zone ID for $HOSTED_ZONE..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "$HOSTED_ZONE" \
  --query "HostedZones[?Name == '${HOSTED_ZONE}.'].Id" \
  --output text | sed 's|/hostedzone/||')

echo "=== Preparing $DOMAIN for deployment ==="

# ── Find the distribution that currently owns the CNAME ───────────────────────

echo "Searching for CloudFront distribution with alternate domain: $DOMAIN"

CF_RESULT=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Quantity > \`0\`].[Id,DomainName,Aliases.Items]" \
  --output json | python3 -c "
import json, sys
items = json.load(sys.stdin)
domain = '$DOMAIN'
for id_, cf_domain, aliases in (items or []):
    if domain in (aliases or []):
        print(id_, cf_domain)
        break
")

DISTRIBUTION_ID=$(echo "$CF_RESULT" | awk '{print $1}')
CF_DOMAIN=$(echo "$CF_RESULT" | awk '{print $2}')

# ── Find what Route 53 currently points at ────────────────────────────────────

R53_TARGET=$(aws route53 list-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --query "ResourceRecordSets[?Name == '${DOMAIN}.' && Type == 'A'].AliasTarget.DNSName" \
  --output text)
# Strip trailing dot and dualstack. prefix if present (Route 53 stores CloudFront
# alias targets as e.g. "dualstack.xxxxx.cloudfront.net.")
R53_TARGET="${R53_TARGET%.}"
R53_TARGET="${R53_TARGET#dualstack.}"

# ── Check if everything is already consistent ─────────────────────────────────

if [[ -n "$DISTRIBUTION_ID" && -n "$R53_TARGET" ]]; then
  # Normalise case before comparing
  CF_DOMAIN_NORM=$(echo "$CF_DOMAIN" | tr '[:upper:]' '[:lower:]')
  R53_TARGET_NORM=$(echo "$R53_TARGET" | tr '[:upper:]' '[:lower:]')

  if [[ "$CF_DOMAIN_NORM" == "$R53_TARGET_NORM" ]]; then
    echo "Route 53 and CloudFront already agree ($CF_DOMAIN) — no cleanup needed"
    echo "=== Domain preparation complete — safe to run SST deploy ==="
    exit 0
  fi
fi

# ── Step 1: Remove the CNAME from the distribution that currently owns it ─────

if [[ -z "$DISTRIBUTION_ID" || "$DISTRIBUTION_ID" == "None" ]]; then
  echo "No CloudFront distribution found with $DOMAIN — skipping CloudFront cleanup"
else
  echo "Found distribution $DISTRIBUTION_ID ($CF_DOMAIN) — removing $DOMAIN from its aliases"

  TMPFILE=$(mktemp)
  ETAG=$(aws cloudfront get-distribution-config \
    --id "$DISTRIBUTION_ID" \
    --query 'ETag' \
    --output text)
  aws cloudfront get-distribution-config \
    --id "$DISTRIBUTION_ID" \
    --query 'DistributionConfig' \
    > "$TMPFILE"

  UPDATED=$(python3 - "$TMPFILE" "$DOMAIN" <<'EOF'
import json, sys

with open(sys.argv[1]) as f:
    config = json.load(f)

aliases = config.get("Aliases", {})
items = [a for a in aliases.get("Items", []) if a != sys.argv[2]]
aliases["Items"] = items
aliases["Quantity"] = len(items)
config["Aliases"] = aliases

print(json.dumps(config))
EOF
)

  aws cloudfront update-distribution \
    --id "$DISTRIBUTION_ID" \
    --if-match "$ETAG" \
    --distribution-config "$UPDATED" \
    --output text

  rm -f "$TMPFILE"

  echo "Waiting for distribution $DISTRIBUTION_ID to reach Deployed status..."
  aws cloudfront wait distribution-deployed --id "$DISTRIBUTION_ID"
  echo "Distribution $DISTRIBUTION_ID is Deployed"
fi

# ── Step 2: Delete Route 53 A and AAAA alias records ─────────────────────────
# Only needed if step 1 removed a CNAME from a distribution — if no distribution
# owned the CNAME, the records are already pointing at the right place.

if [[ -z "$DISTRIBUTION_ID" || "$DISTRIBUTION_ID" == "None" ]]; then
  echo "No CloudFront CNAME was removed — Route 53 records are correct, skipping cleanup"
  echo "=== Domain preparation complete — safe to run SST deploy ==="
  exit 0
fi

echo "Looking for Route 53 A/AAAA records for $DOMAIN in hosted zone $HOSTED_ZONE_ID..."

RECORDS=$(aws route53 list-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --query "ResourceRecordSets[?Name == '${DOMAIN}.' && (Type == 'A' || Type == 'AAAA')]" \
  --output json)

RECORD_COUNT=$(echo "$RECORDS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")

if [[ "$RECORD_COUNT" == "0" ]]; then
  echo "No A/AAAA records found for $DOMAIN — skipping Route 53 cleanup"
else
  echo "Deleting $RECORD_COUNT A/AAAA record(s) for $DOMAIN..."

  CHANGE_BATCH=$(python3 - <<EOF
import json
records = json.loads('''$RECORDS''')
changes = [{"Action": "DELETE", "ResourceRecordSet": r} for r in records]
print(json.dumps({"Comment": "Remove staging domain before SST redeploy", "Changes": changes}))
EOF
)

  aws route53 change-resource-record-sets \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --change-batch "$CHANGE_BATCH" \
    --output text

  echo "Route 53 records deleted"
fi

echo "=== Domain preparation complete — safe to run SST deploy ==="
