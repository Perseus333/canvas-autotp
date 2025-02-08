import { totp } from './totp.js';

let key = await loadSecret();

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

async function loadSecret() {
    let response = await fetch(chrome.runtime.getURL("secret.json"));
    let data = await response.json();
    return data.secret;
}

async function autofillTOTP() {
    let code = await totp(key);
    console.log("Generated TOTP:", code);
    waitForElement("#verificationCodeInput", inputField => {
        inputField.value = code;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        let form = inputField.closest("form");
        if (form) form.submit();
    });
}

autofillTOTP();

const observer = new MutationObserver(() => autofillTOTP());
observer.observe(document.body, { childList: true, subtree: true });