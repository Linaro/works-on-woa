import RequestValidator from './utils/request-validator.js';
import EmailManager from './utils/email-manager.js';
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

const RequestTypes = Object.freeze({
    RequestThisAppToBeTested: "requestThisAppToBeTested",
    SubmitNewOrUpdatedAppInfo: "submitNewOrUpdatedAppInfo"
});

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        const formData = JSON.parse(event.body);
        
        const refererError = RequestValidator.validateReferer(event.headers, process.env['ALLOWED_REFERER']);
        if(!refererError) config = await configManager.loadConfig(FileType.Application);
        const validationError = refererError === "" ? await RequestValidator.validateRequest(formData, FileType.Application, config.recaptchaV2VerifyUrl, config.recaptchaV2SecretKey) : 'Access forbidden';
        if (validationError) {
            return { statusCode: validationError === 'Access forbidden' ? 403 : 400, headers: HEADERS, body: validationError };
        }

        switch (formData.requestType) {
            case RequestTypes.RequestThisAppToBeTested:
                await handleTestingRequest(formData);
                break;
            case RequestTypes.SubmitNewOrUpdatedAppInfo:
                await handleSubmitOrUpdateRequest(formData);
                break;
            default:
                return { statusCode: 400, headers: HEADERS, body: `Invalid request type: ${formData.requestType}` };
        }

        return { statusCode: 200, headers: HEADERS, body: 'Successfully processed request' };
    } catch (error) {
        return handleError(error);
    }
};

const handleTestingRequest = async (data) => {
    const emailManager = new EmailManager(config.sendgridApiKey, config.senderEmail, config.recipientEmail);
    console.log(`Sending email to test the application ${data.name}...`);
    await emailManager.sendEmail(`[Request for testing app] - ${data.name}`, emailManager.generateAppTestEmailContent(data.name, data.publisher));
    console.log(`Email for testing application ${data.name} successfully sent`);
};

const handleSubmitOrUpdateRequest = async (data) => {
    const pullRequestManager = new PullRequestManager();
    await pullRequestManager.createPullRequest(data, {
        githubAppId: config.githubAppId,
        githubAppInstallationId: config.githubAppInstallationId,
        githubAppPkBase64: config.githubAppPkBase64,
        githubOwner: config.githubOwner,
        githubRepo: config.githubRepo,
        githubBaseBranch: config.githubBaseBranch
    }, FileType.Application);
};

const handleError = (error) => {
    console.error(error);
    return { statusCode: 500, headers: HEADERS, body: "An error occurred while processing your form submission." };
};
