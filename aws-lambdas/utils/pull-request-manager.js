import OctokitManager from './octokit-manager.js';
import { pullRequestDataGenerator } from "./pull-request-data-generator.js";

export default class PullRequestManager {
    constructor() { }

    async createPullRequest (formData, gitHubRepositoryConfig, fileType) {
        const octokitManager = new OctokitManager({
            owner: gitHubRepositoryConfig.githubOwner,
            repo: gitHubRepositoryConfig.githubRepo,
            appId: gitHubRepositoryConfig.githubAppId,
            installationId: gitHubRepositoryConfig.githubAppInstallationId,
            privateKey: Buffer.from(gitHubRepositoryConfig.githubAppPkBase64 , 'base64').toString('ascii')
        });

        const rndInt = this.randomIntFromInterval(1009, 10007);

        const pullRequestData = pullRequestDataGenerator.getPullRequestData({ 
            formData: formData,
            baseBranchName: gitHubRepositoryConfig.githubBaseBranch,
            randomNumber: rndInt
        }, fileType);

        const author = {
            name: "Works on WOA Bot",
            email: "works.on.woa@noreply.com",
        };

        const getLastCommitResult = await octokitManager.getLastCommit(pullRequestData.headBaseBranchName);
        const latestCommitSha = getLastCommitResult.sha;
        const latestTreeSha = getLastCommitResult.commit.tree.sha;

        const createTreeResponse = await octokitManager.createTree(latestTreeSha, pullRequestData.commitMessage, pullRequestData.filePath, pullRequestData.fileContent);
        const newTreeSha = createTreeResponse.sha;

        const createCommitResponse = await octokitManager.createCommit(newTreeSha, pullRequestData.commitMessage, latestCommitSha, author);
        const newCommitSha = createCommitResponse.sha;

        await octokitManager.createBranch(pullRequestData.newBranchRefName, newCommitSha);

        await octokitManager.createPullRequest(pullRequestData.pullRequestTitle, pullRequestData.pullRequestBody, pullRequestData.newBranchName, gitHubRepositoryConfig.githubBaseBranch);
    };

    // min and max included 
    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
