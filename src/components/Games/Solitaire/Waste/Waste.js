import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Card from '../Card/Card';
import { SOURCE_TYPE } from '../core/constants';
import { cardToString } from '../core/logic';
import Pile from '../Pile/Pile';
import styles from './Waste.module.css';

function Waste({ cards, shouldFlipThree = false }) {
  const cardOnTop = cards[0];
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardToString(cardOnTop)}`,
    data: { sourceType: SOURCE_TYPE.WASTE }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <Pile cards={cards}>
      <div
        className={styles['waste-card']}
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <Card card={cardOnTop} />
      </div>
    </Pile>
  );
}

export default Waste;
