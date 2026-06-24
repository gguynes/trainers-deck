import TypeBadge from './TypeBadge.jsx';

export default function TypeMatchups({ weaknesses, resistances, immunities, offensiveSE }) {
  const hasData = weaknesses?.length || resistances?.length || immunities?.length;
  if (!hasData) return null;

  const x4 = weaknesses?.filter(w => w.multiplier === 4) || [];
  const x2 = weaknesses?.filter(w => w.multiplier === 2) || [];
  const half = resistances?.filter(r => r.multiplier === 0.5) || [];
  const quarter = resistances?.filter(r => r.multiplier === 0.25) || [];

  return (
    <div className="card-panel">
      <h3 className="panel-title">⚔️ Type Matchups</h3>

      <div className="matchup-grid">
        {x4.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label weak x4">4× Weak</div>
            <div className="matchup-types">
              {x4.map(w => <TypeBadge key={w.type} type={w.type} size="sm" />)}
            </div>
          </div>
        )}

        {x2.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label weak">2× Weak</div>
            <div className="matchup-types">
              {x2.map(w => <TypeBadge key={w.type} type={w.type} size="sm" />)}
            </div>
          </div>
        )}

        {half.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label resist">½ Resist</div>
            <div className="matchup-types">
              {half.map(r => <TypeBadge key={r.type} type={r.type} size="sm" />)}
            </div>
          </div>
        )}

        {quarter.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label resist">¼ Resist</div>
            <div className="matchup-types">
              {quarter.map(r => <TypeBadge key={r.type} type={r.type} size="sm" />)}
            </div>
          </div>
        )}

        {immunities?.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label immune">Immune</div>
            <div className="matchup-types">
              {immunities.map(i => <TypeBadge key={i.type} type={i.type} size="sm" />)}
            </div>
          </div>
        )}

        {offensiveSE?.length > 0 && (
          <div className="matchup-row">
            <div className="matchup-label offense">Super Effective vs</div>
            <div className="matchup-types">
              {offensiveSE.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
