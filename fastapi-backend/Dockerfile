FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /fastapi-backend

COPY .env.local /fastapi-backend/

WORKDIR /fastapi-backend
RUN uv sync --frozen --no-cache

WORKDIR /fastapi-backend/app

CMD ["uv", "run", "fastapi","dev", "--port", "80", "--host", "0.0.0.0"]

