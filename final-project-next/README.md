
# Getting Started

### 1. Install dependencies

```bash
cd ./final-Project-Next
pnpm install
```

### 2. create .env.local file
```bash
DOMAIN= "https://localhost:3000"
GEMINI_API_KEY= <Your own key> # get at https://aistudio.google.com/apikey
YOUTUBE_API_KEY= <Your own key / contact Yoav> 
GEMINI_MODEL="gemini-2.0-flash"

USE_MOCK_YOUTUBE_DATA=true
STC_BACKEND_BASE_URL="http://localhost:8000"
```

### 3. Run the app
```bash
pnpm run dev:https / pnpm run dev
```