# Set the password only in this terminal session; do not save it in source files.
if (-not $env:DB_PASSWORD) {
  $secure = Read-Host "Enter PostgreSQL password" -AsSecureString
  $env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
}
Set-Location "$PSScriptRoot/backend"
mvn spring-boot:run
