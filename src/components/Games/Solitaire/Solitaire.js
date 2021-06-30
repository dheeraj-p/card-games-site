import { DndContext } from '@dnd-kit/core';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { cardImages } from '../../../data/cardImages';
import {
  initialGameState,
  moveWithinTableau,
  moveFromWasteToTableau,
  moveFromTableauToFoundation,
  moveFromWasteToFoundation,
  moveFromFoundationToTableau,
  isGameEnded,
  popFromStock,
  SUIT_HEARTS,
  SUIT_SPADES,
  SUIT_DIMAONDS,
  SUIT_CLUBS,
  cardToString
} from './core/logic';

import styles from './Solitaire.module.css';
import LoadingBox from '../../LoadingBox/LoadingBox';
import Tableau from './Tableau/Tabeau';
import Stock from './Stock/Stock';
import Waste from './Waste/Waste';
import Foundation from './Foundation/Foundation';
import Center from '../../Center/Center';
import {
  isMovingFromTableauToFoundation,
  isMovingFromWasteToFoundation,
  isMovingFromWasteToTableau,
  isMovingWithinTableu,
  isMovingFromFoundationToTableau
} from './utils';
import { cacheImages } from '../../../common/utils';
import { InvisibleCard } from './Card/Card';
import GameEndMessage from '../../GameEndMessage/GameEndMessage';

function Solitaire() {
  const [gameStates, setGameStates] = useState([initialGameState()]);
  const [areImagesReady, setImagesReady] = useState(false);
  const heartsFoundationRef = useRef();
  const clubsFoundationRef = useRef();
  const diamondsFoundationRef = useRef();
  const spadesFoundationRef = useRef();

  const startNewGame = () => setGameStates([initialGameState()]);

  const getFoundationRef = foundationName => {
    if (_.lowerCase(foundationName) == 'hearts') return heartsFoundationRef;
    if (_.lowerCase(foundationName) == 'clubs') return clubsFoundationRef;
    if (_.lowerCase(foundationName) == 'diamonds') return diamondsFoundationRef;
    if (_.lowerCase(foundationName) == 'spades') return spadesFoundationRef;
  };

  const currentState = _.last(gameStates);

  const updateGameState = newGameState => {
    if (_.isEqual(currentState, newGameState)) {
      return;
    }

    setGameStates([...gameStates, newGameState]);
  };

  const animateCard = (gameState, cardRef, targetRef) => {
    if (_.isEqual(currentState, gameState)) return;

    cardRef.current.addEventListener('transitionend', e => {
      updateGameState(gameState);
    });

    cardRef.current.style.transition = 'transform 0.3s';
    const targetTop = targetRef.current.offsetTop;
    const targetLeft = targetRef.current.offsetLeft;
    const cardTop = cardRef.current.offsetTop;
    const cardLeft = cardRef.current.offsetLeft;

    const offsetTop = targetTop - cardTop;
    const offsetLeft = targetLeft - cardLeft;
    cardRef.current.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
  };

  useEffect(() => {
    cacheImages(
      cardImages,
      () => setImagesReady(true),
      () => {}
    );
  }, []);

  const { stock, waste, foundations, tableau } = currentState;

  const onDragEnd = ({ active, over }) => {
    if (_.isNil(active) || _.isNil(over)) {
      return;
    }

    const { sourceType } = active.data.current;
    const { targetType } = over.data.current;
    let newGameState = currentState;

    if (isMovingWithinTableu(sourceType, targetType)) {
      const { cardStr } = active.data.current;
      const { targetPileIndex } = over.data.current;
      newGameState = moveWithinTableau(currentState, cardStr, targetPileIndex);
    }

    if (isMovingFromWasteToTableau(sourceType, targetType)) {
      const { targetPileIndex } = over.data.current;
      newGameState = moveFromWasteToTableau(currentState, targetPileIndex);
    }

    if (isMovingFromTableauToFoundation(sourceType, targetType)) {
      const { cardStr } = active.data.current;
      const { foundationTarget } = over.data.current;

      newGameState = moveFromTableauToFoundation(
        currentState,
        cardStr,
        foundationTarget
      );
    }

    if (isMovingFromWasteToFoundation(sourceType, targetType)) {
      const { foundationTarget } = over.data.current;
      newGameState = moveFromWasteToFoundation(currentState, foundationTarget);
    }

    if (isMovingFromFoundationToTableau(sourceType, targetType)) {
      const { targetPileIndex } = over.data.current;
      const { foundationSource } = active.data.current;
      newGameState = moveFromFoundationToTableau(
        currentState,
        foundationSource,
        targetPileIndex
      );
    }

    updateGameState(newGameState);
  };

  const onClickStock = () => updateGameState(popFromStock(currentState));

  const undoGame = () => {
    if (gameStates.length < 2) {
      return;
    }
    setGameStates(_.dropRight(gameStates, 1));
  };

  const onTableauDoubleTap = (card, cardRef) => {
    const foundationTarget = _.lowerCase(card.suit.name);
    const newGameState = moveFromTableauToFoundation(
      currentState,
      cardToString(card),
      foundationTarget
    );

    animateCard(newGameState, cardRef, getFoundationRef(foundationTarget));
  };

  const onWasteDoubleTap = (card, cardRef) => {
    const foundationTarget = _.lowerCase(card.suit.name);
    animateCard(
      moveFromWasteToFoundation(currentState, foundationTarget),
      cardRef,
      getFoundationRef(foundationTarget)
    );
  };

  return areImagesReady ? (
    <DndContext onDragEnd={onDragEnd}>
      <div className={styles['no-select']}>
        <div className={styles.header}>
          <Center className={styles['game-title']}>Solitaire</Center>
          <button className={styles.button} onClick={undoGame}>
            Undo
          </button>
          <button className={styles.button} onClick={startNewGame}>
            New Game
          </button>
        </div>
        <div className={styles.row}>
          <Stock cards={stock} onClick={onClickStock} />
          <Waste cards={waste} onDoubleTap={onWasteDoubleTap} />
          <InvisibleCard />
          <Foundation
            cards={foundations.hearts}
            suit={SUIT_HEARTS}
            ref={heartsFoundationRef}
          />
          <Foundation
            cards={foundations.spades}
            suit={SUIT_SPADES}
            ref={spadesFoundationRef}
          />
          <Foundation
            cards={foundations.diamonds}
            suit={SUIT_DIMAONDS}
            ref={diamondsFoundationRef}
          />
          <Foundation
            cards={foundations.clubs}
            suit={SUIT_CLUBS}
            ref={clubsFoundationRef}
          />
        </div>
        <div className="m-medium" />
        {isGameEnded(currentState) ? (
          <GameEndMessage
            message="Congratulations, You won!"
            onNewGame={startNewGame}
          />
        ) : (
          <Tableau tableau={tableau} onDoubleTap={onTableauDoubleTap} />
        )}
      </div>
    </DndContext>
  ) : (
    <LoadingBox />
  );
}

export default Solitaire;
