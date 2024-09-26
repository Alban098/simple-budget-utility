# Simple Budget Utility

## Introduction

This project has one and only one purpose : Being used to track my personal budget, therefor it is tuned for my specific needs
and I do not plan to expand it too much.

### What this application is supposed to be able to do

- **Track** personal budget in a simple way
- **Classify** expenses in **Categories** automatically (maybe using a well-designed LLM ?)
- Show nice and simple **Visualizations**, filterable by Account, Category, Date ranges ...
- **Register** transactions to account in a non-convoluted way
- **Import** PDF **Account Statements** from different Banks

## Configuration

Some step to follow before running the application locally.

### Environment variables

This tool needs to run behind an OpenID SSO Provider such as **Keycloak** or **Authentik**, to provide that functionality you must replace the appropriate configuration both in the backend and frontend

To do that, change the placeholder values in `frontend/src/index.tsx`, `frontend/src/App.tsx` and `api/src/main/resources/application.properties`
- **CLIENT_ID** : retrieved from your OIDC Provider.
- **CLIENT_SECRET** : retrieved from your OIDC Provider.
- **SSO_ISSUER_URL** : retrieved from your OIDC Provider.
- **BD_HOST** : base URL/IP of your database, with port

### Deployment

No automation for now, just do the following
- `./gradlew :api:spotlessApply` will format the code for the build to succeed
- `./gradlew bundleApp` will bundle the frontend, embed it to be served by Springboot then build the backend
- Copy `api/build/libs/api.jar` and `Dockerfile` in a separate folder and build the docker image
- That docker image can be deployed and the application will run under port 8080 (can be remapped via Docker)

Planning to do an automation pipeline to automatically replace SSO configuration and create the docker image.

### Limitiation

A lot of frontend request are redundant, but the goal of the application was to be up and running fast while learning frontend with React and not to be well optimised

Backend wise, all the Analysis is computed on demand, and could become slow if the number of transactions grows to big, a future improvement would be to make those analysis persisted in the Database and computed by batch jobs when needed.

### pre-commit
Think to run both `./gradlew :api:spotlessApply` and `./gradlew :frontend:reactLint` before commit 