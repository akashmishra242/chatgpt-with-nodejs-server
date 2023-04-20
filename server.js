const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

// create an Express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

// Store conversation history
const conversation = [];

app.get('/', async (req, res) => {
  res.status(200).send({
      message: 'Hello from GPT-3'
  })
})

// Define a route to handle incoming requests
app.post('/query', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["#", ";"],
    });
    const botResponse = response.data.choices[0].text;

    // Add current conversation to history
    conversation.push({ user: prompt, bot: botResponse });

    res.status(200).send({
      conversation: conversation
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong')
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
