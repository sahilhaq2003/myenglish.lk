# API Key Setup Instructions

## Quick Setup

Your API key has been configured. To create the `.env` file with your API key, run this command in PowerShell:

```powershell
"VITE_API_KEY=AIzaSyC79eDBN5gVb_LSac-CUtPduRiZswdnNik" | Out-File -FilePath .env -Encoding utf8
```

Or manually create a file named `.env` in the project root with this content:

```
VITE_API_KEY=AIzaSyC79eDBN5gVb_LSac-CUtPduRiZswdnNik
```

## After Creating the .env File

1. **Restart the development server** if it's running:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

2. The API key will now be loaded automatically.

## Troubleshooting

- If you see "API key not configured" errors, make sure:
  - The `.env` file exists in the project root (same folder as `package.json`)
  - The file contains `VITE_API_KEY=AIzaSyC79eDBN5gVb_LSac-CUtPduRiZswdnNik`
  - You've restarted the dev server after creating the file
  - There are no extra spaces or quotes around the API key

## Security Note

The `.env` file is already added to `.gitignore` to keep your API key secure. Never commit your API key to version control!

