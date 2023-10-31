// src/config.js

let apiEndpoint;

if (process.env.NODE_ENV === 'development') {
    apiEndpoint = 'http://localhost:3000/dev/';  // Local serverless-offline endpoint
} else {
    apiEndpoint = 'https://7pvpeztz21.execute-api.us-east-1.amazonaws.com/dev/'; // AWS Lambda endpoint
}

export const API_ENDPOINT = apiEndpoint;

