import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { FileType } from "../models/file-type.js";

export default class ConfigManager {
    constructor() {
        this.config = null;
    }

    async loadConfig(fileType) {
        if (this.config) return this.config;

        const baseConfigKeys = ["githubAppId", "githubAppInstallationId", "githubAppPkBase64", "githubOwner", "githubRepo", "githubBaseBranch", "recaptchaV2VerifyUrl", "recaptchaV2SecretKey"];

        let requiredKeys;
        switch (fileType) {
            case FileType.Application:
                requiredKeys = [...baseConfigKeys];
                break;
            case FileType.Game:
                requiredKeys = [...baseConfigKeys];
                break;
            default:
                throw new Error(`There is no configuration for the File Type: ${fileType}`);
        }

        await this.loadBaseConfig(requiredKeys);
        return this.config;
    }

    async loadBaseConfig(requiredKeys) {
        this.config = {};
        const missingEnvVars = [];

        requiredKeys.forEach((key) => {
            const envVarName = toUpperSnakeCase(key);
            const envValue = process.env[envVarName];
            if (envValue) {
                this.config[key] = envValue;
            } else {
                missingEnvVars.push(key);
            }
        });
    }

    async loadSecrets(missingKeys) {
        const keysRequiringSecrets = ["githubAppPkBase64"];
        const secretsToFetch = missingKeys.filter(key => keysRequiringSecrets.includes(key));

        if (secretsToFetch.length === 0) return;

        const secrets = await this.getSecrets();
        const missingSecrets = [];

        secretsToFetch.forEach((key) => {
            const secretKey = toUpperSnakeCase(key);
            if (secrets[secretKey]) {
                this.config[key] = secrets[secretKey];
            } else {
                missingSecrets.push(secretKey);
            }
        });

        if (missingSecrets.length > 0) {
            throw new Error(`Missing required environment variables or secrets: ${missingSecrets.join(", ")}`);
        }
    }

    async getSecrets() {
        if (!process.env['SECRET_NAME'] || !process.env['AWS_SECRET_REGION']) {
            throw new Error("Environment variables SECRET_NAME and AWS_SECRET_REGION must be configured.");
        }
    
        const client = new SecretsManagerClient({ region: process.env['AWS_SECRET_REGION'] });
        
        const response = await client.send(new GetSecretValueCommand({
            SecretId: process.env['SECRET_NAME'],
            VersionStage: "AWSCURRENT",
        }));
    
        return JSON.parse(response.SecretString);
    }    
}

function toUpperSnakeCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
}
