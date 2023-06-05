import path from 'path';

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.insert',
];

export const TOKEN_PATH = path.join(process.cwd(), 'token.json');
export const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
export const LABEL_TO_WATCH = process.env.LABEL_TO_WATCH;

export type Credentials = {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
};
