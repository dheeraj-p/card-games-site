import Link from 'next/link';
import Center from '../Center/Center';
import styles from './GameList.module.css';

function GameItem({ gameId, name, icon }) {
  return (
    <Link href={`/games/${gameId}`} as={`/games/${gameId}`}>
      <div>
        <div className={styles['game-card']}>
          <Center>
            <img className={styles.icon} src={`/assets/icons/${icon}`} />
          </Center>
        </div>
        <Center>{name}</Center>
      </div>
    </Link>
  );
}

function GameList({ games }) {
  return (
    <div>
      <Center className={`title ${styles.title}`}>Available Games</Center>
      <div className={styles.games}>
        {games.map(({ gameId, name, icon }) => (
          <GameItem key={gameId} gameId={gameId} name={name} icon={icon} />
        ))}
      </div>
      <Center>More games to be added soon!</Center>
    </div>
  );
}

export default GameList;
