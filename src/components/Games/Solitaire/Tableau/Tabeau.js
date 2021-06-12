import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Card, { CardHole, FacedDownCard } from '../Card/Card';
import { SOURCE_TYPE, TARGET_TYPE } from '../core/constants';
import { cardToString } from '../core/logic';
import styles from './Tableau.module.css';

function CardGroup({ card, otherCardGroup, onDoubleTap }) {
  const cardStr = cardToString(card);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardStr}`,
    data: { sourceType: SOURCE_TYPE.TABLEAU, cardStr }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  const cardAttrs = {
    onDoubleClick: event => {
      event.preventDefault();
      onDoubleTap(card);
    }
  };

  return (
    <div
      className={styles['card-group']}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card
        className={styles.card}
        card={card}
        key={cardToString(card)}
        attributes={cardAttrs}
      />
      {otherCardGroup}
    </div>
  );
}

function TableauPile({ pile, id, onDoubleTap }) {
  const { setNodeRef } = useDroppable({
    id: `tableau-pile-${id}`,
    data: { targetType: TARGET_TYPE.TABLEAU, targetPileIndex: id }
  });

  const faceUpCardsView = _.reduceRight(
    pile.up,
    (cardGroup, card) => {
      return (
        <CardGroup
          card={card}
          otherCardGroup={cardGroup}
          onDoubleTap={onDoubleTap}
        />
      );
    },
    <></>
  );

  return (
    <div className={styles['tableau-pile']} ref={setNodeRef}>
      <CardHole className={styles['card-hole']} />
      <div>
        {_.map(pile.down, card => (
          <FacedDownCard className={styles.card} key={cardToString(card)} />
        ))}
        {faceUpCardsView}
      </div>
    </div>
  );
}

function Tableau({ tableau, className, onDoubleTap }) {
  return (
    <div className={`${styles.row} ${className}`}>
      {_.map(tableau, (pile, index) => (
        <TableauPile
          pile={pile}
          key={index}
          id={index}
          onDoubleTap={onDoubleTap}
        />
      ))}
    </div>
  );
}

export default Tableau;
