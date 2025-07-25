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
```

## Running the server

```bash
npm run start
```

The command disables ts-node's cache so the code is always compiled from scratch.
The API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

## Endpoint

- `GET /hello` queries the Grok API with the prompt "hello world" and returns the
  response. The server now sends a POST request to the Grok API to avoid HTML
  responses that redirect to `/lander`.
- `GET /news` returns a JSON payload with trending news articles by calling the
  Grok chat completions API.

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
