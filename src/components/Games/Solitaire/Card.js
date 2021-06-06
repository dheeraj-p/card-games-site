import styles from './Solitaire.module.css';
import { cardToString } from './core/logic';

function FacedDownCard() {
  const facedDownCard = `/assets/solitaire/red_back-min.png`;
  return (
    <div className={styles.card}>
      <img src={facedDownCard} className={styles.image} />
    </div>
  );
}

function Card({ card }) {
  const imageSrc = `/assets/solitaire/${cardToString(card)}-min.png`;
  return (
    <div className={styles.card}>
      <img src={imageSrc} className={styles.image} />
    </div>
  );
}

export default Card;
export { FacedDownCard };
