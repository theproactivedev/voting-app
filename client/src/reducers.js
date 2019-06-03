import {
  FETCH_RESULTS_PENDING, FETCH_RESULTS_RECEIVED, FETCH_RESULTS_REJECTED,
  SET_USER_TWITTER_DETAILS, SET_USER_LOCAL_DETAILS, REMOVE_USER,
  SET_SPECIFIC_POLL,
  TOGGLE_LOGIN_MODAL,
  SET_ERROR_MSG
} from "./actions.js";
import { combineReducers } from "redux";

export const initialState = {
  isFetching: false,
  isUserAuthenticated: false,
  user : {
    userId: "",
    twitter: {
      username: "",
      id: ""
    },
    local: {
      username: "",
      email: ""
    }
  },
  polls: [],
  currentPoll: {
    question: "",
    options: [],
    pollAuthor: ""
  },
  userModal : {
    showLoginModal: false,
    loginModalPath: "",
  },
  error: ""
};

const setLocalUser = (state = {}, action) => {
  switch(action.type) {
    case SET_USER_LOCAL_DETAILS:
      return {
        username: action.user.local.email.split("@")[0],
        email: action.user.local.email
      };
    default: return state;
  }
};  

const setTwitterUser = (state = {}, action) => {
  switch(action.type) {
    case SET_USER_TWITTER_DETAILS:
      return {
        username: action.user.username,
        id: action.user.id
      };
    default: return state;
  }
};  

const user = (state = initialState.user, action) => {
  switch(action.type) {
    case SET_USER_TWITTER_DETAILS :
      return {
          ...state,
          twitter : setTwitterUser(state.twitter, action)
        };
    case SET_USER_LOCAL_DETAILS :
      return {
          ...state,
          local: setLocalUser(state.local, action)
      };
    case REMOVE_USER :
      return {
          userId: "",
          twitter: {
            username: "",
            id: ""
          },
          local: {
            username: "",
            email: ""
          }
      };
    default: return state;
  }
};

const isUserAuthenticated = (state = false, action) => {
  switch(action.type) {
    case SET_USER_TWITTER_DETAILS :
      return true;
    case SET_USER_LOCAL_DETAILS :
      return true;
    case REMOVE_USER :
      return false;
    default: return state;
  }
};


const isFetching = (state = false, action) => {
  switch(action.type) {
    case FETCH_RESULTS_PENDING :
      return true;
    case FETCH_RESULTS_RECEIVED :
      return false;
    case FETCH_RESULTS_REJECTED :
      return false;
    case SET_SPECIFIC_POLL:
      return false;
    default: return state;
  }
}

const currentPoll = (state = initialState.currentPoll, action) => {
  switch(action.type) {
    case SET_SPECIFIC_POLL :
      return {
        question : action.poll.question,
        options: action.poll.options,
        author: action.poll.authorID
      };
    default: return state;
  }
}

const polls = (state= initialState.polls, action) => {
  switch(action.type) {
    case FETCH_RESULTS_RECEIVED :
      return action.polls.length > 0 ? action.polls : [];
    default: return state;
  }
}

const userModal = (state=initialState.userModal, action) => {
  switch(action.type) {
    case TOGGLE_LOGIN_MODAL : 
      return {
        showLoginModal: !state.showLoginModal,
        loginModalPath: action.userFormPath
      };
    default:
      return state;
  }
};

const error = (state="", action) => {
  switch(action.type) {
    case FETCH_RESULTS_REJECTED :
      return action.error;
    case TOGGLE_LOGIN_MODAL:
    case SET_USER_LOCAL_DETAILS :
      return "";
    case SET_ERROR_MSG: 
      return action.error;
    default: return state;
  }
}

export const votingApp = combineReducers({
  user,
  userModal,
  isUserAuthenticated,
  isFetching,
  polls,
  currentPoll,
  error
});
