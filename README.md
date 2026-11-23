# My Portfolio

The original portfolio design and content now run as a React application built with Vite. Its user and admin screens demonstrate role-based modules, signup, login, and browser Local Storage.

## Run locally

Open this folder in VS Code and run these commands in the terminal:

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite. Choose **Sign up** to register as a user or admin. User accounts can register directly; creating an admin account requires the existing admin credentials. A user or admin account opens the portfolio. Admins also see the registered-account count and can manage accounts from the **Accounts** section. To use the built-in admin demo account:

- Username: `sohan`
- Password: `sohan@2026!`

The admin module lists and removes registered accounts. Its count reflects accounts registered in the current browser, not people currently signed in across devices.

## Build and deploy

Run `npm run build` to create the production files in `dist`. To deploy, push the project to a GitHub repository, import it into Vercel, and deploy with the Vite defaults. `vercel.json` specifies the build command and output directory.

## Demo security note

Accounts and the signed-in session are stored in the current browser's Local Storage. Passwords are plain text in this classroom demo; do not use real or sensitive passwords. This is not production authentication.
