import { ApiURLs, ErrorMessages, pageLoading, populateMultiSelect, showSuccessAlert, showErrorAlert } from './common';

const successAlertId = "success_alert";
const errorAlertId = "error_alert";
const errorAlertInnerElementId = "error_alert_info";
const gameCategoriesElementId = "categories";
const categoriesUrl = `${String(ApiURLs.REPO_CONTENT)}${String(ApiURLs.GAMES_CATEGORIES)}`;

//########################################  Form submission ########################################//

const form = document.getElementById("gameForm");
const formLocale = form.dataset.locale
form.addEventListener("submit", (e) => {
    e.preventDefault();
    pageLoading(true);

    // var captchaVerificationToken = grecaptcha.getResponse();
    // if (captchaVerificationToken.length == 0) {
    //     showSuccessAlert(successAlertId, false);
    //     showErrorAlert(errorAlertId, errorAlertInnerElementId, true, ErrorMessages.MISSING_CAPTCHA_ERROR);
    //     setTimeout(() => {
    //         showErrorAlert(errorAlertId, errorAlertInnerElementId, false, '');
    //     }, 3000);
    // } else {
        var data = new FormData(form);
        fetch(`${import.meta.env.PUBLIC_API_HOST}${import.meta.env.PUBLIC_GAME_API_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify({
                "name": data.get("name"),
                // "token": captchaVerificationToken,
                "token": "",
                "publisher": data.get("publisher"),
                "categories": data.get("categories") ?? "",
                "compatibility": data.get("compatibility") ?? "",
                "deviceConfiguration": data.get("device_configuration") ?? "",
                "dateTasted": data.get("date_tested") ?? "",
                "osVersion": data.get("os_version") ?? "",
                "driverId": data.get("driver_id") ?? "",
                "compatibilityDetails": data.get("compatibility_details") ?? "",
                "autoSuperResCompatibility": data.get("asrc") ?? "",
                "autoSuperResFPSboost": data.get("auto_super_res_boost") ?? "",
                "nameOrGamerTag": data.get("gamertag") ?? ""
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
    // }
});

//########################################  Loader  ########################################//

window.onload = (e) => {
    populateMultiSelect(categoriesUrl, gameCategoriesElementId).then(() => {
        setTimeout(showPage, 100);
    });
};

function showPage() {
    pageLoading(false);
    document.getElementById("fecthingApplicationCategoriesSubTitle").style.display = "none";
    document.getElementById("gameCompatibilitySubTitle").style.display = "block";
    document.getElementById('date_tested').valueAsDate = new Date();
}
