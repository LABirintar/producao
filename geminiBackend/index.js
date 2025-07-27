const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializa a API do Gemini usando a variável de ambiente API_KEY
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

/**
 * Função HTTP para o Cloud Functions
 * Endpoint: POST /assistente
 * Body esperado: { "prompt": "sua pergunta" }
 */
exports.assistente = async (req, res) => {
  // Habilita CORS para todas as origens
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Responde rápido a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send("Campo 'prompt' é obrigatório.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("Erro detalhado:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido" });
  }
};

