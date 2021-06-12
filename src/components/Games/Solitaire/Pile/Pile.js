import React from 'react';
import styles from './Pile.module.css';

const EmptyPile = React.forwardRef(
  ({ children, className, attributes }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.pile} ${styles.empty} ${className}`}
        {...attributes}
      >
        {children}
      </div>
    );
  }
);

function InvisiblePile() {
  return <div className={`${styles.pile} ${styles.invisible}`} />;
}

const Pile = React.forwardRef(
  ({ cards, onEmpty, className, children, attributes }, ref) => {
    if (!_.isEmpty(cards)) {
      return (
        <div
          ref={ref}
          className={`${styles.pile} ${className}`}
          {...attributes}
        >
          {children}
        </div>
      );
    }

    if (_.isNil(onEmpty)) {
      return <EmptyPile ref={ref} attributes={attributes} />;
    }

    return onEmpty();
  }
);

export default Pile;
export { EmptyPile, InvisiblePile };
