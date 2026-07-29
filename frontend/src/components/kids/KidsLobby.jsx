import React from 'react';
import { KIDS_GAMES } from '../../data/kidsData';
import { playClick } from './kidsSons';

export default function KidsLobby({ onSelectGame, onBack }) {
  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => { playClick(); onBack(); }}
          style={{
            background: 'none', border: 'none', fontSize: 24,
            cursor: 'pointer', color: 'var(--text)', padding: 4
          }}
        >←</button>
        <h2 style={{ margin: 0, color: 'var(--text)' }}>Kids do Reino</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12
      }}>
        {KIDS_GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => {
              if (!game.unlocked) return;
              playClick();
              onSelectGame(game.id);
            }}
            style={{
              background: game.unlocked ? 'var(--card-bg)' : 'var(--card-bg)',
              opacity: game.unlocked ? 1 : 0.5,
              border: '2px solid var(--border)',
              borderRadius: 14,
              padding: '20px 12px',
              cursor: game.unlocked ? 'pointer' : 'not-allowed',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => game.unlocked && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: 40 }}>{game.icon}</span>
            <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{game.name}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{game.description}</span>
            {!game.unlocked && (
              <span style={{ fontSize: 10, color: 'var(--orange)', marginTop: 4 }}>🔒 Em breve</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
