export const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
export const FETCH_RESULTS_RECEIVED = 'FETCH_RESULTS_RECEIVED';
export const FETCH_RESULTS_REJECTED = 'FETCH_RESULTS_REJECTED';
export const SET_USER_TWITTER_DETAILS = 'SET_USER_TWITTER_DETAILS';
export const SET_USER_LOCAL_DETAILS = 'SET_USER_LOCAL_DETAILS';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_SPECIFIC_POLL = 'SET_SPECIFIC_POLL';
export const TOGGLE_LOGIN_MODAL = "TOGGLE_LOGIN_MODAL";
export const SET_ERROR_MSG = "SET_ERROR_MSG";

export const setUserTwitterDetails = (user) => {
  return {
    type: SET_USER_TWITTER_DETAILS,
    user
  };
}

const setUserLocalDetails = (user) => {
  return {
    type: SET_USER_LOCAL_DETAILS,
    user
  }
}

export const submitUserLocalDetails = (user, path) => {
  return dispatch => {
    fetch(path, {
      method: "POST",
      headers: new Headers({
        'Accept': 'application/json',
        'Content-type' : 'application/json'
      }),
      body: JSON.stringify(user)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { dispatch(rejectResults(text)); });
      }
      return response.json();
    }, error => console.error("Error: " + error))
    .then(json => {
      if (json !== undefined) {
        dispatch(setUserLocalDetails(json));
        dispatch(toggleLoginModal(""));
        localStorage.setItem("abcd", JSON.stringify({
          isUserAuthenticated: true,
          user: {
            twitter: { username: "", id: ""},
            local: {
              username: json.local.email.split("@")[0],
              email: json.local.email
            },
          }
        }));
      }
    });
  }
}

export const receiveUserLocalDetails = () => {
  return dispatch => {
    fetch("/profile", {
      method: "GET",
      headers: new Headers({
        "Content-type":"application/json"
      })
    })
    .then(response => response.json(), error => dispatch(rejectResults(error)))
    .then(json => dispatch(setUserLocalDetails(json)));
  };
}

export const removeUser = () => {
  return {
    type: REMOVE_USER
  };
}

const requestResults = () => {
  return {
    type: FETCH_RESULTS_PENDING
  };
}

const receiveResults = (polls) => {
  return {
    type: FETCH_RESULTS_RECEIVED,
    polls
  };
}

const rejectResults = (error) => {
  return {
    type: FETCH_RESULTS_REJECTED,
    error
  };
}

export const setErrorMessage = (error) => {
  return {
    type: SET_ERROR_MSG,
    error
  }
}

export const toggleLoginModal = (userFormPath) => {
  return { type: TOGGLE_LOGIN_MODAL, userFormPath };
}

export const getPublicPolls = () => {
  return (dispatch) => {
    dispatch(requestResults());
    return fetch("/polls", {
        method: "GET",
        headers: new Headers({
          'Content-type' : 'application/json'
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { dispatch(rejectResults(text)); })
        }
        return response.json();
      }, error => dispatch(rejectResults(error)))
      .then(json => dispatch(receiveResults(json)));
  };
}

export const getPolls = (username="") => {
  return (dispatch) => {
    dispatch(requestResults());
    return fetch("/myPolls", {
        method: "POST",
        headers: new Headers({
          'Content-type' : 'application/json'
        }),
        body: JSON.stringify({ username })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { dispatch(rejectResults(text)); })
        }
        return response.json();
      }, error => dispatch(rejectResults(error)))
      .then(json => dispatch(receiveResults(json)));
  };
}

export const getSpecificPoll = (dest) => {
  return (dispatch) => {
    dispatch(requestResults());
    return fetch(dest)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { dispatch(rejectResults(text)); })
      }

      return response.json();
    }, error => dispatch(rejectResults(error)))
    .then(json => dispatch(setSpecificPoll(json)));
  };
}

const setSpecificPoll = (poll) => {
  return {
    type: SET_SPECIFIC_POLL,
    poll
  };
}

export const voteOnPoll = (dest, obj) => {
  return (dispatch) => {
    return fetch(dest, {
        method: "POST",
        headers: new Headers({
          'Content-type' : 'application/json'
        }),
        body: JSON.stringify(obj)
      })
      .catch(error => dispatch(rejectResults(error)));
  };
}

export const deletePoll = (dest) => {
  return (dispatch) => {
    return fetch(dest, {
        method: "DELETE"
      })
      .catch(error => dispatch(rejectResults(error)));
  };
}

export const addPoll = (dest, obj) => {
  return (dispatch) => {
    return fetch(dest, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    .catch(error => dispatch(rejectResults(error)));
  }

}
