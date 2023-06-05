import 'dotenv/config';
import cron from 'node-cron';
import { getEmailIds, processEmailById } from './mail.js';

const processEmails = async () => {
  const emailIds = await getEmailIds({
    testLabelOnly: false,
    unreadOnly: true,
  });
  if (!emailIds) {
    return;
  }
  for (const emailId of emailIds) {
    console.log('🔷 Going to process:', emailId);
    await processEmailById(emailId);
  }
  console.log('Done.');
};

// Add signal handler to catch SIGINT signal and exit cleanly
process.on('SIGINT', () => {
  console.log('Closing...');
  process.exit(0);
});

await processEmails();

// Schedule cron job to run processEmails every 45 seconds
cron.schedule('*/45 * * * * *', async () => {
  console.log('♾️ Running cron job...');
  await processEmails();
});
