import { RARITY_COLORS } from '../utils/typeData.js';

function fmt(n) {
  if (n == null) return null;
  return `$${Number(n).toFixed(2)}`;
}

export default function PriceSection({ card, tcgCards }) {
  const bestMatch = tcgCards?.find(c =>
    c.name?.toLowerCase() === card?.cardName?.toLowerCase()
  ) || tcgCards?.[0];

  const prices = bestMatch?.tcgplayer?.prices;
  const market = prices?.holofoil?.market || prices?.normal?.market || prices?.['1stEditionHolofoil']?.market;
  const low = prices?.holofoil?.low || prices?.normal?.low;
  const high = prices?.holofoil?.high || prices?.normal?.high;
  const mid = prices?.holofoil?.mid || prices?.normal?.mid;

  const cardName = card?.cardName || card?.pokemonName || '';
  const encodedName = encodeURIComponent(cardName);
  const tcgSearch = `https://www.tcgplayer.com/search/pokemon/product?q=${encodedName}`;
  const ebaySearch = `https://www.ebay.com/sch/i.html?_nkw=${encodedName}+pokemon+card`;
  const trollSearch = `https://www.trollandtoad.com/search-results.php?search-words=${encodedName}+pokemon`;

  const rarity = card?.rarity;
  const rarityInfo = RARITY_COLORS[rarity] || RARITY_COLORS['Rare'];

  return (
    <div className="card-panel">
      <h3 className="panel-title">💰 Price & Rarity</h3>

      {rarity && (
        <div className="rarity-badge-wrap">
          <span
            className="rarity-badge"
            style={{ background: rarityInfo?.bg || '#888' }}
          >
            {rarityInfo?.label || '★'} {rarity}
          </span>
        </div>
      )}

      {market || low ? (
        <div className="price-grid">
          {market && (
            <div className="price-box featured">
              <div className="price-label">Market Price</div>
              <div className="price-value">{fmt(market)}</div>
            </div>
          )}
          {low && (
            <div className="price-box">
              <div className="price-label">Low</div>
              <div className="price-value green">{fmt(low)}</div>
            </div>
          )}
          {mid && (
            <div className="price-box">
              <div className="price-label">Mid</div>
              <div className="price-value">{fmt(mid)}</div>
            </div>
          )}
          {high && (
            <div className="price-box">
              <div className="price-label">High</div>
              <div className="price-value red">{fmt(high)}</div>
            </div>
          )}
        </div>
      ) : (
        <p className="no-price">Price data not found — search the links below for current market values.</p>
      )}

      {bestMatch?.set && (
        <div className="set-info">
          {bestMatch.set.images?.symbol && (
            <img src={bestMatch.set.images.symbol} alt="Set symbol" className="set-symbol" />
          )}
          <span>{bestMatch.set.name} · #{bestMatch.number} · {bestMatch.set.releaseDate}</span>
        </div>
      )}

      <div className="buy-links">
        <h4 className="buy-title">🛒 Buy This Card</h4>
        <div className="buy-buttons">
          <a href={tcgSearch} target="_blank" rel="noopener noreferrer" className="buy-btn tcgplayer">
            TCGplayer
          </a>
          <a href={ebaySearch} target="_blank" rel="noopener noreferrer" className="buy-btn ebay">
            eBay
          </a>
          <a href={trollSearch} target="_blank" rel="noopener noreferrer" className="buy-btn troll">
            Troll & Toad
          </a>
          <a
            href={`https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodedName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-btn cardmarket"
          >
            Cardmarket
          </a>
        </div>
      </div>
    </div>
  );
}
