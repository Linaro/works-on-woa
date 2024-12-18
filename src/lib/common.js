import yaml from 'js-yaml';

export const ApiURLs = {
    REPO_CONTENT: "https://api.github.com/repos/Linaro/works-on-woa/contents/src/content",
    APPLICATIONS_CATEGORIES: "/applications_categories",
    GAMES_CATEGORIES: "/games_categories"
};

export const ErrorMessages = {
    GENERIC_ERROR: "An Error occurred",
    FETCH_ERROR: "Failed to send data to the server",
    MISSING_CAPTCHA_ERROR: "Please, validate the captcha"
};

//########################################  multi select    ########################################//

export async function fileDataFetcher(url) {
    const response = await fetch(url);
    const data = await response.json();

    const files = data.filter(item => item.type === 'file' && item.name.endsWith('.md'));

    let categories = [];
    for (const file of files) {
        const fileContentResponse = await fetch(file.download_url);
        const fileContent = await fileContentResponse.text();
        
        const parsedContent = yaml.loadAll(fileContent);
        categories.push(parsedContent[0].name);
    }

    return categories;
}

export async function populateMultiSelect(url, elementId) {
    const elemList = await fileDataFetcher(url);
    const multiSelect = document.getElementById(elementId);

    for (let elem of elemList) {
        var opt = document.createElement('option');
        opt.value = elem;
        opt.innerHTML = elem;
        multiSelect.appendChild(opt);
    }
}

//########################################  Success and Error Alerts    ########################################//

export function showSuccessAlert(elementId, show) {
    const success_alert = document.getElementById(elementId);
    success_alert.style.display = show ? 'block' : 'none';
}

export function showErrorAlert(elementId, innerElementId, show, errorMsg) {
    const error_alert = document.getElementById(elementId);
    error_alert.style.display = show ? 'block' : 'none';

    let errorResult = "An error occurred!";
    const error_alert_info = document.getElementById(innerElementId);

    if ((errorMsg ?? '') !== '') {
        errorResult = ` ${errorMsg}`;
    }

    error_alert_info.innerHTML = errorResult;
}

export function pageLoading(isLoading) {
    const loader = document.getElementById("loader");
    const mainDiv = document.getElementById("mainDiv");

    if (isLoading) {
        loader.style.display = "block";
        mainDiv.style.display = "none";
    } else {
        loader.style.display = "none";
        mainDiv.style.display = "block";
    }
}
