import React from "react";
import VotingForm from "../VotingForm";
import { cleanup, fireEvent } from "react-testing-library";
import { renderWithRedux } from "../../utils/utils";

describe("it should render voting form", () => {
  afterEach(cleanup);
  const props = {
    user: { twitter: { username: "" }, local: {} },
    author: "eiringonzales",
    deletePoll: () => {},
    tweetPoll: () => {},
    query: "What's your favorite food?",
    // options: ["Pasta", "Crispy Fried Pork", "Boiled beef broth"]
    options: [
      <option key={1} value={"Pasta"}>Pasta</option>,
      <option key={2} value={"Crispy Fried Pork"}>Crispy Fried Pork</option>,
      <option key={3} value={"Boiled beef broth"}>Boiled beef broth</option>
    ]
  };

  it("should render with props", () => {
    const { container, getByLabelText } = renderWithRedux(<VotingForm {...props} />);
    expect(container).toBeDefined();
    expect(getByLabelText(props.query)).toBeTruthy();
  });

  it("should submit a vote", () => {
    const { getByTestId, getByDisplayValue, getByText } = renderWithRedux(<VotingForm {...props} />);
    const selectInput = getByTestId("optionsSelect");
    // selectInput.value = "Pasta";
    // Simulate.change(selectInput);

    fireEvent.change(selectInput, { target: { value : "Pasta" } });
    // fireEvent.change(selectInput);

    expect(selectInput).toMatchObject(getByDisplayValue("Pasta"));
  });
});