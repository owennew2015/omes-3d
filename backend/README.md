# BACKEND FILES

Files in this folder are intended for **Google Apps Script**.

1. Create a new Google Sheet
2. Open **Extensions** > **Apps Script**
3. Create the following files and paste the contents from this directory:
   - `code.gs`
   - `setup.gs`
   - `admin.html`
4. Select the `setupCafeOmes` function and click **Run**.
5. Deploy as Web App, select **"Execute as: Me"** and **"Who has access: Anyone"**.
6. Copy the resulting Web App URL and set it as `VITE_GAS_API` in your Vercel project or local `.env` file.