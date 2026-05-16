import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});

app.use(notFound);
app.use(errorHandler);

export default app;