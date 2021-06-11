import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { cardImages } from '../../../data/cardImages';
import Card, { FacedDownCard } from './Card';
import {
  cardToString,
  initialGameState,
  moveWithinTableau,
  moveFromWasteToTableau,
  moveFromTableauToFoundation,
  popFromStock,
  SUIT_HEARTS,
  SUIT_SPADES,
  SUIT_DIMAONDS,
  SUIT_CLUBS
} from './core/logic';

import styles from './Solitaire.module.css';
import LoadingBox from '../../LoadingBox/LoadingBox';

const SOURCE_TYPE = {
  TABLEAU: 'TABLEAU',
  WASTE: 'WASTE_PILE'
};

const TARGET_TYPE = {
  TABLEAU: 'TABLEAU',
  FOUNDATION: 'FOUNDATION'
};

const EmptyPile = React.forwardRef(({ attributes }, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.pile} ${styles.empty}`}
      {...attributes}
    />
  );
});

function InvisiblePile() {
  return <div className={`${styles.pile} ${styles.invisible}`} />;
}

const Pile = React.forwardRef(
  ({ cards, className, children, attributes }, ref) => {
    if (_.isEmpty(cards)) {
      return <EmptyPile ref={ref} attributes={attributes} />;
    }

    return (
      <div ref={ref} className={`${styles.pile} ${className}`} {...attributes}>
        {children}
      </div>
    );
  }
);

function Stock({ cards, onClick }) {
  const attributes = { onClick };

  return (
    <Pile cards={cards} attributes={attributes}>
      <FacedDownCard />
    </Pile>
  );
}

function Waste({ cards, shouldFlipThree = false }) {
  const cardOnTop = cards[0];
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardToString(cardOnTop)}`,
    data: { sourceType: SOURCE_TYPE.WASTE }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <Pile cards={cards}>
      <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
        <Card card={cardOnTop} />
      </div>
    </Pile>
  );
}

function Foundation({ cards, suit }) {
  const { setNodeRef } = useDroppable({
    id: `foundation-pile-${suit.name}`,
    data: { targetType: TARGET_TYPE.FOUNDATION, foundationTarget: suit.name }
  });

  return (
    <Pile cards={cards} ref={setNodeRef}>
      <Card card={cards[0]} />
    </Pile>
  );
}

function CardGroup({ card, otherCardGroup }) {
  const cardStr = cardToString(card);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardStr}`,
    data: { sourceType: SOURCE_TYPE.TABLEAU, cardStr }
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
  const { setNodeRef } = useDroppable({
    id: `tableau-pile-${id}`,
    data: { targetType: TARGET_TYPE.TABLEAU, targetPileIndex: id }
  });

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

function isMovingWithinTableu(sourceType, targetType) {
  return targetType == TARGET_TYPE.TABLEAU && sourceType == SOURCE_TYPE.TABLEAU;
}

function isMovingFromWasteToTableau(sourceType, targetType) {
  return targetType == TARGET_TYPE.TABLEAU && sourceType == SOURCE_TYPE.WASTE;
}

function isMovingFromTableauToFoundation(sourceType, targetType) {
  return (
    targetType == TARGET_TYPE.FOUNDATION && sourceType == SOURCE_TYPE.TABLEAU
  );
}

function cacheImages(imageSources, onLoaded, onError) {
  const promises = _.map(imageSources, imageSrc => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = resolve;
      image.onerror = reject;
      window[imageSrc] = image;
    });
  });

  Promise.all(promises).then(onLoaded).catch(onError);
}

function Solitaire() {
  const [gameState, setGameState] = useState(initialGameState());
  const [areImagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    cacheImages(
      cardImages,
      () => setImagesReady(true),
      () => {}
    );
  }, []);

  const { stock, waste, foundations, tableau } = gameState;

  const onDragEnd = ({ active, over }) => {
    if (_.isNil(active) || _.isNil(over)) {
      return;
    }

    const { sourceType } = active.data.current;
    const { targetType } = over.data.current;
    let newGameState = gameState;

    if (isMovingWithinTableu(sourceType, targetType)) {
      const { cardStr } = active.data.current;
      const { targetPileIndex } = over.data.current;
      newGameState = moveWithinTableau(gameState, cardStr, targetPileIndex);
    }

    if (isMovingFromWasteToTableau(sourceType, targetType)) {
      const { targetPileIndex } = over.data.current;
      newGameState = moveFromWasteToTableau(gameState, targetPileIndex);
    }

    if (isMovingFromTableauToFoundation(sourceType, targetType)) {
      const { cardStr } = active.data.current;
      const { foundationTarget } = over.data.current;

      newGameState = moveFromTableauToFoundation(
        gameState,
        cardStr,
        foundationTarget
      );
    }

    setGameState(newGameState);
  };

  const onClickStock = () => setGameState(popFromStock(gameState));

  return areImagesReady ? (
    <DndContext onDragEnd={onDragEnd}>
      <div className={styles.row}>
        <Stock cards={stock} onClick={onClickStock} />
        <Waste cards={waste} />
        <InvisiblePile />
        <Foundation cards={foundations.hearts} suit={SUIT_HEARTS} />
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
  ) : (
    <LoadingBox />
  );
}

export default Solitaire;
