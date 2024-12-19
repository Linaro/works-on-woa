import { ApiURLs, ErrorMessages, pageLoading, populateMultiSelect, showSuccessAlert, showErrorAlert } from './common';

const successAlertId = "success_alert";
const errorAlertId = "error_alert";
const errorAlertInnerElementId = "error_alert_info";
const multiCategoriesElementId = "multi_categories";
const categoriesUrl = `${ApiURLs.REPO_CONTENT}${ApiURLs.APPLICATIONS_CATEGORIES}`;

//########################################  multi select    ########################################//

const multiCategoriesId = "multi_categories";
const multiSelect = document.getElementById(multiCategoriesId);
multiSelect.addEventListener('change', (e) => {
    let selectedOptions = [];
    for (let options of multiSelect.selectedOptions) {
        selectedOptions.push(options.value);
    }
    
    document.getElementById('categories').value = selectedOptions.join(', ');
});

//########################################  Change form fields based on report type ########################################//

const reportRadios = document.querySelectorAll('input[name="report"]');
reportRadios.forEach((radio) => {
    radio.addEventListener('click', (val) => {
        let srcElem = val.srcElement;

        let reportInfoItems = document.querySelectorAll(".reportInfo");
        let display = srcElem.value === "submitNewOrUpdatedAppInfo" ? "block" : "none";
        
        reportInfoItems.forEach((riItem) => {
            riItem.style.display = display;
        })
    });
});

//########################################  Form submission ########################################//

const form = document.getElementById("appForm");
const formLocale = form.dataset.locale
form.addEventListener("submit", (e) => {
    e.preventDefault();
    pageLoading(true);

    // var captchaVerificationToken = grecaptcha.getResponse();
    // if (captchaVerificationToken.length == 0) {
    //     showSuccessAlert(successAlertId, false);
    //     showErrorAlert(errorAlertId, errorAlertInnerElementId, true, ErrorMessages.MISSING_CAPTCHA_ERROR);
    //     setTimeout(() => {
    //         showErrorAlert(errorAlertId, errorAlertInnerElementId, false, "");
    //     }, 3000);
    // } else 
    {
        var data = new FormData(form)
        fetch(`${import.meta.env.PUBLIC_API_HOST}${import.meta.env.PUBLIC_APPLICATION_API_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify({
                "name": data.get("name"),
                // "token": captchaVerificationToken,
                "token": "",
                "publisher": data.get("publisher"),
                "requestType": data.get("report"),
                "appCategories": data.get("categories") ?? "",
                "urlForDownload": data.get("app_url") ?? "",
                "displayedArmCompatibility": data.get("arm_compatibility") ?? "",
                "compatibleVersionNumber": data.get("earliest_compt_version") ?? "",
                "executionCompatibility": data.get("exec_compatibility") ?? "",
                "iconUrl": data.get("icon_url") ?? ""
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                throw new Error(ErrorMessages.GENERIC_ERROR);
            }
        }).then((response) => {
            pageLoading(false);
            showSuccessAlert(successAlertId, true);
            showErrorAlert(errorAlertId, errorAlertInnerElementId, false, '');
            setTimeout(() => {
                window.location.href=`/${formLocale}/contributing`
            }, 3000);
        }).catch((error) => {
            pageLoading(false);
            showSuccessAlert(successAlertId, false);
            showErrorAlert(errorAlertId, errorAlertInnerElementId, true, ErrorMessages.FETCH_ERROR);
            setTimeout(() => {
                showErrorAlert(errorAlertId, errorAlertInnerElementId, false, '');
            }, 3000);
        })
    };
});

//########################################  Loader  ########################################//

window.onload = (e) => {
    populateMultiSelect(categoriesUrl, multiCategoriesElementId).then(() => {
        setTimeout(showPage, 100);
    });
};

function showPage() {
    pageLoading(false);
    document.getElementById("fecthingApplicationCategoriesSubTitle").style.display = "none";
    document.getElementById("applicationCompatibilitySubTitle").style.display = "block";
}
