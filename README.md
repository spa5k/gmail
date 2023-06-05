# Gmail API usage

## Generating Gmail OAuth Credentials for Desktop in 5 Lines

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the Gmail API.
3. Create OAuth 2.0 credentials for a desktop application.
4. Download the credentials file and save it to your project directory.
5. Use the credentials file to authenticate your Gmail API requests.

## How to use

1. Install the packages.
   ```bash
   npm install
   ```
2. Get the credentails, use this guide - [NodeJS quick start](https://developers.google.com/gmail/api/quickstart/nodejs)
3. Run the script.
   ```bash
   npm run dev
   ```

## Libraries used

- @google-cloud/local-auth: This library provides a simple way to authenticate with Google Cloud services using a local web server. It is used to authenticate with the Gmail API in this project.

- dotenv: This library loads environment variables from a .env file into process.env. It is used to load the Gmail API credentials from a .env file.

- googleapis: This library provides a way to interact with Google APIs using JavaScript. It is used to create a gmail object for the Gmail API.

- node-cron: This library provides a way to schedule recurring tasks in Node.js using a cron-like syntax. It is used in this project to schedule the processEmails function to run every 45 seconds. The syntax for node-cron is similar to the syntax used in a Unix cron job, with fields for specifying the minute, hour, day of the month, month, and day of the week. In this project, we are using a simple syntax of _/45 _ \* \* \* \*, which means "**run every 45 seconds**".

## Improvement

### While the current implementation of the project is functional, there are several areas that could be improved:

- Error handling: The current implementation does not handle errors very well. For example, if the Gmail API request fails, the script will simply crash. It would be better to handle errors gracefully and provide more informative error messages to the user.

- Code organization: The current implementation is a single folder with all the code in one place. As the project grows, it may become difficult to maintain and debug. It would be better to organize the code into separate modules and files.

- Testing: The current implementation does not include any automated tests. Adding tests would help ensure that the code works as expected and prevent regressions.

- Documentation: While the README file provides some information on how to use the project, it could be improved with more detailed instructions and examples.

- Performance: The current implementation retrieves all messages according to the label from the Gmail API every time the script is run. This could become slow if there are a large number of messages. It would be better to implement pagination or filtering to retrieve only the messages that are needed.

- Logging: The current implementation does not include any logging. Adding logging would make it easier to debug issues and monitor the script's activity.

- Failure case: If email sending fails, the label will still be added, we should add a fail safe that removes the label if process of sending fails.

- Lint: Add linting to the project.
