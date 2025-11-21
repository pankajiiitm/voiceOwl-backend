# VoiceOwl Backend – Developer Evaluation Task  
A minimal backend API built using **Node.js**, **TypeScript**, and **MongoDB** as part of the VoiceOwl developer evaluation task.  
The service accepts an **audio file URL**, performs a **mock transcription**, and stores the result in MongoDB.

---

## 🌐 Live Demo (Deployed on Render)

### **Frontend (React)**
🔗 https://voiceowl-frontend.onrender.com/

### **Backend API**
🔗 https://voiceowl-backend.onrender.com/api/

---

## 📸 Screenshot of UI  
![VoiceOwl Screenshot](/mnt/data/b92a5027-89fb-43f1-9888-042c2decf934.png)

## 🚀 Features
- Accept audio URL and generate transcription  
- Mock transcription engine  
- Store transcription records in MongoDB  
- REST API endpoints (create + list + get by ID)  
- Clean modular architecture  
- Built with TypeScript  
- Ready for Postman, Swagger, and Docker

---

## 📁 Folder Structure
```
voiceowl-backend/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── types/
│
├── tests/
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack
- Node.js  
- Express.js  
- TypeScript  
- MongoDB (Mongoose)  

---

## 📦 Installation
### 1. Clone Project
```bash
git clone https://github.com/your-username/voiceowl-backend.git
cd voiceowl-backend
```

### 2. Install Packages
```bash
npm install
```

### 3. Add `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/voiceowl
```

---

## ▶️ Run Project
### Dev Mode
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

---

## 🔗 API Endpoints

### 1️⃣ Create Transcription  
**POST** `/api/transcriptions`

#### Body:
```json
{
  "audioUrl": "https://example.com/audio.mp3"
}
```

---

### 2️⃣ Get All Transcriptions  
**GET** `/api/transcriptions`

---

### 3️⃣ Get Transcription by ID  
**GET** `/api/transcriptions/:id`

---

## 🧪 Mock Transcription Engine
The mock engine generates a fake transcription string + simulates delay.

File: `src/utils/mockTranscription.ts`

---

## 🗄️ MongoDB Schema
```
{
  audioUrl: String,
  transcription: String,
  status: "pending" | "completed",
  createdAt: Date
}
```

---

## 📤 POSTMAN COLLECTION (IMPORT READY)

Save the following JSON as `VoiceOwl.postman_collection.json` and import into Postman:

```json
{
  "info": {
    "name": "VoiceOwl Backend APIs",
    "_postman_id": "12345-voiceowl",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Transcription",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"audioUrl\": \"https://example.com/audio.mp3\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/transcriptions",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "transcriptions"]
        }
      }
    },
    {
      "name": "Get All Transcriptions",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/transcriptions",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "transcriptions"]
        }
      }
    },
    {
      "name": "Get Transcription by ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/api/transcriptions/:id",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "transcriptions", ":id"]
        }
      }
    }
  ]
}
```

---

## 📘 Swagger Documentation (Optional)

Add this file: `src/swagger.ts`

```ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VoiceOwl Backend API",
      version: "1.0.0"
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
```

Inside `app.ts`:

```ts
import { swaggerSpec, swaggerUi } from "./swagger";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

Visit Swagger:  
👉 **http://localhost:5000/docs**

---

## 🐳 Docker Setup

### `Dockerfile`
```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### `docker-compose.yml`
```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/voiceowl
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    restart: always
    ports:
      - "27017:27017"
```

Run:
```bash
docker-compose up --build
```

---

## 🤝 Contribution
This repository is part of an evaluation and not open for external contributions.

---

## 📄 License
MIT License
