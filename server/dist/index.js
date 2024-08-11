"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Sever is running");
});
// Get all flashcards
app.get("/flashcards", async (req, res) => {
    const flashcards = await prisma.flashcard.findMany();
    res.json(flashcards);
});
//Get flashCard by id
app.get("/flashcards/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const flashcard = await prisma.flashcard.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(flashcard);
    }
    catch (error) {
        res.json({ error: 'Failed to get flashcard' });
    }
});
// Create a new flashcard
app.post("/flashcards/create", async (req, res) => {
    const { question, answer } = req.body;
    try {
        const newFlashcard = await prisma.flashcard.create({
            data: {
                question,
                answer
            }
        });
        res.status(201).json(newFlashcard);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create flashcard' });
    }
});
// Update a flashcard
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
        res.json(updatedFlashcard);
    }
    catch (error) {
        res.json({ error: 'Failed to update flashcard' });
    }
});
//delete a flashcard
app.post("/flashcards/delete/:id", async (req, res) => {
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
        res.json({ error: 'Failed to delete flashcard' });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
