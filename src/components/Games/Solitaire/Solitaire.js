import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import React, { useState } from 'react';
import Card, { FacedDownCard } from './Card';
import {
  cardToString,
  initialGameState,
  moveCard,
  SUIT_CLUBS,
  SUIT_DIMAONDS,
  SUIT_SPADES
} from './core/logic';
import styles from './Solitaire.module.css';

function EmptyPile() {
  return <div className={`${styles.pile} ${styles.empty}`} />;
}

function InvisiblePile() {
  return <div className={`${styles.pile} ${styles.invisible}`} />;
}

const Pile = React.forwardRef(
  ({ cards, className, children, attributes }, ref) => {
    if (_.isEmpty(cards)) {
      return EmptyPile();
    }

    return (
      <div ref={ref} className={`${styles.pile} ${className}`} {...attributes}>
        {children}
      </div>
    );
  }
);

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

function CardGroup({ card, otherCardGroup }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `card-group-${cardToString(card)}`
    });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div
      className={styles['card-group']}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card card={card} key={cardToString(card)} />
      {otherCardGroup}
    </div>
  );
}

function TableauPile({ pile, id }) {
  const { setNodeRef } = useDroppable({ id: `tableau-pile-${id}` });

  const faceUpCardsView = _.reduceRight(
    pile.up,
    (cardGroup, card) => {
      return <CardGroup card={card} otherCardGroup={cardGroup} />;
    },
    <></>
  );

  return (
    <Pile
      cards={_.concat(pile.up, pile.down)}
      className={styles.tableau}
      ref={setNodeRef}
    >
      {_.map(pile.down, card => (
        <FacedDownCard key={cardToString(card)} />
      ))}
      {faceUpCardsView}
    </Pile>
  );
}

function Solitaire() {
  const [gameState, setGameState] = useState(initialGameState());
  const { stock, waste, foundations, tableau } = gameState;

  const onDragEnd = ({ active, over }) => {
    const cardStr = _.split(active.id, 'card-group-')[1];
    const targetPileNumber = parseInt(_.split(over.id, 'tableau-pile-')[1]);
    const newGameState = moveCard(gameState, cardStr, targetPileNumber);
    setGameState(newGameState);
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
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
        {_.map(tableau, (pile, index) => (
          <TableauPile pile={pile} key={index} id={index} />
        ))}
      </div>
    </DndContext>
  );
}

export default Solitaire;
