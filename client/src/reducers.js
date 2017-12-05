import {
  FETCH_RESULTS_PENDING,
  FETCH_RESULTS_RECEIVED,
  FETCH_RESULTS_REJECTED,
  SET_USER_DETAILS,
  REMOVE_USER,
  SET_SPECIFIC_POLL
} from './actions.js';

const initialState = {
  isFetching: false,
  isUserAuthenticated: false,
  user : {
    userName: "",
    userId: "",
    userToken: "",
  },
  polls: [],
  currentPoll: {
    question: "",
    options: [],
    pollAuthor: ""
  },
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
    case REMOVE_USER :
      return {
        ...state,
        isUserAuthenticated: false,
        user: {
          userName: "",
          userId: "",
          userToken: ""
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
