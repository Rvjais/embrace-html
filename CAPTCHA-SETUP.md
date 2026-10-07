# CAPTCHA setup

The appointment form and all three free-tool report forms use the supplied
public site key with **reCAPTCHA v2 (the “I'm not a robot” checkbox)**. Confirm
that the key was registered for that type; v3 and invisible-v2 keys require
a different client integration.

## Required Formester configuration

The forms submit directly to Formester form `6rj1mkdNE`. Formester must verify
the CAPTCHA token on its server. The browser sends `g-recaptcha-response`;
client-side checks alone do not prevent a bot posting directly to that endpoint.

1. Open that form in Formester and find **Settings → Spam Protection**.
2. Enable custom Google reCAPTCHA (the advanced/custom-keys option for backend
   forms). Use the same public site key as `assets/recaptcha.js` and enter the
   corresponding secret key supplied separately. Save/publish the settings.
3. In Google's reCAPTCHA console, allow `embracelives.com` and any additional
   hostnames used for testing. Confirm domain validation is enabled.
4. Deploy the changed PHP and assets, or regenerate the static site with
   `node build.js`. No PHP submission endpoint is needed.

The secret key is deliberately absent from the repository and static build.
Do not put it in HTML, JavaScript, public configuration, or build output.

## Verify before considering protection active

- With valid form fields and no CAPTCHA, the website must block submission.
- Solve the checkbox and confirm a test submission reaches the Formester inbox.
- Wait for a solved challenge to expire; submission must require verification again.
- Test a POST directly to Formester without a token, and another with an invalid
  token. Both must be rejected by Formester. Use clearly labelled test data.
- Complete each screener and confirm its report request includes a
  `g-recaptcha-response` field alongside the existing lead fields.

The existing report forms submit through a cross-origin iframe. Their displayed
success message cannot establish that Formester accepted the entry; confirm it
in the inbox during this verification. Live verification needs access to the
Formester account and a human to complete the CAPTCHA.

References: [Formester backend forms](https://help.formester.com/en/article/backend-only-forms-1sy6yu9/),
[Formester spam protection](https://formester.com/features/spam-protection/),
[Google token verification](https://developers.google.com/recaptcha/docs/verify).
