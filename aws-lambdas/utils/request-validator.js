import { validateReCaptchaV2 } from "./recaptcha-validator.js";
import { FileType } from "../models/file-type.js";

export default class RequestValidator {
    static validateReferer(headers, allowedReferer) {
        if (!allowedReferer) return "";

        const referer = (headers['referer'] || headers['Referer'] || "").trim().toLowerCase();
        allowedReferer = allowedReferer.trim().toLowerCase();

        return referer === allowedReferer ? "" : "Access forbidden: Invalid referer";
    }

    static async validateRequest(data, fileType, recaptchaV2VerifyUrl, recaptchaV2SecretKey) {
        let error = this.validateFormData(data, fileType);

        if (error === "") {
            error = await validateReCaptchaV2(recaptchaV2VerifyUrl, recaptchaV2SecretKey, data.token ?? "");
        }

        return error;
    }

    static validateFormData(data, fileType) {
        const missingFields = [];

        if (!data.name || data.name.trim() === "") {
            missingFields.push("name");
        }

        if (fileType === FileType.Game) {
            if (!data.categories) {
                missingFields.push("categories");
            }
            if (!data.compatibility) {
                missingFields.push("compatibility");
            }
            if (!data.dateTasted) {
                missingFields.push("dateTasted");
            }
        } else if (fileType !== FileType.Application) {
            return `Invalid file type: ${fileType}`;
        }

        if (missingFields.length > 0) {
            return `Missing required fields: ${missingFields.join(", ")}`;
        }

        return "";
    }
}
