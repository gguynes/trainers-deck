import { getTypeColor, TYPE_ICONS, capitalize } from '../utils/typeData.js';

export default function TypeBadge({ type, size = 'md' }) {
  const color = getTypeColor(type);
  const icon = TYPE_ICONS[type?.toLowerCase()] || '?';

  const sizes = {
    sm: { fontSize: '0.7rem', padding: '3px 8px', gap: '4px' },
    md: { fontSize: '0.85rem', padding: '5px 12px', gap: '5px' },
    lg: { fontSize: '1rem', padding: '7px 16px', gap: '6px' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      background: color.bg,
      color: color.text,
      padding: s.padding,
      borderRadius: 999,
      fontSize: s.fontSize,
      fontWeight: 700,
      fontFamily: 'Nunito, sans-serif',
      letterSpacing: '0.03em',
      boxShadow: `0 2px 6px ${color.bg}66`,
      textTransform: 'uppercase',
    }}>
      <span style={{ fontSize: '1em' }}>{icon}</span>
      {capitalize(type)}
    </span>
  );
}
