FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_APP_NAME="Canteen Management System"
ARG VITE_APP_ENV=production
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_MICROSOFT_CLIENT_ID

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
ENV VITE_MICROSOFT_CLIENT_ID=${VITE_MICROSOFT_CLIENT_ID}

RUN npm run build

FROM alpine:3.20

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /srv

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

CMD ["sh", "-c", "tail -f /dev/null"]
