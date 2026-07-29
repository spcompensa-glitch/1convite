import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PUZZLE_LEVELS } from '../../data/kidsData';
import { playCorrect, playWrong, playCoin, playLevelComplete, playClick, playDrag } from './kidsSons';
import KidsBackground from './KidsBackground';
import './KidsPuzzle.css';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function svgToDataUrl(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function PieceView({ pieceIdx, cols, rows, imgUrl, size, style, ...props }) {
  const col = pieceIdx % cols;
  const row = Math.floor(pieceIdx / cols);
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${(col / (cols - 1 || 1)) * 100}% ${(row / (rows - 1 || 1)) * 100}%`,
        borderRadius: 6,
        ...style,
      }}
      {...props}
    />
  );
}

export default function KidsPuzzle({ onBack, setUserCoins }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [grid, setGrid] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
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
    setDraggedIdx(null);
    setDragOverIdx(null);
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
    const pieceDragging = pieces[draggedIdx];

    newGrid[targetIdx] = pieceDragging;
    if (pieceAtTarget !== null) {
      newGrid[draggedIdx] = pieceAtTarget;
    } else {
      newGrid[draggedIdx] = null;
    }

    setGrid(newGrid);
    setDraggedIdx(null);
    setDragOverIdx(null);
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

  const handleTouchDrop = useCallback((targetIdx) => {
    if (draggedIdx === null || completed) return;
    handleDrop(targetIdx);
  }, [handleDrop, completed]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const imgUrl = useMemo(() => selectedLevel ? svgToDataUrl(selectedLevel.svg) : '', [selectedLevel]);
  const level = selectedLevel;
  const total = level ? level.cols * level.rows : 0;
  const cellSize = level ? Math.floor((Math.min(window.innerWidth - 56, 340)) / level.cols) : 0;

  if (!selectedLevel) {
    return (
      <KidsBackground>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => { playClick(); onBack(); }} style={{
              background: 'rgba(255,255,255,0.8)', border: 'none', fontSize: 24,
              cursor: 'pointer', color: '#5D4037', padding: 4, borderRadius: 10
            }}>←</button>
            <h2 style={{ margin: 0, color: '#5D4037', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
              Quebra-Cabeça Bíblico
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PUZZLE_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => { playClick(); initLevel(level); }}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: 16,
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  transition: 'transform 0.15s',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: 36 }}>{level.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#5D4037', fontSize: 16 }}>{level.name}</div>
                  <div style={{ fontSize: 12, color: '#8D6E63' }}>
                    {level.difficulty} · {level.cols}x{level.rows} · {level.coins} <span style={{ fontSize: 10 }}>🪙</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </KidsBackground>
    );
  }

  return (
    <KidsBackground>
      <div style={{ padding: 20, userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => { playClick(); setSelectedLevel(null); clearInterval(timerRef.current); }} style={{
            background: 'rgba(255,255,255,0.8)', border: 'none', fontSize: 24,
            cursor: 'pointer', color: '#5D4037', padding: 4, borderRadius: 10
          }}>←</button>
          <h2 style={{ margin: 0, color: '#5D4037', fontSize: 18, textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
            {level.name}
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#5D4037' }}>
          <span>⏱ {formatTime(timer)}</span>
          <span>🔄 {moves} movimentos</span>
        </div>

        {/* Referência da imagem */}
        <div style={{
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          background: 'rgba(255,255,255,0.9)',
          padding: 4,
        }}>
          <div style={{ width: '100%', maxWidth: 300 }} dangerouslySetInnerHTML={{ __html: level.svg }} />
        </div>

        {/* Grid do puzzle */}
        <div
          className="kids-puzzle-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${level.cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${level.rows}, ${cellSize}px)`,
            gap: 3,
            marginBottom: 16,
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: total }, (_, idx) => {
            const pieceIdx = grid[idx];
            const isCorrect = pieceIdx === idx;
            const isTarget = dragOverIdx === idx;
            return (
              <div
                key={idx}
                onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={() => handleDrop(idx)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 6,
                  border: `2px ${isTarget ? 'solid #4caf50' : 'dashed rgba(255,255,255,0.4)'}`,
                  background: pieceIdx !== null ? 'transparent' : 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border 0.15s',
                  overflow: 'hidden',
                }}
              >
                {pieceIdx !== null ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: `${level.cols * 100}% ${level.rows * 100}%`,
                    backgroundPosition: `${(pieceIdx % level.cols) / (level.cols - 1 || 1) * 100}% ${Math.floor(pieceIdx / level.cols) / (level.rows - 1 || 1) * 100}%`,
                    borderRadius: 4,
                    boxShadow: isCorrect ? '0 0 8px #4caf50' : 'none',
                    border: isCorrect ? '2px solid #4caf50' : 'none',
                  }} />
                ) : (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{idx + 1}</span>
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
          borderTop: '2px solid rgba(255,255,255,0.3)',
        }}>
          {pieces.map((pieceIdx, i) => {
            const placed = grid.includes(pieceIdx);
            const col = pieceIdx % level.cols;
            const row = Math.floor(pieceIdx / level.cols);
            return (
              <div
                key={i}
                draggable={!placed && !completed}
                onDragStart={() => { if (!placed) { playDrag(); setDraggedIdx(i); } }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: placed ? 'default' : 'grab',
                  opacity: placed ? 0.25 : 1,
                  transition: 'all 0.15s',
                  border: placed ? '2px solid transparent' : '2px solid #E65100',
                  boxShadow: placed ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
                  background: placed ? 'rgba(255,255,255,0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!placed && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: `${level.cols * 100}% ${level.rows * 100}%`,
                    backgroundPosition: `${col / (level.cols - 1 || 1) * 100}% ${row / (level.rows - 1 || 1) * 100}%`,
                    borderRadius: 4,
                  }} />
                )}
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
              <p style={{ color: '#5D4037', margin: '8px 0' }}>Você completou o puzzle!</p>
              <p style={{ fontSize: 24, margin: '8px 0' }}>
                +{level.coins} <span style={{ fontSize: 16 }}>🪙</span>
              </p>
              <p style={{ color: '#8D6E63', fontSize: 13 }}>
                {formatTime(timer)} · {moves} movimentos
              </p>
              <button
                onClick={() => { playClick(); setSelectedLevel(null); }}
                style={{
                  marginTop: 16,
                  padding: '10px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#4caf50',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </KidsBackground>
  );
}
