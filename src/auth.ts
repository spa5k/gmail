import { google } from 'googleapis';
import { authorize } from './login.js';

export const auth = await authorize();
export const gmail = google.gmail({ version: 'v1', auth });
