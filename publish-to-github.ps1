param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryUrl
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath ".git")) {
  throw "This folder is not a Git repository. Run this script from the project root."
}

$remoteExists = git remote | Where-Object { $_ -eq "origin" }

if ($remoteExists) {
  git remote set-url origin $RepositoryUrl
} else {
  git remote add origin $RepositoryUrl
}

git branch -M main
git push -u origin main
