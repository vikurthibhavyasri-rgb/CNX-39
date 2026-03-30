import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/', async (req, res) => {

  const { message, history, language } = req.body;

  let languageInstruction = "English";
  if (language === 'hi') languageInstruction = "Hindi";
  if (language === 'te') languageInstruction = "Telugu";

  // Format history for the raw Google API
  const contents = [];
  if (Array.isArray(history)) {
    history.forEach(h => {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({ role: h.role, parts: [{ text: h.parts[0].text }] });
      }
    });
  }
  // Add the current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  const systemInstruction = {
    parts: [{
      text: `You are Svasthya, an empathetic youth wellbeing companion. 
      Your goal is to provide supportive, stigma-free guidance for mental health.
      IMPORTANT: Always respond in ${languageInstruction}. 
      If the user reaches out in distress, provide grounding exercises and suggest professional help gracefully.`
    }]
  };

  console.log(`Svasthya AI Request [Language: ${languageInstruction}]`);

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    // Using gemini-2.5-flash as the stable model
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Google API Error");
    }

    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you, but I'm having a quiet moment. Try again?";
    res.json({ text: botResponse });

  } catch (error) {
    console.error("DIRECT FETCH ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }

})

export default router