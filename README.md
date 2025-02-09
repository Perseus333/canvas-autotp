<img src="icons/original.png" style="width: 200px">

# Canvas AuTOTP

*A browser extension that autofills 2FA TOTP codes for Canvas-based sites that support ADSF*

**Microsoft Authenticator bypass!!**


## Usage

>[!warning]
>This WILL reduce the security of your account. 
>You will be using the same device for something that is intended to use 2.
>There is no secrets encryption as of v1.0 (for maximum convenience)

You must only complete this steps once per site

It takes 1-2 minutes.

**(Important! Please follow)**

0. Install this extension in your browser
1. Go to [Security Info (microsoft.com)](https://mysignins.microsoft.com/security-info)
2. Click on `Add Sign-in method` -> `Microsoft Authenticator`
3. Click on `I want to use a different authenticator app` -> `Next`
4. Click on `Can't scan image?`
5. Copy the contents after "Secret key: " by clicking the `Copy` button next to it -> `Next`
6. On a *new* tab go to the login page for the site you wish to skip the MFA
   1. If you get automatically logged in, log out
7. In that tab, open the "Canvas AuTOTP" extension by clicking on it
8. Paste the secret that you copied from earlier -> click the `Submit` button -> click the `Copy Code`
9. Go back to the microsoft.com tab and paste the code there
10. Change "Default Sign-in method" by clicking on `Change` (above the sign-in methods but below the title)
11. In the popup, click the downwards arrow and select `App based authentication or hardware token - code`
12. Click `Confirm`

That's it! Once you login in on your canvas site, it should automatically fill in the code and sign you in.

## How it works

At the core it just autofills TOTP (Time-based One Time PINs).

TOTP are generated from a secret, which must be initially provided by the login management server, in this case Microsoft. They are usually regenerated every 30 seconds. The TOTP generation functionality is borrowed from Turistu, for more information see [Credit](#Credit).

What I have made is just a wrapper for that TOTP generation code, and automated it's generation and completion for Canvas-based sites.

The program stores the secrets in the `Extension Storage`, and each secret is associated with a key of the domain that it works on.

When you are in a website that contains `/adfs/ls/` in its url, the program interprets it as a Canvas login page and searches and tries to autocomplete the input to submit the TOTP. Once it does that, it automatically clicks the login button aswell.

Since I wanted this extension to be a superset of TOTP, it also includes the ability to manually copy the TOTP codes.

## Credit

The TOTP functionality is the one from [totp-in-javascript](https://github.com/turistu/totp-in-javascript) by [turistu](https://github.com/turistu) 
