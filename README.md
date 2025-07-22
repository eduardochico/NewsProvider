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

## Troubleshooting

If you see an error similar to:

```
Failed to fetch data from Grok: getaddrinfo ENOTFOUND api.grok.com
```

ensure that the `GROK_API_URL` in your `.env` file points to a valid host and that your network can resolve it.
This typically means either the URL is misspelled or DNS resolution is blocked on your machine.

