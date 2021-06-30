import { SOURCE_TYPE, TARGET_TYPE } from './core/constants';

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

function isMovingFromFoundationToTableau(sourceType, targetType) {
  return (
    targetType == TARGET_TYPE.TABLEAU && sourceType == SOURCE_TYPE.FOUNDATION
  );
}

export {
  isMovingFromTableauToFoundation,
  isMovingFromWasteToFoundation,
  isMovingFromWasteToTableau,
  isMovingWithinTableu,
  isMovingFromFoundationToTableau
};
