# AKMP - Accessible Knowledge Management Portal

## Live Deployment Links

This project has been fully deployed to the cloud using a microservices architecture on Render.

| Service | Live URL | Description |
|---|---|---|
| **Frontend Web App** | [https://akmp-frontend.onrender.com](https://akmp-frontend.onrender.com) | The main React Single Page Application (UI). |
| **API Gateway** | [https://akmp.onrender.com](https://akmp.onrender.com) | Python FastAPI gateway routing requests to backends. |
| **Backend (SQL)** | *Deployed on Render* | Spring Boot REST API for Users, Categories, and Courses. |
| **Backend (NoSQL)** | *Deployed on Render* | Node.js / MongoDB API for Reviews and Ratings. |
| **Database (SQL)** | *Managed PostgreSQL on Render* | Hosted PostgreSQL Database Instance. |
| **Database (NoSQL)** | *Managed MongoDB Atlas* | Hosted MongoDB Database Cluster. |

## GitHub Repository
The complete source code for all microservices is available here:
[https://github.com/shomyasarthakdixit-gif/AKMP](https://github.com/shomyasarthakdixit-gif/AKMP)

## Architecture Overview
- The Frontend communicates **only** with the API Gateway.
- The API Gateway safely routes requests to the internal SQL and NoSQL backends.
- The SQL Backend is synced with the NoSQL backend using a message broker / sync service to maintain consistency across the two databases.
