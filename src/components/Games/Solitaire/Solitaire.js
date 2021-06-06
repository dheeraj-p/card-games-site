import _ from 'lodash';
import { useState } from 'react';
import Card, { FacedDownCard } from './Card';
import {
  cardToString,
  initialGameState,
  SUIT_CLUBS,
  SUIT_DIMAONDS,
  SUIT_SPADES
} from './core/logic';
import styles from './Solitaire.module.css';

function EmptyPile() {
  return <div className={`${styles.pile} ${styles.empty}`}></div>;
}

function InvisiblePile() {
  return <div className={`${styles.pile} ${styles.invisible}`} />;
}

function Pile({ cards, className, children }) {
  if (_.isEmpty(cards)) {
    return EmptyPile();
  }

  return <div className={`${styles.pile} ${className}`}>{children}</div>;
}

function Stock({ cards }) {
  return (
    <Pile cards={cards}>
      <FacedDownCard />
    </Pile>
  );
}

function Waste({ cards, shouldFlipThree = false }) {
  return (
    <Pile cards={cards}>
      <Card card={cards[0]} />
    </Pile>
  );
}

function Foundation({ cards, suit }) {
  return (
    <Pile cards={cards}>
      <Card card={cards[0]} />
    </Pile>
  );
}

function TableauPile({ cards }) {
  return (
    <Pile cards={cards} className={styles.tableau}>
      {_.chain(cards)
        .take(cards.length - 1)
        .map(card => <FacedDownCard key={cardToString(card)} />)
        .value()}
      <Card card={_.last(cards)} />
    </Pile>
  );
}

function Solitaire() {
  const [gameState, setGameState] = useState(initialGameState());
  const { stock, waste, foundations, tableau } = gameState;
  return (
    <div>
      <div className={styles.row}>
        <Stock cards={stock} />
        <Waste cards={waste} />
        <InvisiblePile />
        <Foundation cards={foundations.hearts} suit={SUIT_CLUBS} />
        <Foundation cards={foundations.spades} suit={SUIT_SPADES} />
        <Foundation cards={foundations.diamonds} suit={SUIT_DIMAONDS} />
        <Foundation cards={foundations.clubs} suit={SUIT_CLUBS} />
      </div>
      <div className="m-top-medium" />
      <div className={styles.row}>
        {_.map(tableau, (cards, index) => (
          <TableauPile cards={cards} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Solitaire;
