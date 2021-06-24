import Center from '../components/Center/Center';
import GameBox from '../components/GameBox/GameBox';
import GameList from '../components/GameList/GameList';
import Logo from '../components/Logo/Logo';
import gamesData from '../data/games';

function HomePage() {
  return (
    <main>
      <Logo />
      <div className="m-medium" />
      <Center>
        <div className="content">
          <GameBox>
            <GameList games={Object.values(gamesData)} />
          </GameBox>
          <div className="more-information">
            <h2>About Us</h2>
            <p>
              QuickGame.io is a game site focused on classic card and board
              games. Our goal is to make great versions of the games you already
              know and love in real life. We try very hard to make the games
              simple and easy to use, and hope you enjoy playing them as much as
              we enjoy making them 🙂
            </p>
            <h2>Frequently Asked Questions</h2>
            <strong>
              Q: Why won't you add
              rule-variations/replayable-games/any-other-feature? It would make
              the game much better.
            </strong>
            <p>
              A: We get a lot of requests from people that just want one tiny
              little feature added to a game. What they don't realize is that if
              we start implementing all the suggestions we get then the games
              will no longer be simple. The number one praise we get is that the
              interface is simple and uncluttered and it's easy to play. That's
              very much deliberate. There is no login, no loading screens, as
              few options as possible. We want to keep it as simple as possible,
              and that means each game only has one set of rules, you can't
              choose variations, we try to add as few controls as possible to
              the screen etc. So, don't feel bad if you make a suggestion and I
              deny it, we deny 99% of all suggestions.
            </p>
            <strong>Q: Does this site use cookies?</strong>
            <p>A: No we don't use any cookies or trackers.</p>
            <strong>Q: Why can't I see my statistics?</strong>
            <p>
              A: This goes back to simplicity again. We don't want people to
              have to login to the site. We don't want to keep passwords in a
              database and be responsible for them. So, we don't store them
              anywhere.
            </p>
          </div>
        </div>
      </Center>
    </main>
  );
}

export default HomePage;
