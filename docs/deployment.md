# Deployment Guide

## Vercel Frontend

1. Create a Vercel project using `apps/web` as the root directory.
2. Set build command to `npm run build`.
3. Set output directory to `dist`.
4. Configure:

```text
VITE_API_URL=https://your-api.example.com/api
VITE_SOCKET_URL=https://your-api.example.com
```

## Render API

1. Create a Web Service from the repository.
2. Set root directory to `apps/api`.
3. Build command:

```bash
npm install && npm run build
```

4. Start command:

```bash
npm start
```

5. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, Cloudinary, and SMTP variables.

## AWS or Google Cloud Run

Build the API container:

```bash
docker build -f apps/api/Dockerfile -t family-tree-api .
```

Build the web container:

```bash
docker build -f apps/web/Dockerfile -t family-tree-web --build-arg VITE_API_URL=https://your-api.example.com/api --build-arg VITE_SOCKET_URL=https://your-api.example.com .
```

Push each image to your registry and deploy them as separate services. The API needs MongoDB access, Cloudinary credentials, SMTP credentials, and a strong `JWT_SECRET`.

## Production Notes

- Use MongoDB Atlas or a managed MongoDB service.
- Configure CORS with the exact frontend origin in `CLIENT_URL`.
- Enable Cloudinary credentials for profile photo persistence.
- Set SMTP variables before enabling real email invites.
- Put the API behind HTTPS before using JWTs in production.
