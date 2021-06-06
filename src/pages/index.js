import Link from 'next/link';
import GameBox from '../components/GameBox/GameBox';
import GameList from '../components/GameList/GameList';
import Logo from '../components/Logo/Logo';

function HomePage() {
  return (
    <div>
      <Logo />
      <div className="m-top-medium"></div>
      <div className="center">
        <GameBox>
          <GameList />
        </GameBox>
      </div>
    </div>
  );
}

export default HomePage;
