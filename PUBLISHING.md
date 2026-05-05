# Publishing to GitHub Pages

This folder is already prepared as a static GitHub Pages site. The local Git
repository and first commit are expected to be ready before publishing.

## 1. Create the GitHub repository

1. Open <https://github.com/new?name=Equianalgesic_Dosing_Calculator&description=Static%20equianalgesic%20dose%20calculator&visibility=public>.
2. Owner: `rb666`.
3. Repository name: `Equianalgesic_Dosing_Calculator`.
4. Visibility: `Public`.
5. Leave `Add a README file`, `.gitignore`, and `license` unchecked.
6. Click `Create repository`.

## 2. Push this local site

From PowerShell in this folder, run:

```powershell
.\publish-to-github.ps1 https://github.com/rb666/Equianalgesic_Dosing_Calculator.git
```

If PowerShell blocks the script, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\publish-to-github.ps1 https://github.com/rb666/Equianalgesic_Dosing_Calculator.git
```

If Git asks you to sign in, complete the browser login and rerun the command if
needed.

## 3. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to `Settings`.
3. In the left sidebar, open `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Set `Branch` to `main` and folder to `/(root)`.
6. Click `Save`.

The site should publish at:

<https://rb666.github.io/Equianalgesic_Dosing_Calculator/>

GitHub says publication can take up to 10 minutes after pushing changes.
