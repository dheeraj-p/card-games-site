import Head from 'next/head';
import Center from '../components/Center/Center';
import GameBox from '../components/GameBox/GameBox';
import Logo from '../components/Logo/Logo';
import Solitaire from '../components/Games/Solitaire/Solitaire';

function Game() {
  return (
    <main>
      <Head>
        <title>Solitaire | QuickGame.io</title>
        <meta
          name="description"
          property="og:description"
          content="Play Solitaire on QuickGame.io"
        />
        <meta
          name="title"
          property="og:title"
          content="Solitaire | QuickGame.io"
        />
      </Head>
      <Logo />
      <div className="m-medium"></div>
      <Center>
        <div className="content">
          <GameBox>
            <Solitaire />
          </GameBox>
          <div className="more-information">
            <h2>Solitaire Rules</h2>
            <h3>The different piles</h3>
            <p>
              There are four different types of piles in Solitaire. They are:
            </p>
            <ul>
              <li>
                <strong>The Stock:</strong> The pile of facedown cards in the
                upper left corner.
              </li>
              <li>
                <strong>The Waste:</strong> The faceup pile next to the Stock in
                the upper left
              </li>
              corner.
              <li>
                <strong>The Foundations:</strong> The four piles in the upper
                right corner.
              </li>
              <li>
                <strong>The Tableau:</strong> The seven piles that make up the
                main table.
              </li>
            </ul>
            <h3>The setup</h3>
            <p>
              The Tableau piles are numbered from 1 to 7, pile 1 has 1 card,
              pile 2 has 2 cards and so on. The top card on each Tableau pile is
              turned face up, the cards below are turned face down. The cards
              that are left after setting up the Tableau are placed in the
              Stock, face down. The Waste and the Foundations start off empty.
            </p>
            <h3>The objective</h3>
            <p>
              To win Solitaire, you must get all the cards onto the Foundation
              piles. The Foundations are ordered by suit and rank, each
              Foundation has one suit and you must put the cards onto them in
              the order Ace 2 3 4 5 6 7 8 9 10 Jack Queen King. To get there,
              you can use the moves described below.
            </p>
            <h3>Allowed moves</h3>
            <ul>
              <li>
                <strong>Flip cards from the Stock onto the Waste.</strong>You
                can flip either 1 or 3 cards from the Stock onto the Waste. The
                number can be configured in Options.
              </li>
              <br />
              <li>
                <strong>
                  Move a card from the Waste onto the Foundations.
                </strong>
                If the top card of the Waste can go onto one of the Foundations
                then you can drag it there.
              </li>
              <br />
              <li>
                <strong>Move a card from the Waste onto the Tableau.</strong>You
                can move the top card of the Waste onto one of the Tableau
                piles.
              </li>
              <br />
              <li>
                <strong>
                  Move a card from a Foundation back onto the Tableau.
                </strong>
                You can move the top card of a Foundation back onto the Tableau.
                This isn't allowed in all Solitaire versions, but we allow it
                here :)
              </li>
              <br />
              <li>
                <strong>
                  Move one or more cards from one Tableau pile to another.
                </strong>{' '}
                You can move a face up card on the Tableau onto another Tableau
                pile, if that pile's top card is one higher than the moved card
                and in a different color. For example, you could move a red 6
                onto a black 7. Or, if you have red 6, black 5, red 4 face up on
                one tableau, you can move all of them at the same time onto a
                Tableau with a black 7. If you have an empty Tableau pile then
                you can only place a king there.
              </li>
              <br />
              <li>
                <strong>You can flip a face down Tableau card.</strong>If you
                have moved a face up card from a Tableau pile so now the top
                card is face down, then you can click the face down card and it
                will be flipped and shown face up.
              </li>
              <br />
              <li>
                <strong>
                  You can move a Tableau card onto the Foundations.
                </strong>
                You can do this manually if you need to clear some space on the
                Tableau. You can either drag the cards onto the Foundation, or
                just double click it and then it will go there by itself. When
                all cards on the Tableau are turned up, and all cards from the
                stock are finished then the game will automatically move all the
                Tableau cards onto the Foundations, since at that point you are
                guaranteed to win the game.
              </li>
              <br />
              <li>
                <strong>You can Undo as many times as you like.</strong>The game
                offers unlimited undos. Each Undo counts as a new move though,
                so if you're trying to win the game in as few moves as possible
                you should be careful about how many undos you use.
              </li>
            </ul>
          </div>
        </div>
      </Center>
    </main>
  );
}

export default Game;
