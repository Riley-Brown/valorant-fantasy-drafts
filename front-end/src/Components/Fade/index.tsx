import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import './Fade.scss';

export default function Fade({
  inProp,
  children
}: {
  inProp: boolean;
  children: ReactNode;
}) {
  return (
    <CSSTransition
      unmountOnExit={true}
      in={inProp}
      timeout={200}
      classNames="fade"
    >
      {children}
    </CSSTransition>
  );
}
