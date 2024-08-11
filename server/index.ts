import express from "express";
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Sever is running");
});

// Get all flashcards
app.get("/flashcards", async (req: express.Request, res: express.Response) => {
  const flashcards = await prisma.flashcard.findMany();
  res.json(flashcards);
});

//Get flashCard by id
app.get("/flashcards/:id", async (req: express.Request, res: express.Response) => {
  const {id} = req.params;
  try{
    const flashcard = await prisma.flashcard.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    res.json(flashcard);
  }catch(error){
    res.json({error: 'Failed to get flashcard'});
  }
});

// Create a new flashcard
app.post("/flashcards/create", async (req: express.Request, res: express.Response) => {
  const { question, answer } = req.body;

  try {
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question,
        answer
      }
    });
    res.status(201).json(newFlashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

// Update a flashcard
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
    res.json(updatedFlashcard);
  } catch (error) {
    res.json({ error: 'Failed to update flashcard' });
  }
})

//delete a flashcard
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
    res.json({error: 'Failed to delete flashcard'});
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
