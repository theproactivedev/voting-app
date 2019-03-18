import React from 'react';
import checkPropTypes from 'check-prop-types';
import { createMemoryHistory } from 'history'
import { render } from 'react-testing-library';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { votingApp } from '../reducers';

export const checkComponentPropTypes = (component, expectedProps) => {
  const propsErr = checkPropTypes(component.propTypes, expectedProps, "props", component.name);
  return propsErr;
}

export const findComponentByDataTest = (component, dataTest) => {
  const wrapper = component.find(`[data-test='${dataTest}']`);
  return wrapper;
}

export const renderWithRouter = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) => {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
};

export const renderWithRedux = (
  ui,
  { initialState, store = createStore(votingApp, initialState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
};

export const renderWithReduxAndRouter = (
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] })} = {},
  { initialState, store = createStore(votingApp, initialState) } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>
    ),
    store, history
  }
}
