import TypeBadge from './TypeBadge.jsx';
import TypeMatchups from './TypeMatchups.jsx';
import PriceSection from './PriceSection.jsx';
import { getTypeColor, GAME_DISPLAY, formatStatName, capitalize } from '../utils/typeData.js';

function StatBar({ name, value }) {
  const pct = Math.min(100, (value / 255) * 100);
  const color = value >= 100 ? '#78C850' : value >= 60 ? '#F8D030' : '#F08030';
  return (
    <div className="stat-row">
      <span className="stat-name">{formatStatName(name)}</span>
      <span className="stat-val">{value}</span>
      <div className="stat-bar-bg">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function EnergyIcon({ type }) {
  const color = getTypeColor(type);
  return (
    <span className="energy-icon" style={{ background: color.bg, color: color.text }}>
      {type === 'Colorless' ? '⬜' : type?.charAt(0) || '?'}
    </span>
  );
}

export default function CardResult({ card, pokemon, tcgCards, cardImage }) {
  if (!card) return null;

  const primaryType = card.types?.[0] || pokemon?.types?.[0];
  const themeColor = getTypeColor(primaryType);

  const genLabel = pokemon?.generation
    ? pokemon.generation.replace('generation-', 'Generation ').toUpperCase()
    : null;

  const uniqueGames = [...new Set(pokemon?.games || [])];
  const genGroups = {};
  uniqueGames.forEach(g => {
    const info = GAME_DISPLAY[g];
    const gen = info?.gen || '?';
    if (!genGroups[gen]) genGroups[gen] = [];
    genGroups[gen].push({ key: g, ...(info || { label: capitalize(g), color: '#888' }) });
  });

  return (
    <div className="result-root" style={{ '--theme-color': themeColor.bg, '--theme-dark': themeColor.dark }}>

      {/* ── Header Banner ── */}
      <div className="result-banner" style={{ background: `linear-gradient(135deg, ${themeColor.dark}, ${themeColor.bg})` }}>
        <div className="banner-left">
          {cardImage && <img src={cardImage} alt="Your card" className="card-thumb" />}
        </div>
        <div className="banner-center">
          <div className="card-name-row">
            <h1 className="card-main-name">{card.cardName || card.pokemonName}</h1>
            {card.stage && <span className="stage-badge">{card.stage}</span>}
          </div>
          {card.hp && <div className="card-hp">HP {card.hp}</div>}
          <div className="type-row">
            {(card.types || pokemon?.types || []).map(t => (
              <TypeBadge key={t} type={t} size="lg" />
            ))}
          </div>
          {card.setName && (
            <div className="set-line">
              <span>📦 {card.setName}</span>
              {card.cardNumber && <span> · #{card.cardNumber}</span>}
            </div>
          )}
        </div>
        {pokemon?.sprite && (
          <div className="banner-right">
            <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-sprite" />
          </div>
        )}
      </div>

      <div className="result-body">

        {/* ── Left Column ── */}
        <div className="result-col">

          {/* Card Description */}
          {card.flavorText && (
            <div className="card-panel flavor-panel">
              <p className="flavor-text">"{card.flavorText}"</p>
              {card.artist && <p className="artist-credit">— Art by {card.artist}</p>}
            </div>
          )}

          {/* Pokemon Info */}
          {pokemon && (
            <div className="card-panel">
              <h3 className="panel-title">📖 About {capitalize(pokemon.name)}</h3>
              {pokemon.category && <p className="pokemon-category">{pokemon.category}</p>}
              {pokemon.description && <p className="pokemon-desc">{pokemon.description}</p>}
              <div className="pokemon-stats-row">
                {pokemon.isLegendary && <span className="stat-badge legendary">✦ Legendary</span>}
                {pokemon.isMythical && <span className="stat-badge mythical">✦ Mythical</span>}
                <span className="stat-badge">#{String(pokemon.id).padStart(3, '0')}</span>
                <span className="stat-badge">{(pokemon.height / 10).toFixed(1)}m</span>
                <span className="stat-badge">{(pokemon.weight / 10).toFixed(1)}kg</span>
              </div>

              {pokemon.abilities?.length > 0 && (
                <div className="abilities-list">
                  <h4 className="sub-title">Abilities</h4>
                  {pokemon.abilities.map(a => (
                    <span key={a.name} className={`ability-chip ${a.isHidden ? 'hidden-ability' : ''}`}>
                      {capitalize(a.name)}{a.isHidden ? ' (Hidden)' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Base Stats */}
          {pokemon?.baseStats?.length > 0 && (
            <div className="card-panel">
              <h3 className="panel-title">📊 Base Stats</h3>
              <div className="stats-list">
                {pokemon.baseStats.map(s => <StatBar key={s.name} name={s.name} value={s.value} />)}
              </div>
              <div className="total-stat">
                Total: {pokemon.baseStats.reduce((a, s) => a + s.value, 0)}
              </div>
            </div>
          )}

          {/* Type Matchups */}
          {pokemon && (
            <TypeMatchups
              weaknesses={pokemon.weaknesses}
              resistances={pokemon.resistances}
              immunities={pokemon.immunities}
              offensiveSE={pokemon.offensiveSE}
            />
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="result-col">

          {/* Price & Rarity */}
          <PriceSection card={card} tcgCards={tcgCards} />

          {/* Card Attacks */}
          {card.attacks?.length > 0 && (
            <div className="card-panel">
              <h3 className="panel-title">🗡️ Attacks</h3>
              <div className="attacks-list">
                {card.attacks.map((atk, i) => (
                  <div key={i} className="attack-row">
                    <div className="attack-cost">
                      {(atk.cost || []).map((c, j) => <EnergyIcon key={j} type={c} />)}
                    </div>
                    <div className="attack-info">
                      <div className="attack-name-row">
                        <span className="attack-name">{atk.name}</span>
                        {atk.damage && <span className="attack-damage">{atk.damage}</span>}
                      </div>
                      {atk.description && <p className="attack-desc">{atk.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Abilities */}
          {card.abilities?.length > 0 && (
            <div className="card-panel">
              <h3 className="panel-title">✨ Abilities</h3>
              {card.abilities.map((ab, i) => (
                <div key={i} className="ability-block">
                  <div className="ability-name">⚡ {ab.name}</div>
                  <p className="ability-desc">{ab.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Card Weaknesses from the card itself */}
          {(card.weakness || card.resistance) && (
            <div className="card-panel">
              <h3 className="panel-title">🃏 Card Details</h3>
              <div className="card-details-grid">
                {card.weakness?.type && (
                  <div className="detail-item">
                    <span className="detail-label">Weakness</span>
                    <span className="detail-val">
                      <TypeBadge type={card.weakness.type} size="sm" /> {card.weakness.modifier}
                    </span>
                  </div>
                )}
                {card.resistance?.type && (
                  <div className="detail-item">
                    <span className="detail-label">Resistance</span>
                    <span className="detail-val">
                      <TypeBadge type={card.resistance.type} size="sm" /> {card.resistance.modifier}
                    </span>
                  </div>
                )}
                {card.retreatCost != null && (
                  <div className="detail-item">
                    <span className="detail-label">Retreat Cost</span>
                    <span className="detail-val">
                      {Array.from({ length: card.retreatCost }).map((_, i) => (
                        <EnergyIcon key={i} type="Colorless" />
                      ))}
                      {card.retreatCost === 0 && '—'}
                    </span>
                  </div>
                )}
                {card.era && (
                  <div className="detail-item">
                    <span className="detail-label">Card Era</span>
                    <span className="detail-val">{card.era}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Appearances */}
          {Object.keys(genGroups).length > 0 && (
            <div className="card-panel">
              <h3 className="panel-title">🎮 Game Appearances</h3>
              {Object.entries(genGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([gen, games]) => (
                  <div key={gen} className="gen-group">
                    <div className="gen-label">Generation {gen}</div>
                    <div className="game-chips">
                      {games.map(g => (
                        <span key={g.key} className="game-chip" style={{ borderColor: g.color, color: g.color }}>
                          {g.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
