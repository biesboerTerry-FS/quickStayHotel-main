import express, { request, response } from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors());

//^ middleware
app.use(express.json());
app.use(clerkMiddleware());

//^ api to listen for clerk webhooks
app.post("/api/clerk", clerkWebhooks);

app.get("/", (request, response) => response.send("API is working, yo"));

const PORT = process.env.port || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
