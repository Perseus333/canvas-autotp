const observer = new MutationObserver(() => autofillTOTP());
observer.observe(document.body, { childList: true, subtree: true });

autofillTOTP();

async function autofillTOTP() {
    let key = await loadSecret();
    let code = await totp(key);
    console.log("Generated TOTP:", code);
    waitForElement("#verificationCodeInput", inputField => {
        inputField.value = code;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        let form = inputField.closest("form");
        if (form) form.submit();
    });
}

/* Helper functions */

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
    const currentDomain = window.location.hostname;
    const secrets = await browser.storage.local.get([currentDomain]);
    return secrets[currentDomain];
}

/* Stores the information, used by form.html */

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
});

async function updateSecret(domain, secret) {
    await browser.storage.local.set({ [domain]: secret });
    console.log("Secret updated!", domain, ": ", secret);
}

/* Original code from totp-in-javascript by turistu */

/* Start of turistu's code */

async function totp(key, secs = 30, digits = 6){
	return hotp(unbase32(key), pack64bu(Date.now() / 1000 / secs), digits);
}
async function hotp(key, counter, digits){
	let y = self.crypto.subtle;
	if(!y) throw Error('no self.crypto.subtle object available');
	let k = await y.importKey('raw', key, {name: 'HMAC', hash: 'SHA-1'}, false, ['sign']);
	return hotp_truncate(await y.sign('HMAC', k, counter), digits);
}
function hotp_truncate(buf, digits){
	let a = new Uint8Array(buf), i = a[19] & 0xf;
	return fmt(10, digits, ((a[i]&0x7f)<<24 | a[i+1]<<16 | a[i+2]<<8 | a[i+3]) % 10**digits);
}

function fmt(base, width, num){
	return num.toString(base).padStart(width, '0')
}
function unbase32(s){
    console.log("s:", s, typeof s);
	let t = (s.toLowerCase().match(/\S/g)||[]).map(c => {
		let i = 'abcdefghijklmnopqrstuvwxyz234567'.indexOf(c);
		if(i < 0) throw Error(`bad char '${c}' in key`);
		return fmt(2, 5, i);
	}).join('');
	if(t.length < 8) throw Error('key too short');
	return new Uint8Array(t.match(/.{8}/g).map(d => parseInt(d, 2)));
}
function pack64bu(v){
	let b = new ArrayBuffer(8), d = new DataView(b);
	d.setUint32(0, v / 2**32);
	d.setUint32(4, v);
	return b;
}

/* End of turistu's code */