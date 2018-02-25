import React, { Fragment, Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import List from './List';
import EmptyPage from './EmptyPage';
import TabBar from './TabBar';
import ItemShow from './ItemShow';
import AnimatedSwitch from './AnimatedSwitch';
import { withAnimatedWrapper } from './AnimatedRouter';
import './style.scss';

class App extends Component {
  state = {
    wines: [],
    areWeOnline: navigator.onLine,
  };

  componentDidMount() {
    this.getData();
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));
  }

  setOnlineStatus(status) {
    this.setState({
      areWeOnline: status,
    })
  }

  getData = () => {
    fetch('https://api-wine.herokuapp.com/api/v1/wines')
      .then(res => res.json())
      .then(data => {
        this.setState({ wines: data });
      });
  };

  renderContent() {
    const componentProps = { items: this.state.wines };
    if (!this.state.wines.length) {
      return <div />;
    }

    return (
      <div className={this.state.areWeOnline ? '' : 'offline'}>
        <Route render={({ location }) => (
          <AnimatedSwitch location={location}>
            <Route exact path="/" component={withAnimatedWrapper(List, componentProps)} />
            <Route path="/wine/:id" component={withAnimatedWrapper(ItemShow, componentProps)} />
            <Route path="/wishlist" component={EmptyPage} />
            <Route path="/cellar" component={EmptyPage} />
            <Route path="/articles" component={EmptyPage} />
            <Route path="/profile" component={EmptyPage} />
          </AnimatedSwitch>
        )}
      />
      <TabBar />
      </div>
    );
  }

  render() {
    return (
      <Router>
        <Fragment>
          {this.renderContent()}
        </Fragment>
      </Router>
    );
  }
}

export default App;
