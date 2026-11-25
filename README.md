# My Portfolio

The original portfolio design and content now run as a React application built with Vite. Its user and admin screens demonstrate role-based modules, signup, login, and browser Local Storage.

## Run locally

Open this folder in VS Code and run these commands in the terminal:

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite. The app starts with two frontend demo accounts:

- Admin: username `sohan`, password `sohan123`
- User: username `omkar`, password `omkar123`

On first load after the demo-member version changes, existing account, profile, and session entries in that browser are replaced with these two demo members. Other portfolio preferences, such as the theme, are retained. The app still allows users to register additional accounts.

A signed-in account opens the portfolio, with separate Home, About, Skills, Work, and Contact pages. Admins also have an **Accounts** page for managing registered accounts. Navigation supports direct URLs and browser back/forward.

Registration and profile editing include a unique public `@handle` with live availability checks. The header search discovers registered members; selecting a result opens its `/users/<handle>` public profile, which only shows its name, handle, bio, avatar, and shared projects.

On your own public profile, use **Add Project** to save projects with a name, description, language (HTML, CSS, Java, or JavaScript), and optional GitHub link. Projects can be edited, deleted, and filtered by language; they are stored with that user's profile in Local Storage.

The admin module lists and removes registered accounts. Its count reflects accounts registered in the current browser, not people currently signed in across devices.

## Build and deploy

Run `npm run build` to create the production files in `dist`. To deploy, push the project to a GitHub repository, import it into Vercel, and deploy with the Vite defaults. `vercel.json` specifies the build command, output directory, and SPA route fallback.

## Demo security note

Accounts and the signed-in session are stored in the current browser's Local Storage. Passwords are plain text in this classroom demo; do not use real or sensitive passwords. This is not production authentication.
