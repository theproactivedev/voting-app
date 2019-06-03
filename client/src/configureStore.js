import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
// import { createLogger } from "redux-logger";
import {
	votingApp, initialState
} from "./reducers";
import { loadState } from "./localStorage.js";

const middlewares = [thunkMiddleware];

export const configureStore = () => {
  // const loggerMiddleware = createLogger();
  const persistedState = loadState();
  const finalState = persistedState !== undefined ? {
    ...initialState,
    ...persistedState
  } : initialState;

  let store = createStore(
      votingApp,
      finalState,
      applyMiddleware(...middlewares)
    );

  return store;
};
