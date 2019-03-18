import React from 'react';
import VotingForm from '../VotingForm';
import { cleanup } from 'react-testing-library';
import { renderWithRedux } from '../../utils/utils';

describe("it should render voting form", () => {
  afterEach(cleanup);
  const props = {
    user: { twitter: { username: "" }, local: {} },
    author: "eiringonzales",
    deletePoll: () => {},
    tweetPoll: () => {},
    query: "What's your favorite food?",
    options: ["Pasta", "Crispy Fried Pork", "Boiled beef broth"]
  };

  it("should render with props", () => {
    
    const { container, getByText } = renderWithRedux(<VotingForm {...props} />);
    expect(container).toBeDefined();
    expect(getByLabelText(props.query)).toBeTruthy();
  });
});