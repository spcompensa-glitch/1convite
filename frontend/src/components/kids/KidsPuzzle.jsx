import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PUZZLE_LEVELS } from '../../data/kidsData';
import { playCorrect, playWrong, playCoin, playLevelComplete, playClick, playDrag } from './kidsSons';
import './KidsPuzzle.css';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KidsPuzzle({ onBack, setUserCoins }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [grid, setGrid] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const timerRef = useRef(null);

  const initLevel = useCallback((level) => {
    const total = level.cols * level.rows;
    const initial = Array.from({ length: total }, (_, i) => i);
    setPieces(shuffleArray(initial));
    setGrid(Array(total).fill(null));
    setMoves(0);
    setTimer(0);
    setCompleted(false);
    setShowWin(false);
    setSelectedLevel(level);
  }, []);

  useEffect(() => {
    if (selectedLevel && !completed) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [selectedLevel, completed]);

  const handleDrop = useCallback((targetIdx) => {
    if (draggedIdx === null || completed) return;
    playClick();

    const newGrid = [...grid];
    const pieceAtTarget = newGrid[targetIdx];
    const pieceAtDragged = newGrid[draggedIdx];

    newGrid[targetIdx] = pieceAtDragged !== null ? pieceAtDragged : pieces[draggedIdx];
    if (pieceAtTarget !== null) {
      newGrid[draggedIdx] = pieceAtTarget;
    } else {
      newGrid[draggedIdx] = null;
    }

    setGrid(newGrid);
    setDraggedIdx(null);
    setMoves(m => m + 1);

    const isComplete = newGrid.every((v, i) => v === i);
    if (isComplete) {
      setCompleted(true);
      playLevelComplete();
      setTimeout(() => {
        playCoin();
        setUserCoins(prev => {
          const val = prev + selectedLevel.coins;
          localStorage.setItem('app-coins', val);
          return val;
        });
        setShowWin(true);
      }, 600);
    }
  }, [draggedIdx, grid, pieces, completed, selectedLevel, setUserCoins]);

  const handleDragStart = (idx) => {
    if (completed) return;
    playDrag();
    setDraggedIdx(idx);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!selectedLevel) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => { playClick(); onBack(); }} style={{
            background: 'none', border: 'none', fontSize: 24,
            cursor: 'pointer', color: 'var(--text)', padding: 4
          }}>←</button>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>Quebra-Cabeça Bíblico</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PUZZLE_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => { playClick(); initLevel(level); }}
              style={{
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                textAlign: 'left',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 36 }}>{level.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>{level.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {level.difficulty} · {level.cols}x{level.rows} · {level.coins} <span style={{ fontSize: 10 }}>🪙</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const level = selectedLevel;
  const total = level.cols * level.rows;

  return (
    <div style={{ padding: 20, userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => { playClick(); setSelectedLevel(null); clearInterval(timerRef.current); }} style={{
          background: 'none', border: 'none', fontSize: 24,
          cursor: 'pointer', color: 'var(--text)', padding: 4
        }}>←</button>
        <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 18 }}>{level.name}</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14, color: 'var(--text)' }}>
        <span>⏱ {formatTime(timer)}</span>
        <span>🔄 {moves} movimentos</span>
      </div>

      {/* Referência da imagem */}
      <div style={{
        background: level.bgColor,
        borderRadius: 12,
        padding: 8,
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div
          style={{ width: '100%', maxWidth: 300 }}
          dangerouslySetInnerHTML={{ __html: level.svg }}
        />
      </div>

      {/* Grid do puzzle */}
      <div
        className="kids-puzzle-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
          gap: 4,
          marginBottom: 16,
        }}
      >
        {Array.from({ length: total }, (_, idx) => {
          const pieceIdx = grid[idx];
          const isCorrect = pieceIdx === idx;
          return (
            <div
              key={idx}
              className={`kids-puzzle-cell ${pieceIdx !== null ? 'filled' : ''} ${isCorrect ? 'correct' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              style={{
                aspectRatio: '1',
                background: pieceIdx !== null
                  ? isCorrect ? '#4caf50' : '#ff9800'
                  : 'rgba(255,255,255,0.1)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                border: `2px dashed ${pieceIdx !== null ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
                transition: 'all 0.15s',
                cursor: pieceIdx !== null ? 'grab' : 'default',
              }}
            >
              {pieceIdx !== null && (
                <span style={{ fontSize: 22 }}>
                  {isCorrect ? '✓' : pieceIdx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Peças para arrastar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
        padding: '12px 0',
        borderTop: '1px solid var(--border)'
      }}>
        {pieces.map((pieceIdx, i) => {
          const placed = grid.includes(pieceIdx);
          return (
            <div
              key={i}
              draggable={!placed && !completed}
              onDragStart={() => handleDragStart(pieceIdx)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: placed ? 'rgba(255,255,255,0.05)' : '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: placed ? 'var(--muted)' : 'white',
                cursor: placed ? 'default' : 'grab',
                opacity: placed ? 0.3 : 1,
                transition: 'all 0.15s',
                border: `2px solid ${placed ? 'transparent' : '#e65100'}`,
              }}
            >
              {pieceIdx + 1}
            </div>
          );
        })}
      </div>

      {/* Modal de vitória */}
      {showWin && (
        <div className="kids-win-overlay">
          <div className="kids-win-modal">
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
            <h3 style={{ margin: 0, color: '#4caf50' }}>Parabéns!</h3>
            <p style={{ color: 'var(--text)', margin: '8px 0' }}>Você completou o puzzle!</p>
            <p style={{ fontSize: 24, margin: '8px 0' }}>
              +{level.coins} <span style={{ fontSize: 16 }}>🪙</span>
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              {formatTime(timer)} · {moves} movimentos
            </p>
            <button
              onClick={() => { playClick(); setSelectedLevel(null); }}
              style={{
                marginTop: 16,
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#4caf50',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
