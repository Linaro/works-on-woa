import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export default class OctokitManager {
    constructor(params) {
        this.owner = params.owner;
        this.repo = params.repo;

        // PAT token authentication
        if (params.accessToken) {
            this.accessToken = params.accessToken;

            this.octokit = new Octokit({
                auth: this.accessToken
            });
        }

        // GitHub App Authentication
        if (params.appId && params.installationId && params.privateKey) {
            this.appId = params.appId;
            this.installationId = params.installationId;
            this.privateKey = params.privateKey;

            this.octokit = new Octokit({
                authStrategy: createAppAuth,
                auth: {
                    appId: this.appId,
                    installationId: this.installationId,
                    privateKey: this.privateKey
                }
            });
        }
    }

    async createBranch(newBranch, sha) {
        const { data } = await this.octokit.rest.git.createRef({
            owner: this.owner,
            repo: this.repo,
            ref: newBranch,
            sha: sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return data;
    }

    async createTree(sha, message, path, content) {
        const FILE_MODE_REGULAR = "100644";

        const { data } = await this.octokit.git.createTree({
            owner: this.owner,
            repo: this.repo,
            tree: [
                {
                    path: path,
                    mode: FILE_MODE_REGULAR,
                    type: "commit",
                    content: content
                }
            ],
            base_tree: sha,
            message: message,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return data;
    }


    async getLastCommit(branch) {
        const { data } = await this.octokit.rest.repos.getCommit({
            owner: this.owner,
            repo: this.repo,
            ref: branch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return data;
    }

    async createCommit(sha, message, latestCommitSha, author) {
        const { data } = await this.octokit.git.createCommit({
            owner: this.owner,
            repo: this.repo,
            tree: sha,
            message: message,
            parents: [latestCommitSha],
            author: author,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return data;
    }

    async updateRef(ref, sha, force = true) {
        const { data } = await this.octokit.git.updateRef({
            owner: this.owner,
            repo: this.repo,
            ref: ref,
            sha: sha,
            force: force,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return data;
    }

    async createPullRequest(title, body, head, base) {
        const { data } = await this.octokit.pulls.create({
            owner: this.owner,
            repo: this.repo,
            title: title,
            body: body,
            head: head,
            base: base,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return data;
    }    
}
