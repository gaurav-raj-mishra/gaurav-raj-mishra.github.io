<#
    publish.ps1 — commit everything and deploy the site.

    Usage (from PowerShell, in this folder):
        .\publish.ps1 "Added a new post about radiology"

    Pushing to GitHub triggers the deploy workflow, so the live site
    updates on its own a minute or two later.
#>
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Message
)

Set-Location $PSScriptRoot

git add -A

# If nothing is staged, there's nothing to publish.
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "Nothing to publish - no changes since the last push." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nPublishing these changes:" -ForegroundColor Cyan
git diff --cached --name-status

git commit -m $Message | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed." -ForegroundColor Red
    exit 1
}

git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed - are you online?" -ForegroundColor Red
    exit 1
}

Write-Host "`nPushed. GitHub is rebuilding the site now." -ForegroundColor Green
Write-Host "Live in a minute or two:  https://gaurav-raj-mishra.github.io"
Write-Host "Watch the build:          gh run watch"
