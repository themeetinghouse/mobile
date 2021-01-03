# The Meeting House Mobile App

![CodeQL](https://github.com/themeetinghouse/mobile/workflows/CodeQL/badge.svg)
![CI](https://github.com/themeetinghouse/mobile/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/themeetinghouse/mobile/badge.svg?branch=dev)](https://coveralls.io/github/themeetinghouse/mobile?branch=dev)

Currently supports iOS and Android.

## Development
This is a React Native app built using the Expo framework and written in TypeScript.

### Backend 
Shares an AWS AppSync API and AWS Cognito user authentication resources with [themeetinghouse/web](https://github.com/themeetinghouse/web).

### Local development
In the project directory run:
- `npm install`
- `npm start` (or `expo start`)

Note: this project does not run in the browser - please download the [Expo client](https://expo.io/tools#client) or use an iOS simulator or Android emulator.
