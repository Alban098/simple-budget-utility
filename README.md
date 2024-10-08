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

This tool needs to run behind an OpenID SSO Provider such as **Keycloak** or **Authentik**, to provide that functionality you must replace the appropriate configuration both in the backend and frontend

To do that, change the placeholder values in `frontend/src/index.tsx`, `frontend/src/App.tsx` and `api/src/main/resources/application.properties`
- **%%client_id%%** : retrieved from your OIDC Provider.
- **%%client_secret%%** : retrieved from your OIDC Provider.
- **%%authority%%** : retrieved from your OIDC Provider.
- **%%redirect_url%%** : default redirect URL of the SSO
- **%%db_host%%** : base URL/IP of your database, with port

### Deployment

GitHub workflow will, on push to main, automatically 
- populate the above-mentioned variables
- build a docker image
- push it to a private repository as the tagged **latest**
- A simple redeploy from **Portainer** or user a **Watchtower** Container will automatically update the Production environment

### Limitation

A lot of frontend request are redundant, but the goal of the application was to be up and running fast while learning frontend with React and not to be well optimised

Backend wise, all the Analysis is computed on demand, and could become slow if the number of transactions grows to big, a future improvement would be to make those analysis persisted in the Database and computed by batch jobs when needed.

### pre-commit
Think to run both `./gradlew :api:spotlessApply` and `./gradlew :frontend:reactLint` before commit 