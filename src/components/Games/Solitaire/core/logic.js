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
    .map(pile => ({ up: _.takeRight(pile, 3), down: _.dropRight(pile, 3) }))
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
  for (let pileNumber = 0; pileNumber < tableau.length; pileNumber++) {
    const currentPile = _.map(tableau[pileNumber].up, cardToString);
    const cardIndex = _.indexOf(currentPile, cardStr);

    if (cardIndex > -1) {
      return { pileNumber, cardIndex };
    }
  }
  return { pileNumber: -1, cardIndex: -1 };
}

function moveCard(gameState, cardStr, targetTableuPileNum) {
  const { tableau } = gameState;
  const { pileNumber, cardIndex } = findCardInTableau(tableau, cardStr);
  const sourcePile = tableau[pileNumber].up;
  const targetPile = tableau[targetTableuPileNum].up;
  const updatedTargetPile = [...targetPile, ..._.slice(sourcePile, cardIndex)];
  const updatedSourcePile = _.slice(sourcePile, 0, cardIndex);
  const updatedTableu = tableau.slice();
  updatedTableu[pileNumber] = {
    up: updatedSourcePile,
    down: tableau[pileNumber].down
  };
  updatedTableu[targetTableuPileNum] = {
    up: updatedTargetPile,
    down: tableau[targetTableuPileNum].down
  };

  console.log({ ...gameState, tableau: updatedTableu });

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
