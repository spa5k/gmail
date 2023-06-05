import { promises as fs } from 'fs';

import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { Credentials, CREDENTIALS_PATH, SCOPES, TOKEN_PATH } from './config.js';

export async function loadSavedCredentialsIfExist() {
  try {
    const content = (await fs.readFile(TOKEN_PATH)).toString();
    const credentials: Credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

export async function saveCredentials(client: any) {
  const content = (await fs.readFile(CREDENTIALS_PATH)).toString();
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
  console.log('✅ Successfully saved credentials');
}

export async function authorize() {
  let client: any = await loadSavedCredentialsIfExist();
  if (client) {
    console.log('✅ Found existing credentials');
    return client;
  }
  console.log('💥 Missing credentials');
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
