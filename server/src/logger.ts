import * as fs from 'fs';
import * as path from 'path';

const logFilePath = path.join(__dirname, '..', 'server.log');

function write(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

export function logRequest(method: string, url: string, body: any) {
  write(`Request ${method.toUpperCase()} ${url}\n${JSON.stringify(body, null, 2)}`);
}

export function logResponse(
  method: string,
  url: string,
  body: any,
  durationMs: number,
) {
  write(
    `Response ${method.toUpperCase()} ${url} (${durationMs}ms)\n${JSON.stringify(
      body,
      null,
      2,
    )}`,
  );
}

export function logError(err: unknown) {
  if (err instanceof Error) {
    write(`Error: ${err.message}\n${err.stack ?? ''}`);
  } else {
    write(`Error: ${JSON.stringify(err)}`);
  }
}
