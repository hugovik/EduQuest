$db = "backend\eduquest.db"

if (Test-Path $db) {
    Remove-Item $db
    Write-Host "Database removed."
}
else {
    Write-Host "Database not found."
}