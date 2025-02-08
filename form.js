document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('secret-submit');
    submitButton.addEventListener('click', function() {
        browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const currentDomain = new URL(currentTab.url).hostname;
            const secret = document.getElementById('secret-input').value;
            updateSecret(currentDomain, secret);
        });
    });
    const copyButton = document.getElementById('totp-copy');
    copyButton.addEventListener('click', async function() {
        let key = await loadSecret();
        if (key == undefined) {
            console.log("Not a valid webpage");
            copyButton.textContent = ":(";
        }
        else {
            let code = await totp(key);
            await navigator.clipboard.write(code);
            copyButton.textContent = "Copied!";
        }
    });
});

async function updateSecret(domain, secret) {
    await browser.storage.local.set({ [domain]: secret });
    console.log("Secret updated!", domain, ": ", secret);
}

async function loadSecret() {
    const currentDomain = window.location.hostname;
    const secrets = await browser.storage.local.get([currentDomain]);
    return secrets[currentDomain];
}
