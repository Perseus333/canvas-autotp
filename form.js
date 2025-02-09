/*
form.js

JS code for the extension popup
*/

document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('secret-submit');
    submitButton.addEventListener('click', async function() {
        let domainResponse = await browser.runtime.sendMessage({
            action: "fetchDomain"
        });
        let currentDomain = await domainResponse.domain;
        const secret = document.getElementById('secret-input').value;
        await browser.runtime.sendMessage({
            action: "updateSecret",
            data: [currentDomain, secret]
        });
    });
    const copyButton = document.getElementById('totp-copy');
    copyButton.addEventListener('click', async function() {
        let domainResponse = await browser.runtime.sendMessage({
            action: "fetchDomain"
        });
        let currentDomain = domainResponse.domain;
        let secretResponse = await browser.runtime.sendMessage({
            action: "loadSecret",
            data: currentDomain
        });
        let key = secretResponse.secret;
        if (key == undefined) {
            console.log("Not a valid webpage");
            copyButton.textContent = ":(";
        }
        else {
            let totpResponse = await browser.runtime.sendMessage({
                action: "totp",
                data: key
            });
            let code = totpResponse.code;
            await navigator.clipboard.writeText(code);
            copyButton.textContent = "Copied!";
            console.log("Code copied!", code)
        }
    });
});
