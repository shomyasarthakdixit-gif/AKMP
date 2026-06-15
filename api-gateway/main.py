from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import uvicorn

app = FastAPI(title="AKMP API Gateway")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/api").rstrip("/")
if not SPRING_BOOT_URL.endswith("/api"): SPRING_BOOT_URL += "/api"
NODE_JS_URL = os.getenv("NODE_JS_URL", "http://localhost:8001/api").rstrip("/")
if not NODE_JS_URL.endswith("/api"): NODE_JS_URL += "/api"

@app.get("/")
def read_root():
    return {"message": "Welcome to AKMP API Gateway"}

async def forward_request(request: Request, path: str, target_url: str):
    url = f"{target_url}/{path}"
    
    # Extract query params
    params = dict(request.query_params)
    
    # Extract headers (filtering out some hop-by-hop headers if necessary)
    headers = dict(request.headers)
    headers.pop("host", None)

    async with httpx.AsyncClient() as client:
        try:
            # Handle request body for methods that support it
            body = await request.body()
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                params=params,
                content=body
            )
            return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(exc)}")

@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_auth(request: Request, path: str):
    # Route to Spring Boot Auth controller
    return await forward_request(request, f"auth/{path}", SPRING_BOOT_URL)

@app.api_route("/api/v1/sql/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_sql(request: Request, path: str):
    # Route to Spring Boot standard controllers
    return await forward_request(request, path, SPRING_BOOT_URL)

@app.api_route("/api/v1/nosql/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_nosql(request: Request, path: str):
    # Route to Node.js / MongoDB backend
    return await forward_request(request, path, NODE_JS_URL)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)

