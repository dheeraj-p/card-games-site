import Link from 'next/link';
import styles from './Logo.module.css';

function Logo() {
  return (
    <Link href="/">
      <span className={`${styles.logo} title`}>QuickGame.io</span>
    </Link>
  );
}

export default Logo;
