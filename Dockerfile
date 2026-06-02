FROM oven/bun:1 AS frontend

WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/bun.lock ./
RUN bun install
COPY ./frontend ./
RUN bun run build

FROM golang:tip-alpine3.23 AS backend
WORKDIR /app
COPY backend/ .
COPY --from=frontend /app/frontend/dist ./frontend/dist
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o gorarparser .

FROM alpine:latest

WORKDIR /app
COPY --from=backend /app/gorarparser ./
RUN mkdir -p /app/frontend/dist
COPY --from=backend /app/gorarparser .
COPY --from=backend /app/frontend/dist ./frontend/dist
EXPOSE 4747

CMD ["./gorarparser"]
