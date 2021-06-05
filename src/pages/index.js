import Link from 'next/link';

function HomePage() {
  return (
    <div>
      <Link href="/solitaire">
        <button>Solitaire</button>
      </Link>
    </div>
  );
}

export default HomePage;
