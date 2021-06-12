import { FacedDownCard } from '../Card/Card';
import Pile from '../Pile/Pile';

function Stock({ cards, onClick }) {
  const attributes = { onClick };

  return (
    <Pile cards={cards} attributes={attributes}>
      <FacedDownCard />
    </Pile>
  );
}

export default Stock;
