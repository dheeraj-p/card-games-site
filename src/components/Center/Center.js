import styles from './Center.module.css';

function Center({ children, className }) {
  return <div className={`${styles.center} ${className}`}>{children}</div>;
}

export default Center;
