import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import _ from 'lodash';
import Card, { CardHole } from '../Card/Card';
import { TARGET_TYPE } from '../core/constants';
import styles from './Foundation.module.css';
import { mergeRefs } from '../../../../common/utils';

const Foundation = React.forwardRef(({ cards, suit }, ref) => {
  const { setNodeRef } = useDroppable({
    id: `foundation-pile-${suit.name}`,
    data: { targetType: TARGET_TYPE.FOUNDATION, foundationTarget: suit.name }
  });

  const iconSrc = `/assets/icons/${_.lowerCase(suit.name)}_icon.png`;

  const setAllRefs = mergeRefs(ref, setNodeRef);
  if (_.isEmpty(cards)) {
    return (
      <div>
        <CardHole />
        <div className={styles.foundation} ref={setAllRefs}>
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
    <div ref={setAllRefs}>
      <Card card={cards[0]} />
    </div>
  );
});

export default Foundation;
