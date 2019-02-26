import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {
	votingApp, initialState
} from './reducers';
import { loadState, saveState } from './localStorage.js';
import throttle from 'lodash/throttle';

export const configureStore = () => {
  const loggerMiddleware = createLogger();
  const persistedState = loadState();
  const finalState = persistedState !== undefined ? {
    ...initialState,
    isUserAuthenticated: persistedState.isUserAuthenticated,
    user: {
      ...initialState.user,
      userName: persistedState.userName,
      userEmail: persistedState.userEmail,
      userToken: document.cookie,
      userId: persistedState.userId
    }
  } : initialState;

  let store = createStore(
      votingApp,
      finalState,
      applyMiddleware(thunkMiddleware, loggerMiddleware)
    );

  store.subscribe(throttle(() => {
    if (store.getState().user.userName !== "") {
      console.log("Store");
      saveState({
        isUserAuthenticated: true,
        userName: store.getState().user.userName,
        userEmail: store.getState().user.userEmail,
        userId: store.getState().user.userId
      });
    }
  }, 1000));

  return store;
};
