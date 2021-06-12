import { useRouter } from 'next/router';
import Center from '../../components/Center/Center';
import GameBox from '../../components/GameBox/GameBox';
import Logo from '../../components/Logo/Logo';
import gamesData from '../../data/games';

function Game() {
  const router = useRouter();
  const { gameId } = router.query;
  const game = gamesData[gameId];
  let GameComponent = () => <Center>Game not found</Center>;

  if (game) {
    GameComponent = game.component;
  }

  return (
    <div>
      <Logo />
      <div className="m-medium"></div>
      <Center>
        <GameBox>
          <GameComponent />
        </GameBox>
      </Center>
    </div>
  );
}

export default Game;
