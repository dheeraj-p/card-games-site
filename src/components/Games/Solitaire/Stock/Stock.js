import _ from 'lodash';
import { CardHole, FacedDownCard, InvisibleCard } from '../Card/Card';

function Stock({ cards, onClick }) {
  const attributes = { onClick };

  return (
    <div {...attributes}>
      <CardHole />
      {_.isEmpty(cards) ? <InvisibleCard /> : <FacedDownCard />}
    </div>
  );
}

export default Stock;
