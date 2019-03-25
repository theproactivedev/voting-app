import React from 'react';
import Navigation from '../Navigation';
import { renderWithReduxAndRouter } from '../../utils/utils';
import { cleanup, fireEvent, wait } from 'react-testing-library';


describe("it should render Navigation", () => {
  it("should render component", () => {
    const { container, getByText } = renderWithReduxAndRouter(<Navigation />);
    expect(container).toBeDefined();
    expect(getByText("FCC Voting App")).toBeDefined();
    expect(getByText("Polls")).toBeDefined();
    expect(getByText("Sign Up")).toBeDefined();
  });

  it("should show the modal", () => {
    const { getByText, getByLabelText, getByPlaceholderText } = renderWithReduxAndRouter(<Navigation />);
    const signup = getByText("Sign Up");

    fireEvent.click(signup);
    expect(getByLabelText("Email")).toBeDefined();
    expect(getByLabelText("Password")).toBeDefined();
    expect(getByPlaceholderText("Enter your email address")).toBeDefined();
    expect(getByPlaceholderText("Enter your password")).toBeDefined(); 
  });

  it("should show the log in dropdown", () => {
    const { getByText } = renderWithReduxAndRouter(<Navigation />);
    const login = getByText("Log In");
    
    fireEvent.click(login);
    expect(getByText("Sign in with Email")).toBeDefined();
    expect(getByText("Sign in with Twitter")).toBeDefined();
  });

  // it("should render Polls page", () => {
  //   const { getByText } = renderWithReduxAndRouter(<Navigation />);
  //   const pollsPage = getByText("Polls");

  //   wait(() => fireEvent.click(pollsPage));
  //   expect(getByText("Vote your answer and share it on Twitter. And you can also create your own answer if you're signed in. So make sure to sign in!")).toBeDefined();
  // });

  afterEach(cleanup);
});