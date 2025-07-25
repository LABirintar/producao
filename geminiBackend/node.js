import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.LABIRINTAR_API_KEY);


app.post('/ask-gemini', async (req, res) => {
  const { prompt } = req.body;

  try {
    console.log("API Key carregada?", process.env.LABIRINTAR_API_KEY ? "SIM" : "NÃO");
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response;

    res.json({ text: response.text() });
  } catch (error) {
    console.error("Erro detalhado da API Google:", error);
    res.status(500).json({ error: error.message || "Erro ao consultar a IA" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
