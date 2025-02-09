/*
form.js

JS code for the extension popup
*/

const submitButton = document.getElementById('secret-submit');
const inputField = document.getElementById('secret-input');
const copyButton = document.getElementById('totp-copy');
const messageBox = document.createElement('div');
messageBox.id = 'message-box';
document.body.appendChild(messageBox);  // Adding message box to the body

document.addEventListener('DOMContentLoaded', function() {
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

        inputField.value = "";
        inputField.placeholder = currentDomain + ": " + secret;
        messageBox.textContent = "Secret updated successfully!";
        messageBox.style.color = "green";
    });
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
            copyButton.value = "No code to copy";
            copyButton.style.color = "red";
        }
        else {
            let totpResponse = await browser.runtime.sendMessage({
                action: "totp",
                data: key
            });
            let code = totpResponse.code;
            await navigator.clipboard.writeText(code);
            copyButton.value = "Copied!";
            console.log("Code copied!", code);
            messageBox.textContent = code;
            messageBox.style.color = "green";
        }
    });
});
