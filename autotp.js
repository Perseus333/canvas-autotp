/*
autotp.js

Injects JS into websites, mainly for autofill
Acts as content_script
*/

const observer = new MutationObserver(() => autofillTOTP());
observer.observe(document.body, { childList: true, subtree: true });

async function autofillTOTP() {
    let currentDomain = await chrome.runtime.sendMessage({
        action: "fetchDomain"
    });
    let secretResponse = await chrome.runtime.sendMessage({
        action: "loadSecret",
        data: currentDomain.domain
    });
    let secret = secretResponse.secret;
    if (!secret) {
        console.log("No secret found for this domain.");
        return;
    }
    let totpResponse = await chrome.runtime.sendMessage({
        action: "totp",
        data: secret
    });
    let code = totpResponse.code;
    console.log("Generated TOTP:", code);
    waitForElement("#verificationCodeInput", inputField => {
        inputField.value = code;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        let form = inputField.closest("form");
        if (form) form.submit();
    });
}

function waitForElement(selector, callback, timeout = 10000) {
    const start = Date.now();
    const checkExist = setInterval(() => {
        let element = document.querySelector(selector);
        if (element) {
            clearInterval(checkExist);
            callback(element);
        } else if (Date.now() - start > timeout) {
            clearInterval(checkExist);
            console.error(`Timeout: Element ${selector} not found`);
        }
    }, 500);
}
