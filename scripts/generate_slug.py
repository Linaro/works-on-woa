#!/usr/bin/env python3
"""
Slug generator for works-on-woa projects.json entries.

Generates URL-safe slugs from app/game names following existing conventions:
  - Games: lowercase, spaces replaced with hyphens (e.g. "7 Days to Die" -> "7-days-to-die")
  - Applications: lowercase, spaces removed (e.g. "101 Birthday Cards" -> "101birthdaycards")
  - Non-ASCII characters stripped; English translation in parentheses is preserved
  - Uniqueness enforced against existing slugs in projects.json

Usage:
  python generate_slug.py "App Name" --type application
  python generate_slug.py "Game Name" --type game
  python generate_slug.py "App Name" --type application --dry-run
"""

import argparse
import json
import os
import re
import sys
import unicodedata

PROJECTS_JSON = os.path.join(
    os.path.dirname(__file__), "..", "src", "data", "content", "projects.json"
)


def load_projects(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def normalize_name(name: str) -> str:
    """Extract usable ASCII text from a name that may contain CJK + English translation.

    For names like "135编辑器 (135 Editor)", strips parentheses and non-ASCII chars
    while preserving original spacing so slug structure matches existing conventions.
    """
    # Remove parentheses but keep their content
    text = name.replace("(", "").replace(")", "")

    # Strip non-ASCII characters
    text = "".join(c for c in text if c.isascii())

    # Collapse multiple spaces and trim
    text = re.sub(r"\s+", " ", text).strip()

    return text


def generate_slug(name: str, entry_type: str) -> str:
    """Generate a slug from an app/game name.

    Args:
        name: The display name of the app or game.
        entry_type: Either "game" or "application".

    Returns:
        A URL-safe slug string.
    """
    text = normalize_name(name)
    text = text.lower()

    # Replace common special characters before stripping
    text = text.replace("&", "and")
    text = text.replace("+", "plus")

    if entry_type == "game":
        # Games: replace spaces with hyphens, strip non-url-safe chars
        text = re.sub(r"[^a-z0-9\s-]", "", text)
        text = re.sub(r"\s+", "-", text).strip("-")
        # Collapse multiple hyphens
        text = re.sub(r"-+", "-", text)
    else:
        # Applications: remove spaces entirely, strip non-url-safe chars
        text = re.sub(r"[^a-z0-9]", "", text)

    return text


def make_unique(slug: str, existing: set[str], entry_type: str) -> str:
    """Ensure slug is unique by appending a numeric suffix if needed.

    Games get "-2", "-3", etc. Applications get "2", "3", etc.
    """
    if slug not in existing:
        return slug

    separator = "-" if entry_type == "game" else ""
    counter = 2
    while f"{slug}{separator}{counter}" in existing:
        counter += 1
    return f"{slug}{separator}{counter}"


def main():
    parser = argparse.ArgumentParser(
        description="Generate a URL-safe slug for a works-on-woa project entry."
    )
    parser.add_argument("name", help="The display name of the app or game.")
    parser.add_argument(
        "--type",
        choices=["game", "application"],
        required=True,
        dest="entry_type",
        help="The type of entry (game or application).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show the generated slug without checking uniqueness against the file.",
    )
    parser.add_argument(
        "--json-path",
        default=PROJECTS_JSON,
        help="Path to projects.json (default: auto-detected relative to script).",
    )
    args = parser.parse_args()

    slug = generate_slug(args.name, args.entry_type)

    if not slug:
        print("Error: name produced an empty slug. Provide a name with ASCII characters.", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print(f"slug: {slug}")
        print("(dry-run: uniqueness not checked)")
        return

    json_path = os.path.realpath(args.json_path)
    if not os.path.isfile(json_path):
        print(f"Error: projects.json not found at {json_path}", file=sys.stderr)
        sys.exit(1)

    projects = load_projects(json_path)
    existing = {entry.get("slug", "") for entry in projects}
    final_slug = make_unique(slug, existing, args.entry_type)

    if final_slug != slug:
        # Find and display the existing entry that caused the collision
        existing_entry = next((p for p in projects if p.get("slug") == slug), None)
        print(f"slug: {final_slug}")
        print(f"  (note: '{slug}' was already taken, suffixed to '{final_slug}')")
        if existing_entry:
            print(f"\n  Existing entry for '{slug}':")
            print(json.dumps(existing_entry, indent=2, ensure_ascii=False))
    else:
        print(f"slug: {final_slug}")


if __name__ == "__main__":
    main()
