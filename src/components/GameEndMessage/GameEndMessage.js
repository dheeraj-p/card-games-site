import styles from './GameEndMessage.module.css';

function GameEndMessage({ message, onNewGame }) {
  return (
    <div className={styles.container}>
      <span>{message}</span>
      <div className="m-medium" />
      <button className={styles['new-game-btn']} onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
}

export default GameEndMessage;
