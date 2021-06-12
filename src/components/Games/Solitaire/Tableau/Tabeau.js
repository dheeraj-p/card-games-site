import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Card, { FacedDownCard } from '../Card/Card';
import { SOURCE_TYPE, TARGET_TYPE } from '../core/constants';
import { cardToString } from '../core/logic';
import Pile from '../Pile/Pile';
import styles from './Tableau.module.css';

function CardGroup({ card, otherCardGroup }) {
  const cardStr = cardToString(card);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-${cardStr}`,
    data: { sourceType: SOURCE_TYPE.TABLEAU, cardStr }
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div
      className={styles['card-group']}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card className={styles.card} card={card} key={cardToString(card)} />
      {otherCardGroup}
    </div>
  );
}

function TableauPile({ pile, id }) {
  const { setNodeRef } = useDroppable({
    id: `tableau-pile-${id}`,
    data: { targetType: TARGET_TYPE.TABLEAU, targetPileIndex: id }
  });

  const faceUpCardsView = _.reduceRight(
    pile.up,
    (cardGroup, card) => {
      return <CardGroup card={card} otherCardGroup={cardGroup} />;
    },
    <></>
  );

  return (
    <Pile
      cards={_.concat(pile.up, pile.down)}
      className={styles['tableau-pile']}
      ref={setNodeRef}
    >
      {_.map(pile.down, card => (
        <FacedDownCard className={styles.card} key={cardToString(card)} />
      ))}
      {faceUpCardsView}
    </Pile>
  );
}

function Tableau({ tableau, className }) {
  return (
    <div className={`${styles.row} ${className}`}>
      {_.map(tableau, (pile, index) => (
        <TableauPile pile={pile} key={index} id={index} />
      ))}
    </div>
  );
}

export default Tableau;