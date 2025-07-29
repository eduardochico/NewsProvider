# NewsProvider

This project contains a simple NestJS backend that demonstrates how to make a **Hello World** request to the Grok API.

## Setup

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and provide the `GROK_API_KEY`.

```bash
cp .env.example .env
# edit .env and set GROK_API_KEY
# optionally set GROK_COMPLETION_URL if you need to override the default
# optionally set REDIS_URL if your Redis instance is not running locally
# optionally set SSL_KEY_PATH and SSL_CERT_PATH to enable HTTPS
```

## Running the server

```bash
npm run start
```

The command disables ts-node's cache so the code is always compiled from scratch.
If `SSL_KEY_PATH` and `SSL_CERT_PATH` are provided, the server will listen using HTTPS. In this case the API will be available at `https://localhost:3000` with Swagger documentation at `https://localhost:3000/api`. Otherwise it falls back to plain HTTP.

## Fetching news

Run the following command to fetch trending news and cache it in Redis:

```bash
npm run fetch-news
```

You can schedule this command using cron to keep the cached news up to date.

## Endpoint

- `GET /news` returns a JSON payload with trending news articles stored in Redis.
  The data is populated by running the `npm run fetch-news` script, which can be
  scheduled with cron.

## Troubleshooting

If you see an error similar to:

```
Failed to fetch data from Grok: getaddrinfo ENOTFOUND api.grok.ai
```

Ensure that the `GROK_API_URL` in your `.env` file points to a valid host (for example `https://api.grok.ai/v1/query`) and that your network can resolve it.
If you use the news endpoint, also verify `GROK_COMPLETION_URL` points to a reachable host.

The server logs any HTTP status and response body received from Grok, which helps identify configuration issues.

If you encounter an error like:
```
AxiosError: write EPROTO ... tlsv1 unrecognized name
```
ensure that your system can establish a TLS connection to the Grok API. By default the service will connect using a server name of `grok.ai` which avoids issues with some TLS proxies that reject `api.grok.ai`.
