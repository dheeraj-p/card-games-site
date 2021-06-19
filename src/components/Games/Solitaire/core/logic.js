import _ from 'lodash';

const COLOR_RED = 'RED';
const COLOR_BLACK = 'BLACK';

const SUIT_SPADES = { name: 'SPADES', color: COLOR_BLACK };
const SUIT_HEARTS = { name: 'HEARTS', color: COLOR_RED };
const SUIT_CLUBS = { name: 'CLUBS', color: COLOR_BLACK };
const SUIT_DIMAONDS = { name: 'DIAMONDS', color: COLOR_RED };

function newCard(number, suit) {
  return { number, suit };
}

function cardsForSuit(suit, numbers) {
  return _.map(numbers, number => newCard(number, suit));
}

function generateDeck() {
  const suits = [SUIT_CLUBS, SUIT_SPADES, SUIT_HEARTS, SUIT_DIMAONDS];
  const numbers = _.range(1, 14);

  return _.chain(suits)
    .map(suit => cardsForSuit(suit, numbers))
    .flatten()
    .shuffle()
    .value();
}

function generateTableau(cards) {
  const sigma = n => (n * (n + 1)) / 2;

  return _.chain(_.range(0, 7))
    .map(index => _.slice(cards, sigma(index), sigma(index + 1)))
    .map(pile => ({ up: _.takeRight(pile, 1), down: _.dropRight(pile, 1) }))
    .value();
}

function cardToString(card) {
  if (_.isNil(card)) {
    return 'invalid-card';
  }

  const cardNumbersMap = { 1: 'A', 13: 'K', 12: 'Q', 11: 'J' };
  let cardNumberToString = cardNumbersMap[card.number];
  if (!cardNumberToString) {
    cardNumberToString = card.number.toString();
  }

  return cardNumberToString + card.suit.name[0];
}

function findCardInTableau(tableau, cardStr) {
  for (let pileIndex = 0; pileIndex < tableau.length; pileIndex++) {
    const currentPile = _.map(tableau[pileIndex].up, cardToString);
    const cardIndex = _.indexOf(currentPile, cardStr);

    if (cardIndex > -1) {
      return { pileIndex, cardIndex };
    }
  }
  return { pileIndex: -1, cardIndex: -1 };
}

function isCardAKing(card) {
  return card.number == 13;
}

function isValidMoveToTableau(card, targetFacedUpCards) {
  if (_.isEmpty(targetFacedUpCards)) {
    return isCardAKing(card);
  }

  const cardOnTop = _.last(targetFacedUpCards);

  return (
    cardOnTop.suit.color != card.suit.color &&
    card.number + 1 == cardOnTop.number
  );
}

function updateSourcePile(sourcePile, cardIndex) {
  const facedUpCards = sourcePile.up;
  const facedDownCards = sourcePile.down;
  const remainingFacedUpCards = _.slice(facedUpCards, 0, cardIndex);

  if (_.isEmpty(facedDownCards)) {
    return { down: [], up: remainingFacedUpCards };
  }

  if (_.isEmpty(remainingFacedUpCards)) {
    return {
      down: _.dropRight(facedDownCards, 1),
      up: [_.last(facedDownCards)]
    };
  }

  return { down: facedDownCards, up: remainingFacedUpCards };
}

function updateTargetPile(targetPile, cardsToAdd) {
  return { up: [...targetPile.up, ...cardsToAdd], down: targetPile.down };
}

function moveWithinTableau(gameState, cardStr, targetPileIndex) {
  const { tableau } = gameState;
  const { pileIndex, cardIndex } = findCardInTableau(tableau, cardStr);
  const sourcePile = tableau[pileIndex];
  const sourceFacedUpCards = sourcePile.up;
  const card = sourceFacedUpCards[cardIndex];
  const targetPile = tableau[targetPileIndex];
  const targetFacedUpCards = targetPile.up;

  if (!isValidMoveToTableau(card, targetFacedUpCards)) {
    return gameState;
  }
  const updatedTableu = tableau.slice();
  updatedTableu[pileIndex] = updateSourcePile(sourcePile, cardIndex);
  const cardsToMove = _.slice(sourceFacedUpCards, cardIndex);
  updatedTableu[targetPileIndex] = updateTargetPile(targetPile, cardsToMove);

  return { ...gameState, tableau: updatedTableu };
}

function moveFromWasteToTableau(gameState, targetPileIndex) {
  const { tableau, waste } = gameState;
  const cardOnTop = waste[0];
  const targetPile = tableau[targetPileIndex];

  if (!isValidMoveToTableau(cardOnTop, targetPile.up)) {
    return gameState;
  }

  const updatedTableu = tableau.slice();
  updatedTableu[targetPileIndex] = updateTargetPile(targetPile, [cardOnTop]);

  return { ...gameState, tableau: updatedTableu, waste: _.drop(waste, 1) };
}

function areFromSameSuit(card, anotherCard) {
  return _.isEqual(card.suit, anotherCard.suit);
}

function canBeMovedToFoundation(card, foundation, foundationSuitName) {
  if (_.isEmpty(foundation)) {
    return (
      _.lowerCase(card.suit.name) == foundationSuitName && card.number == 1
    );
  }

  const cardOnTop = _.first(foundation);
  return (
    areFromSameSuit(card, cardOnTop) && card.number == cardOnTop.number + 1
  );
}

function moveFromTableauToFoundation(gameState, cardStr, foundationTarget) {
  const { tableau, foundations } = gameState;
  const foundationSuitName = _.lowerCase(foundationTarget);
  const { pileIndex, cardIndex } = findCardInTableau(tableau, cardStr);
  const sourcePile = tableau[pileIndex];
  const card = sourcePile.up[cardIndex];
  const foundation = foundations[foundationSuitName];
  const isLastCardOnPile = cardIndex == sourcePile.up.length - 1;

  const isMovePossible = !(
    isLastCardOnPile &&
    canBeMovedToFoundation(card, foundation, foundationSuitName)
  );

  if (isMovePossible) {
    return gameState;
  }

  const updatedFoundations = _.update(
    _.clone(foundations),
    foundationSuitName,
    current => [card, ...current]
  );

  const updatedTableau = tableau.slice();
  updatedTableau[pileIndex] = updateSourcePile(sourcePile, cardIndex);

  return {
    ...gameState,
    foundations: updatedFoundations,
    tableau: updatedTableau
  };
}

function moveFromWasteToFoundation(gameState, foundationTarget) {
  const { waste, foundations } = gameState;
  const cardOnTop = waste[0];
  const foundationSuitName = _.lowerCase(foundationTarget);
  const foundation = foundations[foundationSuitName];

  if (!canBeMovedToFoundation(cardOnTop, foundation, foundationSuitName)) {
    return gameState;
  }

  const updatedFoundations = _.update(
    _.clone(foundations),
    foundationSuitName,
    current => [cardOnTop, ...current]
  );

  return {
    ...gameState,
    foundations: updatedFoundations,
    waste: _.drop(waste, 1)
  };
}

function initialGameState() {
  const deck = generateDeck();
  const stock = _.take(deck, 24);
  const waste = [];
  const foundations = {
    spades: [],
    hearts: [],
    clubs: [],
    diamonds: []
  };
  const tableau = generateTableau(_.takeRight(deck, 28));
  return { stock, waste, foundations, tableau };
}

function popFromStock(gameState) {
  const { stock, waste } = gameState;
  if (_.isEmpty(stock)) {
    return { ...gameState, stock: waste, waste: [] };
  }

  const updatedWaste = [_.last(stock), ...waste];
  const updatedStock = _.dropRight(stock, 1);

  return { ...gameState, stock: updatedStock, waste: updatedWaste };
}

function isGameEnded(gameState) {
  const { foundations } = gameState;
  const isFilled = foundation => foundation.length == 13;
  return _.chain(foundations).values().every(isFilled).value();
}

export {
  initialGameState,
  cardToString,
  moveWithinTableau,
  moveFromWasteToTableau,
  moveFromTableauToFoundation,
  moveFromWasteToFoundation,
  popFromStock,
  isGameEnded,
  SUIT_CLUBS,
  SUIT_DIMAONDS,
  SUIT_HEARTS,
  SUIT_SPADES
};
