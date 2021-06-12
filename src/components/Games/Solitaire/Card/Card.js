import styles from './Card.module.css';
import { cardToString } from '../core/logic';

function FacedDownCard({ className }) {
  const facedDownCard = `/assets/cards/red_back-min.png`;
  return (
    <div className={`${styles.card} ${className}`}>
      <img src={facedDownCard} className={styles.image} draggable={false} />
    </div>
  );
}

function Card({ card, className }) {
  const imageSrc = `/assets/cards/${cardToString(card)}-min.png`;
  return (
    <div className={`${styles.card} ${className}`}>
      <img src={imageSrc} className={styles.image} />
    </div>
  );
}

export default Card;
export { FacedDownCard };
