import express from "express";

import routes from "./routes";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: "*", // Whitelist your Vite ports
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "Server is healthy"
    });
});

app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;