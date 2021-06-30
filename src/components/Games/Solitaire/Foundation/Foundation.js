import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import Card, { CardHole } from '../Card/Card';
import { TARGET_TYPE, SOURCE_TYPE } from '../core/constants';
import styles from './Foundation.module.css';
import { cardToString } from '../core/logic';
import { mergeRefs } from '../../../../common/utils';

const Foundation = React.forwardRef(({ cards, suit }, ref) => {
  const cardStr = cardToString(cards[0]);
  const { setNodeRef } = useDroppable({
    id: `foundation-pile-${suit.name}`,
    data: { targetType: TARGET_TYPE.FOUNDATION, foundationTarget: suit.name }
  });

  const {
    attributes,
    listeners,
    setNodeRef: droppableRef,
    transform
  } = useDraggable({
    id: `card-${cardStr}`,
    data: { sourceType: SOURCE_TYPE.FOUNDATION, foundationSource: suit.name }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  const iconSrc = `/assets/icons/${_.lowerCase(suit.name)}_icon.png`;

  if (_.isEmpty(cards)) {
    return (
      <div>
        <CardHole />
        <div className={styles.foundation} ref={mergeRefs(ref, setNodeRef)}>
          <img
            className={styles['foundation-icon']}
            src={iconSrc}
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <CardHole />
      <div
        className={styles.card}
        ref={mergeRefs(ref, setNodeRef, droppableRef)}
        {...attributes}
        {...listeners}
        style={style}
      >
        <Card card={cards[0]} />
      </div>
    </div>
  );
});

export default Foundation;
