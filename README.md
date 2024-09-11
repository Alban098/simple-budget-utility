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

That tool is meant to run behind an **OpenID** SSO, such as **Keycloak** or **Authentik**,
for that you will need to configure some **environment variables** for Spring to pick up, ether in a `.env` or system wise.

- **CLIENT_ID** : retrieved from your OIDC Provider.
- **CLIENT_SECRET** : retrieved from your OIDC Provider.
- **SSO_ISSUER_URL** : retrieved from your OIDC Provider.
- **HOST_URL** : base URL of your server, used to construct the redirect URL after login.
- **BD_HOST** : base URL/IP of your database, with port

### pre-commit

To investigate
