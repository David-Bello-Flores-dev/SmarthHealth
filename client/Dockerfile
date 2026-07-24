# ---------- Build ----------

FROM node:20-alpine AS build

WORKDIR /app

COPY client/package*.json ./

RUN npm ci

COPY client/ ./

RUN npm run build

# ---------- Producción ----------

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
