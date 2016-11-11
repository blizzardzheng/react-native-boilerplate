import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar, Navigator } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash/core';

import { closeDrawer } from './actions/drawer';
import { popRoute } from './actions/route';

import { Drawer } from 'native-base';
import Home from './components/Home';
import SideBar from './components/SideBar';

import { statusBarColor } from './themes/base-theme';

Navigator.prototype.replaceWithAnimation = (route) => {
  const activeLength = this.state.presentedIndex + 1;
  const activeStack = this.state.routeStack.slice(0, activeLength);
  const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
  const nextStack = activeStack.concat([route]);
  const destIndex = nextStack.length - 1;
  const nextSceneConfig = this.props.configureScene(route, nextStack);
  const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

  const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
  this._emitWillFocus(nextStack[destIndex]);
  this.setState({
    routeStack: nextStack,
    sceneConfigStack: nextAnimationConfigStack,
  }, () => {
    this._enableScene(destIndex);
    this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
        this.immediatelyResetRouteStack(replacedStack);
      });
  });
};

export const globalNav = {};

const searchResultRegexp = /^search\/(.*)$/;

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    var currentState = state;

    if (currentState) {
        while (currentState.children) {
            currentState = currentState.children[currentState.index];
          }
      }
    return defaultReducer(state, action);
  };
};

const drawerStyle = { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 };

class AppNavigator extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    globalNav.navigator = this._navigator;

    this.props.store.subscribe(() => {
        if (this.props.store.getState().drawer.drawerState == 'opened')
            this.openDrawer();

        if (this.props.store.getState().drawer.drawerState == 'closed')
            this._drawer.close();
      });

    BackAndroid.addEventListener('hardwareBackPress', () => {
        var routes = this._navigator.getCurrentRoutes();

        if (routes[routes.length - 1].id == 'home' || routes[routes.length - 1].id == 'login') {
            return false;
          }
        else {
            this.popRoute();
            return true;
          }
      });
  }

  popRoute() {
    this.props.popRoute();
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    if (this.props.store.getState().drawer.drawerState == 'opened') {
        this._drawer.close();
        this.props.closeDrawer();
      }
  }

  render() {
    return (
            <Drawer
              ref={(ref) => this._drawer = ref}
              type="overlay"
              content={<SideBar navigator={this._navigator} />}
              tapToClose
              acceptPan={false}
              onClose={() => this.closeDrawer()}
              openDrawerOffset={0.2}
              panCloseMask={0.2}
              negotiatePan
            >
              <StatusBar
                backgroundColor={statusBarColor}
                barStyle="light-content"
              />
              <Navigator
                ref={(ref) => this._navigator = ref}
                configureScene={() => ({
                  ...Navigator.SceneConfigs.FloatFromRight,
                  gestures: {}
                })}
                initialRoute={{ id: (Platform.OS === 'android') ? 'splashscreen' : 'login', statusBarHidden: true }}
                renderScene={this.renderScene}
              />
            </Drawer>
        );
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 'home':
        return <Home navigator={navigator} />;
      default:
        return <Home navigator={navigator} />;
    }
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute())
  };
}

const mapStateToProps = (state) => {
  return {
    drawerState: state.drawer.drawerState,
  };
};

export default connect(mapStateToProps, bindAction)(AppNavigator);
