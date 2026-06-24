export const TYPE_COLORS = {
  normal:   { bg: '#A8A878', dark: '#6D6D4E', text: '#fff' },
  fire:     { bg: '#F08030', dark: '#9C531F', text: '#fff' },
  water:    { bg: '#6890F0', dark: '#445E9C', text: '#fff' },
  grass:    { bg: '#78C850', dark: '#4E8234', text: '#fff' },
  electric: { bg: '#F8D030', dark: '#A1871F', text: '#333' },
  ice:      { bg: '#98D8D8', dark: '#638D8D', text: '#333' },
  fighting: { bg: '#C03028', dark: '#7D1F1A', text: '#fff' },
  poison:   { bg: '#A040A0', dark: '#682A68', text: '#fff' },
  ground:   { bg: '#E0C068', dark: '#927D44', text: '#333' },
  flying:   { bg: '#A890F0', dark: '#6D5E9C', text: '#fff' },
  psychic:  { bg: '#F85888', dark: '#A13959', text: '#fff' },
  bug:      { bg: '#A8B820', dark: '#6D7815', text: '#fff' },
  rock:     { bg: '#B8A038', dark: '#786824', text: '#fff' },
  ghost:    { bg: '#705898', dark: '#493963', text: '#fff' },
  dragon:   { bg: '#7038F8', dark: '#4924A1', text: '#fff' },
  dark:     { bg: '#705848', dark: '#49392F', text: '#fff' },
  steel:    { bg: '#B8B8D0', dark: '#787887', text: '#333' },
  fairy:    { bg: '#EE99AC', dark: '#9B6470', text: '#333' },
};

export const TYPE_ICONS = {
  normal:   '⚪',
  fire:     '🔥',
  water:    '💧',
  grass:    '🌿',
  electric: '⚡',
  ice:      '❄️',
  fighting: '🥊',
  poison:   '☠️',
  ground:   '🌍',
  flying:   '🦅',
  psychic:  '🔮',
  bug:      '🐛',
  rock:     '🪨',
  ghost:    '👻',
  dragon:   '🐉',
  dark:     '🌑',
  steel:    '⚙️',
  fairy:    '✨',
};

export const GAME_DISPLAY = {
  'red': { label: 'Pokémon Red', gen: 'I', color: '#C03028' },
  'blue': { label: 'Pokémon Blue', gen: 'I', color: '#6890F0' },
  'yellow': { label: 'Pokémon Yellow', gen: 'I', color: '#F8D030' },
  'gold': { label: 'Pokémon Gold', gen: 'II', color: '#C8A800' },
  'silver': { label: 'Pokémon Silver', gen: 'II', color: '#B8B8D0' },
  'crystal': { label: 'Pokémon Crystal', gen: 'II', color: '#98D8D8' },
  'ruby': { label: 'Pokémon Ruby', gen: 'III', color: '#C03028' },
  'sapphire': { label: 'Pokémon Sapphire', gen: 'III', color: '#6890F0' },
  'emerald': { label: 'Pokémon Emerald', gen: 'III', color: '#78C850' },
  'firered': { label: 'FireRed', gen: 'III', color: '#F08030' },
  'leafgreen': { label: 'LeafGreen', gen: 'III', color: '#78C850' },
  'diamond': { label: 'Pokémon Diamond', gen: 'IV', color: '#A890F0' },
  'pearl': { label: 'Pokémon Pearl', gen: 'IV', color: '#EE99AC' },
  'platinum': { label: 'Pokémon Platinum', gen: 'IV', color: '#B8B8D0' },
  'heartgold': { label: 'HeartGold', gen: 'IV', color: '#C8A800' },
  'soulsilver': { label: 'SoulSilver', gen: 'IV', color: '#B8B8D0' },
  'black': { label: 'Pokémon Black', gen: 'V', color: '#444' },
  'white': { label: 'Pokémon White', gen: 'V', color: '#eee' },
  'black-2': { label: 'Black 2', gen: 'V', color: '#444' },
  'white-2': { label: 'White 2', gen: 'V', color: '#eee' },
  'x': { label: 'Pokémon X', gen: 'VI', color: '#4444BB' },
  'y': { label: 'Pokémon Y', gen: 'VI', color: '#CC4444' },
  'omega-ruby': { label: 'Omega Ruby', gen: 'VI', color: '#C03028' },
  'alpha-sapphire': { label: 'Alpha Sapphire', gen: 'VI', color: '#6890F0' },
  'sun': { label: 'Pokémon Sun', gen: 'VII', color: '#F8D030' },
  'moon': { label: 'Pokémon Moon', gen: 'VII', color: '#A890F0' },
  'ultra-sun': { label: 'Ultra Sun', gen: 'VII', color: '#F08030' },
  'ultra-moon': { label: 'Ultra Moon', gen: 'VII', color: '#705898' },
  'sword': { label: 'Pokémon Sword', gen: 'VIII', color: '#6890F0' },
  'shield': { label: 'Pokémon Shield', gen: 'VIII', color: '#C03028' },
  'brilliant-diamond': { label: 'Brilliant Diamond', gen: 'VIII', color: '#A890F0' },
  'shining-pearl': { label: 'Shining Pearl', gen: 'VIII', color: '#EE99AC' },
  'legends-arceus': { label: 'Legends: Arceus', gen: 'VIII', color: '#705898' },
  'scarlet': { label: 'Pokémon Scarlet', gen: 'IX', color: '#C03028' },
  'violet': { label: 'Pokémon Violet', gen: 'IX', color: '#705898' },
};

export const RARITY_COLORS = {
  'Common':           { bg: '#888', label: '●' },
  'Uncommon':         { bg: '#4CAF50', label: '◆' },
  'Rare':             { bg: '#2196F3', label: '★' },
  'Holo Rare':        { bg: '#9C27B0', label: '★ Holo' },
  'Reverse Holo':     { bg: '#00BCD4', label: '✦ Holo' },
  'Ultra Rare':       { bg: '#FF9800', label: '★★' },
  'Secret Rare':      { bg: '#F44336', label: '★★★' },
  'Rainbow Rare':     { bg: 'linear-gradient(135deg,#F44336,#FF9800,#F8D030,#78C850,#6890F0,#9C27B0)', label: '🌈' },
  'Gold Secret Rare': { bg: '#C8A800', label: '✦ Gold' },
  'Promo':            { bg: '#607D8B', label: '★ Promo' },
  'Amazing Rare':     { bg: 'linear-gradient(135deg,#6890F0,#78C850)', label: '⬟ Amazing' },
  'VMAX Rare':        { bg: 'linear-gradient(135deg,#9C27B0,#F44336)', label: '★ VMAX' },
};

export function getTypeColor(type) {
  return TYPE_COLORS[type?.toLowerCase()] || { bg: '#888', dark: '#555', text: '#fff' };
}

export function formatStatName(name) {
  const map = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed',
  };
  return map[name] || name;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
