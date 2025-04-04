from fastapi import FastAPI
from .api.youtube_comments import routes as youtube_comments_routes

app = FastAPI(
    title="SM Insights API",
    description="API for SM Insights",
    version="1.0.0"
)

app.include_router(youtube_comments_routes.router) 

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
   