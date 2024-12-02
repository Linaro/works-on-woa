import OctokitManager from './octokit-manager.js';
import { issueDataGenerator } from "./issue-data-generator.js";

export default class IssueManager {
    constructor() {}

    async createIssue(formData, gitHubRepositoryConfig) {
        const octokitManager = new OctokitManager({
            owner: gitHubRepositoryConfig.githubOwner,
            repo: gitHubRepositoryConfig.githubRepo,
            appId: gitHubRepositoryConfig.githubAppId,
            installationId: gitHubRepositoryConfig.githubAppInstallationId,
            privateKey: Buffer.from(gitHubRepositoryConfig.githubAppPkBase64 , 'base64').toString('ascii')
        });

        const issueData = issueDataGenerator.getIssueData({
            formData: formData
        });

        await octokitManager.createIssue(issueData.issueTitle, issueData.issueBody);
    }
}