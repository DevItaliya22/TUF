"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config();
// console.log(process.env.REDIS_URL);
const redisClient = new ioredis_1.default(process.env.REDIS_URL ?? "redis://red-cqsopmo8fa8c73dhltkg:6379");
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 500,
    duration: 10,
});
const rateLimitMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip || 'default_ip';
        await rateLimiter.consume(ip);
        next();
    }
    catch (rlRejected) {
        res.status(429).json({ message: 'Too Many Requests' });
    }
};
// Existing routes
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.get("/flashcards", async (req, res) => {
    const flashcards = await prisma.flashcard.findMany();
    res.status(200).json(flashcards);
});
app.get("/flashcards/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const flashcard = await prisma.flashcard.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json(flashcard);
    }
    catch (error) {
        res.json({ error: 'Failed to get flashcard' });
    }
});
app.post("/flashcards/create", async (req, res) => {
    const { question, answer } = req.body;
    try {
        const newFlashcard = await prisma.flashcard.create({
            data: {
                question,
                answer
            }
        });
        res.status(200).json(newFlashcard);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create flashcard' });
    }
});
app.post("/flashcards/update/:id", async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        const updatedFlashcard = await prisma.flashcard.update({
            where: {
                id: parseInt(id)
            },
            data: {
                question,
                answer
            }
        });
        res.status(200).json(updatedFlashcard);
    }
    catch (error) {
        res.json({ error: 'Failed to update flashcard' });
    }
});
app.post("/flashcards/delete/:id", rateLimitMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const card = await prisma.flashcard.delete({
            where: {
                id: parseInt(id)
            }
        });
        if (card) {
            res.json({ message: 'Flashcard deleted successfully' });
        }
    }
    catch (error) {
        res.status(200).json({ error: 'Failed to delete flashcard' });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
