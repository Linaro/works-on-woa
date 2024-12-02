export const pullRequestTemplateData = {
    applicationFileContentTemplate: template`---\nname: ${0}\ncategories: [${1}]\ncompatibility: ${2}\ndisplay_result: ${3}\nversion_from: ${4}\nlink: ${5}\nicon: ${6}\n---`,
    applicationFilePathTemplate: template`src/content/applications/${0}.md`,
    commitMessageTemplate: template`Add ${0}.md file`,
    gameFileContentTemplate: template`---\nname: ${0}\ncategories: [${1}]\npublisher: ${2}\ncompatibility: ${3}\ncompatibility_details: ${4}\ndevice_configuration: ${5}\ndate_tested: ${6}\nos_version: ${7}\ndriver_id: ${8}${9}\n---`,
    gameFileSubContentTemplate: template`\nauto_super_resolution:\n\tcompatibility: ${0}\n\tfps boost: ${1}`,
    gameFilePathTemplate: template`src/content/games/${0}.md`,
    headBaseBranchTemplate: template`heads/${0}`,
    newBranchNameTemplate: template`feat/add-${0}-${1}-file-${2}`, // ex: feat/add-outlook-application-file-1234
    newBranchRefNameTemplate: template`refs/heads/${0}`,
    pullRequestBodyTemplate: template`Incoming changes:\n- Add file for ${0} ${1} from ${2}\n- This data corresponds to a new ${1}\n\n**NOTE**: this Pull Request has been automatically generated.`,
    pullRequestTitleTemplate: template`[Feature] Add file for ${0} ${1}`, // ex: [Feature] Add file for Outlook Application
};

export const issueTemplateData = {
    title: template`[Request] Test ${0} application`,
    body: template`This issue corresponds to a request to test the **${0}** application from **${1}**.\nPlease proceed with the testing process at your earliest convenience.\n**NOTE**: this Issue has been automatically generated.`
}

// Tagged template function for creating templates with placeholders
// Usage: const value = template`list of values: ${0}, ${1}, {2}`;
// value("first", "second", "third"); // outputs: "list of values: first, second, third";
function template(strings, ...keys) {
    return (...values) => {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    };
}
