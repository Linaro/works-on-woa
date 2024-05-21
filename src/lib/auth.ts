import {
    Authorizer,
    Biscuit,
    PublicKey,
    authorizer,
    rule,
} from "@biscuit-auth/biscuit-wasm";

export interface Bwks {
    algorithm: string;
    key_bytes: string;
    key_id: string;
    issuer: string;
    expires_at: number;
}
const limits = {
    max_facts: 100, // default: 1000
    max_iterations: 10, // default: 100
    max_time_micro: 10000000, // default: 1000 (1ms)
};


export const verifyBiscuitUser = (biscuit: string, publicKeys: Bwks[], websiteId: string) => {
    const publicKey = PublicKey.fromString(publicKeys[0].key_bytes);
    const token = Biscuit.fromBase64(biscuit, publicKey);
    const auth = authorizer`
    time(${Math.floor(Date.now() / 1000)});
    allow if true`;
    auth.addToken(token);
    auth.authorizeWithLimits(limits);
    return auth;
};

export const verifyWebsitePermission = (biscuit: string, publicKeys: Bwks[], websiteId: string) => {
    const publicKey = PublicKey.fromString(publicKeys[0].key_bytes);
    const token = Biscuit.fromBase64(biscuit, publicKey);
    const auth = authorizer`
    time(${Math.floor(Date.now() / 1000)});
    allow if right("websites", ${websiteId}, "read:website")`;
    auth.addToken(token);
    auth.authorizeWithLimits(limits);
    return auth;
};

function extractFacts(str: string) {
    const regex = /"([^"]*)"/g;
    let matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

export const parseBiscuitMetadata = (auth: Authorizer) => {
    const facts = auth.queryWithLimits(
        rule`u($id, $first_name, $surname) <- user($id, $email_address, $first_name, $surname)`,
        limits,
    );

    return extractFacts(facts.toString());
};
