# First-admin bootstrap

The first administrator is created by a one-time CLI procedure. The command
requires deployment-provided environment variables and never stores a default
password in source control.

```powershell
$env:MONGO_ENABLED = 'true'
$env:MONGO_URI = '<secret Mongo URI>'
$env:FIRST_ADMIN_EMAIL = '<admin email>'
$env:FIRST_ADMIN_PASSWORD = '<secret password, at least 12 characters>'
$env:FIRST_ADMIN_FULL_NAME = '<optional display name>'
npm run bootstrap:first-admin
```

The command refuses to run when an admin already exists. It writes an audit
record containing the event, admin email, user id, timestamp and source; it
never logs the password or token.
