import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { cardImages } from '../../../data/cardImages';
import Card, { FacedDownCard } from './Card/Card';
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
  SUIT_CLUBS
} from './core/logic';

import styles from './Solitaire.module.css';
import LoadingBox from '../../LoadingBox/LoadingBox';
import Pile, { EmptyPile, InvisiblePile } from './Pile/Pile';
import Tableau from './Tableau/Tabeau';
import { SOURCE_TYPE, TARGET_TYPE } from './core/constants';
import Stock from './Stock/Stock';
import Waste from './Waste/Waste';
import Foundation from './Foundation/Foundation';

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

function isMovingFromWasteToFoundation(sourceType, targetType) {
  return (
    targetType == TARGET_TYPE.FOUNDATION && sourceType == SOURCE_TYPE.WASTE
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

    if (isMovingFromWasteToFoundation(sourceType, targetType)) {
      const { foundationTarget } = over.data.current;
      newGameState = moveFromWasteToFoundation(gameState, foundationTarget);
    }
    setGameState(newGameState);
  };

  const onClickStock = () => setGameState(popFromStock(gameState));

  return areImagesReady ? (
    <DndContext onDragEnd={onDragEnd}>
      <div className={styles['no-select']}>
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
        <Tableau tableau={tableau} />
      </div>
    </DndContext>
  ) : (
    <LoadingBox />
  );
}

export default Solitaire;
