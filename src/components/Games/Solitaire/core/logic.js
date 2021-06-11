import _ from 'lodash';

const COLOR_RED = 'RED';
const COLOR_BLACK = 'BLACK';

const SUIT_SPADES = { name: 'SPADES', color: COLOR_BLACK };
const SUIT_HEARTS = { name: 'HEARTS', color: COLOR_RED };
const SUIT_CLUBS = { name: 'CLUBS', color: COLOR_BLACK };
const SUIT_DIMAONDS = { name: 'DIMAONDS', color: COLOR_RED };

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

function isValidMove(card, targetFacedUpCards) {
  if (_.isEmpty(targetFacedUpCards)) {
    return isCardAKing(card);
  }

  const cardOnTop = _.last(targetFacedUpCards);

  return (
    cardOnTop.suit.color != card.suit.color && card.number < cardOnTop.number
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

function moveCard(gameState, cardStr, targetPileIndex) {
  const { tableau } = gameState;
  const { pileIndex, cardIndex } = findCardInTableau(tableau, cardStr);
  const sourcePile = tableau[pileIndex];
  const sourceFacedUpCards = sourcePile.up;
  const targetPile = tableau[targetPileIndex];
  const targetFacedUpCards = targetPile.up;

  if (!isValidMove(sourceFacedUpCards[cardIndex], targetFacedUpCards)) {
    return gameState;
  }
  const updatedTableu = tableau.slice();
  updatedTableu[pileIndex] = updateSourcePile(sourcePile, cardIndex);
  const cardsToMove = _.slice(sourceFacedUpCards, cardIndex);
  updatedTableu[targetPileIndex] = updateTargetPile(targetPile, cardsToMove);

  return { ...gameState, tableau: updatedTableu };
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

export {
  initialGameState,
  cardToString,
  moveCard,
  SUIT_CLUBS,
  SUIT_DIMAONDS,
  SUIT_HEARTS,
  SUIT_SPADES
};
