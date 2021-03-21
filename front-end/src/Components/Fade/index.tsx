import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import './Fade.scss';

interface FadeProps {
  inProp: boolean;
  children: ReactNode;
  onEnter?: () => any;
  onEntered?: () => any;
  onExit?: () => any;
  onExited?: () => any;
}

const Fade: React.FC<FadeProps> = ({
  inProp,
  children,
  onEnter,
  onEntered,
  onExit,
  onExited
}: FadeProps) => {
  return (
    <CSSTransition
      on
      unmountOnExit={true}
      in={inProp}
      timeout={200}
      classNames="fade"
      onEnter={onEnter}
      onExit={onExit}
      onEntered={onEntered}
      onExited={onExited}
    >
      {children}
    </CSSTransition>
  );
};

export default Fade;
