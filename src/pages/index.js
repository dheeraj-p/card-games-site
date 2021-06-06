import Center from '../components/Center/Center';
import GameBox from '../components/GameBox/GameBox';
import GameList from '../components/GameList/GameList';
import Logo from '../components/Logo/Logo';
import gamesData from '../data/games';

function HomePage() {
  return (
    <div>
      <Logo />
      <div className="m-top-medium" />
      <Center>
        <GameBox>
          <GameList games={Object.values(gamesData)} />
        </GameBox>
      </Center>
    </div>
  );
}

export default HomePage;
