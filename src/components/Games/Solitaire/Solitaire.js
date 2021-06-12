import { DndContext } from '@dnd-kit/core';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { cardImages } from '../../../data/cardImages';
import {
  initialGameState,
  moveWithinTableau,
  moveFromWasteToTableau,
  moveFromTableauToFoundation,
  moveFromWasteToFoundation,
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
  isMovingWithinTableu
} from './utils';
import { cacheImages } from '../../../common/utils';
import { InvisibleCard } from './Card/Card';

function Solitaire() {
  const [gameStates, setGameStates] = useState([initialGameState()]);
  const [areImagesReady, setImagesReady] = useState(false);

  const currentState = _.last(gameStates);

  const updateGameState = newGameState => {
    if (_.isEqual(currentState, newGameState)) {
      return;
    }

    setGameStates([...gameStates, newGameState]);
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

    updateGameState(newGameState);
  };

  const onClickStock = () => updateGameState(popFromStock(currentState));

  const undoGame = () => {
    if (gameStates.length < 2) {
      return;
    }
    setGameStates(_.dropRight(gameStates, 1));
  };

  const onTableauDoubleTap = card => {
    const foundationTarget = _.lowerCase(card.suit.name);
    const newGameState = moveFromTableauToFoundation(
      currentState,
      cardToString(card),
      foundationTarget
    );

    updateGameState(newGameState);
  };

  const onWasteDoubleTap = card => {
    const foundationTarget = _.lowerCase(card.suit.name);
    updateGameState(moveFromWasteToFoundation(currentState, foundationTarget));
  };

  return areImagesReady ? (
    <DndContext onDragEnd={onDragEnd}>
      <div className={styles['no-select']}>
        <div className={styles.header}>
          <Center className={styles['game-title']}>Solitaire</Center>
          <button className={styles.undo} onClick={undoGame}>
            Undo
          </button>
        </div>
        <div className={styles.row}>
          <Stock cards={stock} onClick={onClickStock} />
          <Waste cards={waste} onDoubleTap={onWasteDoubleTap} />
          <InvisibleCard />
          <Foundation cards={foundations.hearts} suit={SUIT_HEARTS} />
          <Foundation cards={foundations.spades} suit={SUIT_SPADES} />
          <Foundation cards={foundations.diamonds} suit={SUIT_DIMAONDS} />
          <Foundation cards={foundations.clubs} suit={SUIT_CLUBS} />
        </div>
        <div className="m-medium" />
        <Tableau tableau={tableau} onDoubleTap={onTableauDoubleTap} />
      </div>
    </DndContext>
  ) : (
    <LoadingBox />
  );
}

export default Solitaire;
