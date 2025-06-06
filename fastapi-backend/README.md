uv # FastAPI Backend Project

This is the backend service for SM-insights, built with FastAPI and using UV as the package manager.

## Prerequisites

- Python 3.12 or higher
- UV package manager

## Installing UV

UV is a modern Python package manager that offers significant performance improvements over traditional package managers. To install UV, run:

```bash
pip install uv
```

## Project Setup

 Install dependencies using UV:
```bash
uv sync
```

## Running the Application

To run the development server:

1. Navigate to the app directory:
```bash
cd app
```

2. create .env file:
```bash
DOMAIN="https://localhost:8000"
GEMINI_API_KEY= <Your own key> # get at https://aistudio.google.com/apikey
YOUTUBE_API_KEY= <Your own key / contact Yoav> 
```

3. Start the server using UV:
```bash
uv run fastapi dev
```

The server will start and be available at `http://localhost:8000`


## Running with Docker

1. Build the Docker image:
```bash
docker build -t fastapi-backend .
```

2. Run the Docker container:
```bash
docker run -p 8000:8000 -d fastapi-backend
```

## API Documentation

Once the server is running, you can access:

- Interactive API documentation (Swagger UI) at `http://localhost:8000/docs`

- Alternative API documentation (ReDoc) at `http://localhost:8000/redoc`

