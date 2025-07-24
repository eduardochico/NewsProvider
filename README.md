# NewsProvider

This project contains a simple NestJS backend service for fetching viral news from Mexico using the Grok API.

## Setup

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and provide the `GROK_API_KEY`.

```bash
cp .env.example .env
# edit .env and set GROK_API_KEY
```

## Running the server

```bash
npm run start
```

The API will be available at `http://localhost:3000` and Swagger documentation at `http://localhost:3000/api`.

## Endpoints

- `GET /news` returns recent viral news from Mexico using a built-in prompt.
- `GET /lander?prompt=your+prompt` queries the Grok API with a custom prompt.

## Troubleshooting

If you see an error similar to:

```
Failed to fetch data from Grok: getaddrinfo ENOTFOUND api.grok.ai
```

Ensure that the `GROK_API_URL` in your `.env` file points to a valid host (for example `https://api.grok.ai/v1/query`) and that your network can resolve it.
This typically means either the URL is misspelled or DNS resolution is blocked on your machine.

The server now logs any HTTP status and response body received from Grok, which helps identify configuration issues.

If you encounter an error like:
```
AxiosError: write EPROTO ... tlsv1 unrecognized name
```
ensure that your system can establish a TLS connection to the Grok API. By default the
service will connect using a server name of `grok.ai` which avoids issues with
some TLS proxies that reject `api.grok.ai`.
