# Canvas AuTOTP

*A browser extension that autofills 2FA TOTP codes for Canvas-based sites that support ADSF*

**Microsoft Authenticator bypass!!**

## Usage

You must only complete this steps once per site

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
13. Once you login in on your canvas site, it should automatically fill in the code and sign you in

## Credit

The TOTP functionality is the one from [totp-in-javascript](https://github.com/turistu/totp-in-javascript) by [turistu](https://github.com/turistu) 
