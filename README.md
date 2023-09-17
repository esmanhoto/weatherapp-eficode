# Weather Forecast App

## Overview

The Weather Forecast App allows users to view the current temperature as well as the forecast for the next five days. The application is built using modern web development tools and is deployed on AWS for scalability and reliability.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Running via Docker](#running-via-docker)
    - [Backend](#backend-2)
    - [Frontend](#frontend-2)
  - [Running with Docker Compose](#running-with-docker-compose)
- [Deployment](#deployment)
  - [Backend Deployment with Lambda + API Gateway](#backend-deployment-with-lambda--api-gateway)
  - [Frontend Deployment with CloudFront + S3](#frontend-deployment-with-cloudfront--s3)
- [Testing](#testing)
  - [Backend Tests](#backend-tests)
  - [Frontend Tests](#frontend-tests)
    - [Robot Framework](#robot-framework)
    - [Integration Tests with Playwright and Robot Framework](#integration-tests-with-playwright-and-robot-framework)
    - [Cypress](#cypress)
- [License](#license)

## Architecture

### Backend

- Written in JavaScript, powered by Node.js.
- Utilizes `koa` for the web framework, and `node-fetch` for data fetching.
- Deployed as a serverless function using AWS Lambda and accessible via AWS API Gateway.

### Frontend

- Developed using React (version 16.13.1).
- Bundled and optimized using `webpack`.
- Dev dependencies include Babel for transpilation, ESLint for linting, Prettier for code formatting, and TypeScript for static type checking.
- Makes calls to the backend API to fetch weather data.
- Deployed and distributed via AWS CloudFront and hosted on AWS S3.

## Getting Started

To get started with the Weather Forecast App, you can run it either locally or via Docker.

#### Prerequisites

- Docker installed.
- AWS CLI and SAM CLI installed.
- Node.js and npm installed.

### Running Locally

#### Backend

1. Clone the repository: `git clone git@github.com:esmanhoto/weatherapp-eficode.git`.
2. Navigate to the backend directory: `cd weatherapp-backend`.
3. Install dependencies: `npm install`.
4. Start the local development server: `npm run dev`.

#### Frontend

1. Navigate to the frontend directory from the root: `cd weatherapp-frontend`.
2. Install dependencies: `npm install`.
3. Start the local development server: `npm start`.

### Running via Docker

For both the frontend and backend services, Docker containers are provided for isolated and consistent execution.

#### Backend

1. Navigate to the backend directory.
2. Build the Docker image: `docker build -t weatherapp-backend .`
3. Run the Docker container: `docker run -p 9000:9000 weatherapp-backend`

#### Frontend

1. Navigate to the frontend directory.
2. Build the Docker image: `docker build --build-arg ENDPOINT=http://backend:9000/api/weather -t weatherapp-frontend .`
3. Run the Docker container: `docker run -p 8000:8000 weatherapp-frontend`

#### Running with Docker Compose

For an integrated development experience with both frontend and backend running concurrently, you can use Docker Compose:

1. Navigate to the root directory where the docker-compose.yml is located.
2. Start both services using Docker Compose:
3. `docker-compose up`

This will build and run both the frontend and backend services, making them communicate with each other using the configured endpoints.

## Deployment

For this project a serverless architecture was chose for it has several benefits:

**Scalability**: Serverless architectures auto-scale by design, ensuring the app can handle any number of users without manual intervention.
**Cost-Efficiency**: You only pay for what you use, with no overhead costs for idle server instances.
**Reduced Overhead**: Removes the need for constant server management, streamlining operations.
**Rapid Deployment**: With tools like the Serverless Application Model (SAM) for the backend and AWS CloudFront for the frontend, deployment is seamless and fast.

### Backend Deployment with Lambda + API Gateway

Using the SAM CLI simplifies the deployment process, integrates well with AWS services, and provides a framework to build serverless applications quickly:
Deploy the backend using the SAM CLI:

1. Navigate to the backend AWS directory.
2. Run `sam build` to package the application.
3. Deploy the application using `sam deploy --guided` and follow the on-screen prompts.

### Frontend Deployment with CloudFront + S3

Instead of manually deploying the frontend, a shell script named deploy.sh has been crafted to automate the build and deployment process:

```shell
#!/bin/bash

rm -rf build
npm ci
npm run build
aws s3 sync ./build s3://weather-forecast-frontend/ --delete --profile weather-app
RESPONSE_CLOUDFRONT=$(aws cloudfront create-invalidation --distribution-id EA0AFQU62UXQO --paths "/*" --profile weather-app)
echo $RESPONSE_CLOUDFRONT
```

To deploy the frontend:

1. Ensure you have the necessary AWS profiles and permissions set up.
2. Navigate to the frontend directory.
3. Run the shell script: ./deploy.sh (You might need to grant execute permissions using chmod +x deploy.sh before running it).

## Testing

This project emphasizes the importance of quality assurance through a comprehensive testing approach. We have employed a range of tools and methodologies for testing both the backend and frontend of the application.

### Backend Tests

The backend of the Weather Forecast App is tested using the Mocha testing framework with the supertest library for API endpoint testing and chai for assertions.

#### Instructions to run the backend tests:

1. Navigate to the backend directory `cd weatherapp-backend`
2. Install dependencies `npm install`
3. Run the tests `npm test`

##### Important Note before Running Tests

Before running the tests, ensure that no other services, applications or Docker containers are running on port 9000. If the application's port is already in use, the tests might fail with an EADDRINUSE: address already in use error.

1. If you're running the application in Docker containers:
   You need to stop them before executing the tests: `docker-compose down`

2. If you're running the application locally:
   Ensure you stop the application by pressing CTRL+C in the terminal where it's running before initiating the tests.

### Frontend Tests

The frontend has been tested using a mix of methodologies to ensure the robustness and quality of the UI components and interactions.

#### Robot Framework

Robot Framework has been employed to test the frontend through the SeleniumLibrary for browser automation.

##### Instructions to run Robot Framework tests:

Before initiating the Robot Framework tests, it's crucial to have both the backend and frontend services running. You can either run them locally or through Docker containers.
After confirming both services are active, you can proceed with the Robot Framework tests:

1. Navigate to the frontend directory `cd weatherapp-frontend`
2. Run the robot tests `robot robots_tests/weather_forecast.robot`

Integration Tests with Playwright and Robot Framework
We've incorporated integration tests using Playwright and Robot Framework, which are containerized for ease of execution.

##### Instructions to run the integration tests using Docker:

1. Navigate to the root directory where the integration_tests folder is located.
2. Build the Docker image for the integration tests `docker build -t weatherapp-tests .`
   (This image takes quite a while)
3. Make sure the backend and frontend docker containers are running, change to root folder, and run the command

```
   docker run --network="host" \
   -v $(pwd)/integration_tests:/home/pwuser/tests \
   weatherapp-tests \
   bash -c "robot --outputdir /home/pwuser/tests/results /home/pwuser/tests/weather_forecast.robot"
```

After running the tests, their logs appear in a folder called 'results' inside the 'integration_tests' folder.

#### Cypress

Cypress, a popular end-to-end testing framework, has been incorporated for frontend tests, providing both standard testing and tests with mocked data to ensure UI consistency regardless of the API's data state.
Before initiating the Cypress tests, it's crucial to have both the backend and frontend services running. You can either run them locally or through Docker containers.

##### Instructions to run Cypress tests:

1. Navigate to the frontend directory `cd weatherapp-frontend`
2. Install dependencies`npm install`
3. Open Cypress interactive test runner `npx cypress open` and run the tests available.

## License

This project is currently unlicensed. Please consult the repository owner before using or distributing this code.

---

Created with 💙 by Eduardo
