import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';
// import { log } from 'loglevel';

// const __LOG_LEVEL__ = 'debug';
// log.setLevel(__LOG_LEVEL__);
// console.log('debug', __DEV__);

export default () => class extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false })),
    };
  }
  render() {
    return (
      <Provider store={this.state.store}>
        <App store={this.state.store} />
      </Provider>
    );
  }
};

