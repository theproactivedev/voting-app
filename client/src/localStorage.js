export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('abcd');
    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('abcd', serializedState);
  } catch(err) {
    console.log("Something's wrong with the functionalities.");
  }
}
