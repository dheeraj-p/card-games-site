import styles from './GameBox.module.css';

function GameBox({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default GameBox;
