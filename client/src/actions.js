export const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
export const FETCH_RESULTS_RECEIVED = 'FETCH_RESULTS_RECEIVED';
export const FETCH_RESULTS_REJECTED = 'FETCH_RESULTS_REJECTED';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_SPECIFIC_POLL = 'SET_SPECIFIC_POLL';

export function setUserDetails(user) {
  return {
    type: SET_USER_DETAILS,
    user
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}

function setSpecificPoll(poll) {
  return {
    type: SET_SPECIFIC_POLL,
    poll
  };
}

function requestResults() {
  return {
    type: FETCH_RESULTS_PENDING
  };
}

function receiveResults(polls) {
  return {
    type: FETCH_RESULTS_RECEIVED,
    polls
  };
}

function rejectResults(error) {
  return {
    type: FETCH_RESULTS_REJECTED,
    error
  };
}

export function getPolls(dest, token) {
  return (dispatch) => {
    dispatch(requestResults());
    return fetch(dest, {
        method: "GET",
        headers: new Headers({
          'Content-type' : 'application/json',
          'x-auth-token' : token
        })
      })
      .then(response => response.json(),
      error => dispatch(rejectResults(error)))
      .then(json => dispatch(receiveResults(json)));
  };
}

export function getSpecificPoll (dest) {
  return (dispatch, getState) => {
    dispatch(requestResults());
    return fetch(dest)
    .then(response => response.json(),
    error => dispatch(rejectResults(error)))
    .then(json => dispatch(setSpecificPoll(json)));
  };
}

export function voteOnPoll(dest, obj) {
  return (dispatch) => {
    return fetch(dest, {
        method: "POST",
        headers: new Headers({
          'Content-type' : 'application/json'
        }),
        body: JSON.stringify(obj)
      })
      .then(error => dispatch(rejectResults(error)));
  };
}

export function deletePoll(dest) {
  return (dispatch) => {
    return fetch(dest, {
        method: "DELETE"
      })
      .then(error => dispatch(rejectResults(error)));
  };
}

export function addPoll(dest, token, obj) {
  return (dispatch) => {
    return fetch(dest, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token' : token
      },
      body: JSON.stringify(obj)
    })
    .then(error => dispatch(rejectResults(error)));
  }

}
