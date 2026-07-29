import React from 'react';
import { KIDS_GAMES } from '../../data/kidsData';
import { playClick } from './kidsSons';
import KidsBackground from './KidsBackground';

export default function KidsLobby({ onSelectGame, onBack }) {
  return (
    <KidsBackground>
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => { playClick(); onBack(); }}
            style={{
              background: 'rgba(255,255,255,0.8)', border: 'none', fontSize: 24,
              cursor: 'pointer', color: '#5D4037', padding: 4, borderRadius: 10
            }}
          >←</button>
          <h2 style={{ margin: 0, color: '#5D4037', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
            Kids do Reino
          </h2>
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
                background: game.unlocked
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.4)',
                opacity: game.unlocked ? 1 : 0.5,
                border: '2px solid rgba(255,255,255,0.6)',
                borderRadius: 16,
                padding: '20px 12px',
                cursor: game.unlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: game.unlocked
                  ? '0 4px 15px rgba(0,0,0,0.1)'
                  : 'none',
              }}
              onMouseEnter={e => game.unlocked && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 40 }}>{game.icon}</span>
              <span style={{ fontWeight: 700, color: '#5D4037', fontSize: 14 }}>{game.name}</span>
              <span style={{ fontSize: 11, color: '#8D6E63', textAlign: 'center' }}>{game.description}</span>
              {!game.unlocked && (
                <span style={{ fontSize: 10, color: '#FF8F00', marginTop: 4 }}>🔒 Em breve</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </KidsBackground>
  );
}
