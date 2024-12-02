export async function validateReCaptchaV2(host, secret, token) {
    const url = new URL(host);
    const params = {
        secret: secret,
        response: token
    };

    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const response = await fetch(url, {
        method: "POST",
        body: "",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });

    const body = await response.json();
    return body.success ? "" : body["error-codes"].join(",");
}
