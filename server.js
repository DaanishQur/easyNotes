require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require("@openai/client");

const app = express();
app.use(express.json()); // For parsing application/json

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/organize-notes', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // or the latest model you prefer
      prompt: `Organize the following notes:\n\n${text}`,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.json({ organizedText: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error organizing notes');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
