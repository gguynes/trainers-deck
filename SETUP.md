# The Trainer's Deck — Setup Guide

## What You Need First

1. **Node.js** — Download from https://nodejs.org (choose the LTS version)
2. **An Anthropic API key** — Get one at https://console.anthropic.com

## Setup Steps

### 1. Create your .env file
In the `trainers-deck` folder, copy `.env.example` and rename it to `.env`
Then open `.env` and paste your Anthropic API key after the `=` sign.

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. Install the app (one time only)
Open Terminal, navigate to this folder, and run:

```
npm install
```

### 3. Start the app
```
npm run dev
```

Then open your browser to: **http://localhost:5173**

## How to Use

1. Take a clear, well-lit photo of your Pokémon card
2. Click **Upload Photo** or **Take Photo**
3. The app will automatically identify the card and show you:
   - Card name, rarity, and set information
   - Current market price and where to buy it
   - Full Pokédex info about the Pokémon
   - Type strengths and weaknesses
   - Every game the Pokémon appears in
   - Links to buy or sell the card

## Tips for Best Results
- Make sure the card is fully visible and in focus
- Lay the card flat on a light, plain surface
- Good lighting makes a big difference
- The AI can usually read even slightly blurry photos

## Optional: Get Better Price Data
Sign up for a free API key at https://dev.pokemontcg.io
Add it to your `.env` file:
```
POKEMON_TCG_API_KEY=your-key-here
```
