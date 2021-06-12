import { useDroppable } from '@dnd-kit/core';
import Card from '../Card/Card';
import { TARGET_TYPE } from '../core/constants';
import Pile, { EmptyPile } from '../Pile/Pile';
import styles from './Foundation.module.css';

function Foundation({ cards, suit }) {
  const { setNodeRef } = useDroppable({
    id: `foundation-pile-${suit.name}`,
    data: { targetType: TARGET_TYPE.FOUNDATION, foundationTarget: suit.name }
  });

  const iconSrc = `/assets/icons/${_.lowerCase(suit.name)}_icon.png`;

  const onEmptyRender = () => {
    return (
      <EmptyPile className={styles.foundation} ref={setNodeRef}>
        <img className={styles['foundation-icon']} src={iconSrc} />
      </EmptyPile>
    );
  };

  return (
    <Pile cards={cards} ref={setNodeRef} onEmpty={onEmptyRender}>
      <Card card={cards[0]} />
    </Pile>
  );
}

export default Foundation;
