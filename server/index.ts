import express from "express";
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const redisClient = new Redis('redis://red-cqsopmo8fa8c73dhltkg:6379');

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 3, 
  duration: 10, 
});


app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip); 
    next(); 
  } catch (rlRejected) {
    res.status(429).json({ message: 'Too Many Requests' });
  }
});

// Existing routes
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Server is running");
});

app.get("/flashcards", async (req: express.Request, res: express.Response) => {
  const flashcards = await prisma.flashcard.findMany();
  res.status(200).json(flashcards);
});

app.get("/flashcards/:id", async (req: express.Request, res: express.Response) => {
  const {id} = req.params;
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    res.status(200).json(flashcard);
  } catch (error) {
    res.json({error: 'Failed to get flashcard'});
  }
});

app.post("/flashcards/create", async (req: express.Request, res: express.Response) => {
  const { question, answer } = req.body;
  try {
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question,
        answer
      }
    });
    res.status(200).json(newFlashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

app.post("/flashcards/update/:id", async (req: express.Request, res: express.Response) => {
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
  } catch (error) {
    res.json({ error: 'Failed to update flashcard' });
  }
});

app.post("/flashcards/delete/:id", async (req: express.Request, res: express.Response) => {
  const {id} = req.params;
  try {
    const card = await prisma.flashcard.delete({
      where:{
        id:parseInt(id)
      }
    });
    if(card){
      res.json({message: 'Flashcard deleted successfully'});
    }
  } catch (error) {
    res.status(200).json({error: 'Failed to delete flashcard'});
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
