import { issueTemplateData } from "../models/pull-request-template-data.js";

export default class IssueDataGenerator {
    constructor(params) {
        this.templateData = params.templateData;
    }

    getIssueData(params) {
        const formattedData = {};

        const name = params.formData.name;
        const publisher = params.formData.publisher;
        const nameAlphanumeric = name.replace(/[^a-zA-Z0-9\s]/g,'');

        formattedData.issueBody = this.templateData.body(name, publisher);
        formattedData.issueTitle = this.templateData.title(nameAlphanumeric);

        return formattedData;
    }
}

export const issueDataGenerator = new IssueDataGenerator({ templateData: issueTemplateData });