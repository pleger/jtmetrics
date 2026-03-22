# JTMetrics Chrome Extension (GitHub)

This extension adds a `JTMetrics` tab next to `Settings` in GitHub repository pages.

From that tab, users can:

1. Enter a source path inside the repository (for example: `src`).
2. Click `Calculate metrics`.
3. Run all available JTMetrics metrics directly in the extension.
4. Download the result as JSON.

## Load in Chrome

1. Go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `chrome-extension`.

## Configure

1. Open extension options.
2. Optionally set a GitHub token (recommended for private repos / rate limits).
