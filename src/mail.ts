import { gmail } from './auth.js';
import { LABEL_TO_WATCH } from './config.js';

/**
 * Get the IDs of emails that are not labeled with the label to watch.
 * @param testLabelOnly If true, only emails with the label:test will be processed.
 * @param unreadOnly If true, only unread emails will be processed.
 * @returns The IDs of the emails.
 * @see https://developers.google.com/gmail/api/v1/reference/users/messages/list
 * @example
 * const emailIds = await getEmailIds({ testLabelOnly: false, unreadOnly: true });
 * if (!emailIds) {
 *    return;
 * }
 */
export const getEmailIds = async ({
  testLabelOnly,
  unreadOnly,
}: {
  testLabelOnly: boolean;
  unreadOnly: boolean;
}) => {
  const labelQuery = `-label:${LABEL_TO_WATCH} ${
    testLabelOnly ? 'label:test' : ''
  } newer_than:1d AND -from:me ${unreadOnly ? 'is:unread' : ''}`;
  console.log('🟢 Searching with query: ', labelQuery);

  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: labelQuery, // remove the label:test if you want to process all emails
      maxResults: 10,
      includeSpamTrash: true,
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log('🟥 No messages found.');
      return [];
    }

    // Get the threadIds of all messages
    const threadIds = messages.map((message) => message.threadId);

    // Filter out messages that are not the first in their threads
    const firstTimeEmails = messages.filter((message) => {
      const index = threadIds.indexOf(message.threadId);
      return index === threadIds.lastIndexOf(message.threadId);
    });

    // Extract and return the IDs of the first-time email threads
    const emailIds = firstTimeEmails.map((message) => message.id);

    return emailIds;
  } catch (err) {
    console.error('The API returned an error:', err);
    return [];
  }
};

/**
 * Get the content of an email. and send a reply.
 * @param emailId The id of the email.
 * @example
 * await processEmailById(emailId);
 */
export const processEmailById = async (emailId: string) => {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: emailId,
  });
  const message = res.data;
  const subject = message.payload.headers.find(
    (header) => header.name === 'Subject'
  );
  const headers = message.payload.headers;
  const fromEmail = headers.find((header) => header.name === 'From');
  console.log('⛑️  Subject:', subject.value);
  console.log('👤  From:', fromEmail.value);

  await replyToEmail(emailId, 'This is an automated reply.', fromEmail.value);
};

/**
 * Add a label to an email.
 * If the label does not exist, it will be created.
 * @param emailId The id of the email.
 * @example
 * await addLabelToEmail(emailId);
 */
export const addLabelToEmail = async (emailId: string) => {
  const labels = await gmail.users.labels.list({ userId: 'me' });
  const label = labels.data.labels.find(
    (label) => label.name === LABEL_TO_WATCH
  );

  if (!label) {
    console.log('🏷️  Creating label:', LABEL_TO_WATCH);
    await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: LABEL_TO_WATCH,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });
  }

  try {
    console.log('🏷️  Adding label:', LABEL_TO_WATCH);
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [label.id],
      },
    });
  } catch (error) {
    if (
      error.response.status === 400 &&
      error.response.data.error.message === 'Invalid label'
    ) {
      console.log('🏷️  Label does not exist:', LABEL_TO_WATCH);
      return;
    }
    console.error('🏷️  Failed to add label:', LABEL_TO_WATCH);
    throw error;
  }
};
/**
 * Reply to an email with a message.
 * Email be encoded in base64.
 * @param emailId The id of the email to reply to.
 * @param message The message to send in the reply.
 * @param to The email address to send the reply to.
 * @returns A Promise that resolves when the reply is sent.
 * @example
 * await replyToEmail(emailId, "Thank you for your email!", "example@example.com");
 */
export const replyToEmail = async (
  emailId: string,
  message: string,
  to: string
) => {
  try {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
    });
    const threadId = res.data.threadId;
    const base64EncodedEmail = Buffer.from(
      `To: ${to}\r\n` +
        `Subject: Re: ${
          res.data.payload.headers.find((header) => header.name === 'Subject')
            .value
        }\r\n\r\n` +
        `${message}`
    ).toString('base64');

    const requestBody = {
      threadId: threadId,
      raw: base64EncodedEmail,
    };

    await addLabelToEmail(emailId);
    console.log('📤 Sending reply to...', to);
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: requestBody,
    });
  } catch (error) {
    console.error('⛔  Error replying to email:', error);
  }
};
