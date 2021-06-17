import styles from './Card.module.css';
import { cardToString } from '../core/logic';
import React, { useRef } from 'react';

function FacedDownCard({ className }) {
  const facedDownCard = `/assets/cards/red_back-min.png`;
  return (
    <div className={`${styles.card} ${className}`}>
      <img src={facedDownCard} className={styles.image} draggable={false} />
    </div>
  );
}

const Card = React.forwardRef(({ card, className, attributes }, ref) => {
  const imageSrc = `/assets/cards/${cardToString(card)}-min.png`;
  return (
    <div className={`${styles.card} ${className}`} ref={ref} {...attributes}>
      <img src={imageSrc} className={styles.image} draggable={false} />
    </div>
  );
});

function CardHole({ className }) {
  return <div className={`${styles.card} ${styles.hole} ${className}`} />;
}

function InvisibleCard({ className }) {
  return <div className={`${styles.card} ${styles.invisible} ${className}`} />;
}

export default Card;
export { FacedDownCard, CardHole, InvisibleCard };
