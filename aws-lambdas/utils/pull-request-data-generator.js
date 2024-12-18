import { FileType } from "../models/file-type.js";
import { pullRequestTemplateData } from "../models/pull-request-template-data.js";

export default class PullRequestDataGenerator {
    constructor(params) {
        this.templateData = params.templateData;
    }

    getPullRequestData(params, fileType) {
        const formattedData = {};

        const appFormData = params.formData;
        const gameFormData = params.formData;
        const name = params.formData.name;
        const publisher = params.formData.publisher;
        const nameAlphanumeric = name.replace(/[^a-zA-Z0-9\s]/g,'');
        const nameUnderscore = nameAlphanumeric.trim().replace(/\s/g, '_');
        const nameHyphen = nameAlphanumeric.trim().replace(/\s/g, '-');
        const type = fileType.toLowerCase();

        formattedData.commitMessage = this.templateData.commitMessageTemplate(name);
        formattedData.fileContent = fileType === FileType.Application
            ? this.getFileContentForApps(appFormData)
            : this.getFileContentForGames(gameFormData);
        formattedData.filePath = fileType === FileType.Application
            ? this.templateData.applicationFilePathTemplate(nameUnderscore)
            : this.templateData.gameFilePathTemplate(nameUnderscore)
        formattedData.headBaseBranchName = this.templateData.headBaseBranchTemplate(params.baseBranchName);
        formattedData.newBranchName = this.templateData.newBranchNameTemplate(nameHyphen, type, params.randomNumber);
        formattedData.newBranchRefName = this.templateData.newBranchRefNameTemplate(formattedData.newBranchName);
        formattedData.pullRequestBody = this.templateData.pullRequestBodyTemplate(name, type, publisher);
        formattedData.pullRequestTitle = this.templateData.pullRequestTitleTemplate(name, type);

        return formattedData;
    }

    getFileContentForApps(appData) {
        const noInfo = "N/A";

        return this.templateData.applicationFileContentTemplate(
            appData.name,
            appData.appCategories ?? noInfo,
            appData.executionCompatibility ?? noInfo,
            appData.displayedArmCompatibility ?? noInfo,
            appData.compatibleVersionNumber ?? noInfo,
            appData.urlForDownload ?? noInfo,
            appData.iconUrl ?? noInfo
        );
    }

    getFileContentForGames(gameData) {
        const noInfo = "N/A";

        const subTemplate = (gameData.autoSuperResCompatibility || gameData.autoSuperResFPSboost)
            ? this.templateData.gameFileSubContentTemplate(
                gameData.autoSuperResCompatibility ?? noInfo,
                gameData.autoSuperResFPSboost ?? noInfo
            ) : "";

        return this.templateData.gameFileContentTemplate(
            gameData.name,
            gameData.categories ?? noInfo,
            gameData.publisher ?? noInfo,
            gameData.compatibility ?? noInfo,
            gameData.compatibilityDetails ?? noInfo,
            gameData.deviceConfiguration ?? noInfo,
            gameData.dateTasted ?? noInfo,
            gameData.osVersion ?? noInfo,
            gameData.driverId ?? noInfo,
            subTemplate
        );
    }
}

export const pullRequestDataGenerator = new PullRequestDataGenerator({ templateData: pullRequestTemplateData });
