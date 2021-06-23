import { useRouter } from 'next/router';
import Head from 'next/head';
import Center from '../../components/Center/Center';
import GameBox from '../../components/GameBox/GameBox';
import Logo from '../../components/Logo/Logo';
import gamesData from '../../data/games';

function Game() {
  const router = useRouter();
  const { gameId } = router.query;
  const game = gamesData[gameId];

  if (!game) {
    return <Center>Game not found</Center>;
  }

  return (
    <div>
      <Head>
        <title>{game.name} | QuickGame.io</title>
        <meta
          name="description"
          property="og:description"
          content={`Play ${game.name} on QuickGame.io`}
        />
        <meta
          name="title"
          property="og:title"
          content={`${game.name} | QuickGame.io`}
        />
      </Head>
      <Logo />
      <div className="m-medium"></div>
      <Center>
        <GameBox>{game.component()}</GameBox>
      </Center>
    </div>
  );
}

export default Game;
