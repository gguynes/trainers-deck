import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/analyze-card', async (req, res) => {
  try {
    const { imageData, mediaType } = req.body;

    const imageSource = {
      type: 'base64',
      media_type: mediaType || 'image/jpeg',
      data: imageData,
    };

    // Step 1: Read HP precisely from the card image
    const hpResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          { type: 'text', text: 'Look only at the upper-right corner of this Pokemon card. There is a number printed next to the letters "HP". What is that exact number? Reply with only the number, nothing else.' }
        ]
      }]
    });

    const hpText = hpResponse.content[0].text.trim();
    const confirmedHP = parseInt(hpText.replace(/\D/g, ''), 10) || null;

    // Step 2: Full card analysis with the confirmed HP injected
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          {
            type: 'text',
            text: `You are a Pokemon card expert. Analyze this Pokemon trading card and return a JSON object with all the details you can see. Read text directly from the card.

The HP on this card is ${confirmedHP !== null ? confirmedHP : 'unknown — read it from the upper-right corner next to the letters HP'}.

Return ONLY valid JSON with no markdown code blocks or extra text:
{
  "pokemonName": "base Pokemon name only (e.g. Charizard, Pikachu)",
  "cardName": "full name printed on card (e.g. Charizard VMAX, Pikachu V)",
  "setName": "expansion/set name (e.g. Champion's Path, Base Set)",
  "setCode": "set abbreviation if visible",
  "cardNumber": "card number printed (e.g. 074/073)",
  "rarity": "rarity symbol meaning: Common, Uncommon, Rare, Holo Rare, Reverse Holo, Ultra Rare, Secret Rare, Rainbow Rare, Gold Secret Rare, Promo, etc.",
  "hp": ${confirmedHP !== null ? confirmedHP : 'read from card'},
  "types": ["Fire"],
  "stage": "Basic, Stage 1, Stage 2, VMAX, VSTAR, GX, EX, V, Mega EX, etc.",
  "attacks": [{"name": "attack name", "damage": "120", "cost": ["Fire", "Fire", "Colorless"], "description": "attack effect text"}],
  "abilities": [{"name": "ability name", "description": "ability effect text"}],
  "weakness": {"type": "Water", "modifier": "x2"},
  "resistance": {"type": "Fighting", "modifier": "-30"},
  "retreatCost": 3,
  "flavorText": "any flavor or Pokedex text on the card",
  "artist": "illustrator name if printed on card",
  "era": "one of: Base Set Era, Neo Era, E-Card Era, EX Era, Diamond & Pearl Era, HeartGold SoulSilver Era, Black & White Era, XY Era, Sun & Moon Era, Sword & Shield Era, Scarlet & Violet Era"
}`,
          }
        ]
      }]
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not read card details');
    const cardData = JSON.parse(jsonMatch[0]);

    // Always trust the dedicated HP read over anything in the JSON
    if (confirmedHP) cardData.hp = confirmedHP;

    res.json({ success: true, card: cardData });
  } catch (error) {
    console.error('Error analyzing card:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/card-prices', async (req, res) => {
  try {
    const { name, setName } = req.query;

    let query = `name:"${name}"`;
    if (setName) query += ` set.name:"${setName}"`;

    const headers = {};
    if (process.env.POKEMON_TCG_API_KEY) {
      headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY;
    }

    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      params: { q: query, pageSize: 20, orderBy: '-set.releaseDate' },
      headers,
      timeout: 10000,
    });

    res.json({ success: true, cards: response.data.data });
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    res.status(500).json({ success: false, error: error.message, cards: [] });
  }
});

app.get('/api/pokemon/:name', async (req, res) => {
  try {
    const name = req.params.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const [pokemonRes, speciesRes] = await Promise.allSettled([
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`, { timeout: 8000 }),
      axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`, { timeout: 8000 }),
    ]);

    if (pokemonRes.status === 'rejected') {
      return res.json({ success: false, error: 'Pokemon not found in database' });
    }

    const pokemon = pokemonRes.value.data;
    const species = speciesRes.status === 'fulfilled' ? speciesRes.value.data : null;

    const typeDataResults = await Promise.allSettled(
      pokemon.types.map(t => axios.get(t.type.url, { timeout: 5000 }))
    );

    const typeMatchups = {};
    for (const result of typeDataResults) {
      if (result.status === 'fulfilled') {
        const td = result.value.data;
        td.damage_relations.double_damage_from.forEach(t => {
          typeMatchups[t.name] = (typeMatchups[t.name] || 1) * 2;
        });
        td.damage_relations.half_damage_from.forEach(t => {
          typeMatchups[t.name] = (typeMatchups[t.name] || 1) * 0.5;
        });
        td.damage_relations.no_damage_from.forEach(t => {
          typeMatchups[t.name] = 0;
        });
        td.damage_relations.double_damage_to.forEach(t => {
          if (!typeMatchups.__offensiveSE) typeMatchups.__offensiveSE = [];
          if (!typeMatchups.__offensiveSE.includes(t.name)) typeMatchups.__offensiveSE.push(t.name);
        });
      }
    }

    const offensiveSE = typeMatchups.__offensiveSE || [];
    delete typeMatchups.__offensiveSE;

    const weaknesses = Object.entries(typeMatchups).filter(([, v]) => v > 1).map(([t, v]) => ({ type: t, multiplier: v }));
    const resistances = Object.entries(typeMatchups).filter(([, v]) => v > 0 && v < 1).map(([t, v]) => ({ type: t, multiplier: v }));
    const immunities = Object.entries(typeMatchups).filter(([, v]) => v === 0).map(([t]) => ({ type: t, multiplier: 0 }));

    const descriptions = species?.flavor_text_entries?.filter(e => e.language.name === 'en') || [];
    const description = descriptions[descriptions.length - 1]?.flavor_text?.replace(/\f|\n/g, ' ') || null;

    res.json({
      success: true,
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(t => t.type.name),
        height: pokemon.height,
        weight: pokemon.weight,
        baseStats: pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
        abilities: pokemon.abilities.map(a => ({ name: a.ability.name.replace(/-/g, ' '), isHidden: a.is_hidden })),
        games: pokemon.game_indices.map(g => g.version.name),
        generation: species?.generation?.name || null,
        sprite: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
        description,
        category: species?.genera?.find(g => g.language.name === 'en')?.genus || null,
        captureRate: species?.capture_rate,
        isLegendary: species?.is_legendary,
        isMythical: species?.is_mythical,
        weaknesses,
        resistances,
        immunities,
        offensiveSE,
      }
    });
  } catch (error) {
    console.error('Error fetching Pokemon:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve built React app in production
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 The Trainer's Deck server running at http://localhost:${PORT}`);
  console.log(`🔑 ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'SET ✅' : 'MISSING ❌'}`);
  if (!existsSync(distPath)) console.log('📡 Frontend dev server should be at http://localhost:5173\n');
});
