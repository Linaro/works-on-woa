import RequestValidator from './utils/request-validator.js';
import ConfigManager from './utils/config-manager.js';
import PullRequestManager from './utils/pull-request-manager.js';
import { FileType } from "./models/file-type.js";

const configManager = new ConfigManager();
let config;

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    try {
        const formData = JSON.parse(event.body);

        const refererError = RequestValidator.validateReferer(event.headers, process.env['ALLOWED_REFERER']);
        if(!refererError) config = await configManager.loadConfig(FileType.Game);
        const validationError = refererError === "" ? await RequestValidator.validateRequest(formData, FileType.Game, config.recaptchaV2VerifyUrl, config.recaptchaV2SecretKey) : 'Access forbidden';
        if (validationError) {
            return { statusCode: validationError === 'Access forbidden' ? 403 : 400, headers: HEADERS, body: validationError };
        }

        const pullRequestManager = new PullRequestManager();

        await pullRequestManager.createPullRequest(
            formData,
            {
                githubAppId: config.githubAppId,
                githubAppInstallationId: config.githubAppInstallationId,
                githubAppPkBase64: config.githubAppPkBase64,
                githubOwner: config.githubOwner,
                githubRepo: config.githubRepo,
                githubBaseBranch: config.githubBaseBranch
            },
            FileType.Game
        );
        return { statusCode: 200, headers: HEADERS, body: 'Successfully processed request' };
    } catch (error) {
        return handleError(error);
    }
};

const handleError = (error) => {
    console.error(error);
    return { statusCode: 500, headers: HEADERS, body: "An error occurred while processing your form submission." };
};
