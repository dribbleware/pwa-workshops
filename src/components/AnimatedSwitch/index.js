import React from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import './style.scss';

const AnimatedSwitch = ({children, location}) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames="fade" timeout={300}>
      <Switch location={location}>
        {children}
      </Switch>
    </CSSTransition>
  </TransitionGroup>
)

export default withRouter(AnimatedSwitch);
