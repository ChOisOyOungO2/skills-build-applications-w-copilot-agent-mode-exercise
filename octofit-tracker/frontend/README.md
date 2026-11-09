# Octofit Tracker frontend

React 19 presentation tier for Octofit Tracker, built with Vite, Bootstrap, and React Router.

## API configuration

In a GitHub Codespace, create `octofit-tracker/frontend/.env.local` and set:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend then sends API requests to `https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. Keep `.env.local` out of version control; restart Vite after changing it.

When `VITE_CODESPACE_NAME` is unset, requests use `http://localhost:8000`. The API client accepts either a JSON array or a paginated collection (`results`, `items`, or `data`).

## Run

```bash
npm --prefix octofit-tracker/frontend run dev
```
