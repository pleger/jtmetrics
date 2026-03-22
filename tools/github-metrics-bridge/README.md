# GitHub Metrics Bridge

This local service lets the Chrome extension run all JTMetrics metrics on GitHub repositories.

## Run

From project root:

```sh
npm run bridge:start
```

Default URL:

`http://127.0.0.1:43110/analyze`

Health endpoint:

`http://127.0.0.1:43110/health`

## API

`POST /analyze`

Body:

```json
{
  "owner": "octocat",
  "repo": "Hello-World",
  "ref": "HEAD",
  "sourcePath": "src",
  "githubToken": ""
}
```

Notes:

- `sourcePath` is required and must be a directory inside the repository snapshot.
- `githubToken` is optional, but recommended for private repos or API rate limits.
- Response is the JTMetrics JSON output.
