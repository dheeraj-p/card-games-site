import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import styles from './GameList.module.css';

function GameItem({ gameId, name, icon }) {
  return (
    <Link href={`/${gameId}`}>
      <div className={styles['game-card']}>
        <div className="center">{name}</div>
        <div className="center">
          <img className={styles.icon} src={`/icons/${icon}`} />
        </div>
      </div>
    </Link>
  );
}

function GameList() {
  return (
    <div className="column">
      <span className={`center title ${styles.title}`}>Available Games</span>
      <div className={styles.games}>
        <GameItem gameId="solitaire" name="Solitaire" icon="solitaire.png" />
      </div>
      <span className="center">More games to be added soon!</span>
    </div>
  );
}

export default GameList;
