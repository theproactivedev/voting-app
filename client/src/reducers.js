import {
  FETCH_RESULTS_PENDING,
  FETCH_RESULTS_RECEIVED,
  FETCH_RESULTS_REJECTED,
  SET_USER_DETAILS,
  REMOVE_USER,
  SET_SPECIFIC_POLL,
  SET_USER_LOCAL_DETAILS,
  TOGGLE_LOGIN_MODAL,
  SET_USER_TOKEN
} from './actions.js';

export const initialState = {
  isFetching: false,
  isUserAuthenticated: false,
  user : {
    userName: "",
    userId: "",
    userToken: "",
    userEmail: "",
  },
  polls: [],
  currentPoll: {
    question: "",
    options: [],
    pollAuthor: ""
  },
  showLoginModal: false,
  loginModalPath: "",
  error: ""
};

export const votingApp = (state=initialState, action) => {
  switch(action.type) {
    case SET_USER_DETAILS :
      return {
        ...state,
        isUserAuthenticated: true,
        user: {
          userName: action.user.userName,
          userId: action.user.userId,
          userToken: action.user.userToken
        }
      };
    case SET_USER_LOCAL_DETAILS :
      return {
        ...state,
        isUserAuthenticated: true,
        user: {
          ...state.user,
          userName: action.user.user.local.email,
          userEmail: action.user.user.local.email,
          userId: action.user.user._id
        }
      }
    case SET_USER_TOKEN :
      return {
        ...state,
        user: {
          ...state.user,
          userToken: action.token
        }
      }
    case REMOVE_USER :
      return {
        ...state,
        isUserAuthenticated: false,
        user: {
          userName: "",
          userId: "",
          userToken: "",
          userEmail: ""
        }
      };
    case FETCH_RESULTS_PENDING :
      return {
        ...state,
        isFetching: true
      };
    case FETCH_RESULTS_RECEIVED :
      return {
        ...state,
        isFetching: false,
        polls: action.polls
      };
    case FETCH_RESULTS_REJECTED :
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case TOGGLE_LOGIN_MODAL : 
      return {
        ...state, showLoginModal: !state.showLoginModal, loginModalPath: action.userFormPath
      };
    case SET_SPECIFIC_POLL :
      return {
        ...state,
        currentPoll: {
          question : action.poll.question,
          options: action.poll.options,
          pollAuthor: action.poll.twitterID
        },
        isFetching: false
      };
    default:
      return state;
  }
};
