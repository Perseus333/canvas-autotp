/*
background.js

Handles the shared functions
*/

async function updateSecret(domain, secret) {
    await chrome.storage.local.set({ [domain]: secret });
    console.log("Secret updated!", domain, ": ", secret);
}

async function loadSecret(domain) {
    const secrets = await chrome.storage.local.get(domain);
    return secrets[domain];
}

async function fetchDomain() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    const domain = url.hostname;
    return domain;
}

/* Handling message requests */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "loadSecret") {
        let domain = message.data;
        loadSecret(domain).then(secret => {
            sendResponse({ secret });
        });
        return true;
    }
    else if (message.action === "updateSecret") {
        let [domain, secret] = message.data;
        updateSecret(domain, secret);
    }
    else if (message.action === "totp") {
        let key = message.data;
        totp(key).then(code => {
            sendResponse({ code });
        });
        return true;
    }
    else if (message.action === "fetchDomain") {
        fetchDomain().then(domain => {
            sendResponse({ domain });
        });
        return true;
    }
    return false;
});

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