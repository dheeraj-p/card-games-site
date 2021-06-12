import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import Card, { CardHole } from '../Card/Card';
import { SOURCE_TYPE } from '../core/constants';
import { cardToString } from '../core/logic';
import styles from './Waste.module.css';

function Waste({ cards, onDoubleTap, shouldFlipThree = false }) {
  const cardOnTop = cards[0];
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardToString(cardOnTop)}`,
    data: { sourceType: SOURCE_TYPE.WASTE }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div>
      <CardHole />
      {_.isEmpty(cards) ? (
        <></>
      ) : (
        <div
          className={styles['waste-card']}
          style={style}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          onDoubleClick={() => onDoubleTap(cardOnTop)}
        >
          <Card card={cardOnTop} />
        </div>
      )}
    </div>
  );
}

export default Waste;
