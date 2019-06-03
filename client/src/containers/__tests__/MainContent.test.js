import React from "react";
import { renderWithReduxAndRouter } from "../../utils/utils";
import MainContent from "../MainContent";
import { render, cleanup, fireEvent } from "react-testing-library";

describe("Test each route", () => {
  afterEach(cleanup);

  it("should render home page", () => {
    const route = "/"
    const { container, getByText } = renderWithReduxAndRouter(<MainContent />, { route });
    expect(getByText("Build a Voting App")).toBeTruthy();
  });

  // it("should render polls page", () => {
  //   const route = "/polls"
  //   const { container, getByText } = renderWithReduxAndRouter(<MainContent />, { route });
  //   expect(getByText("Polls")).toBeTruthy();
  // });

  // it("should render home page", () => {
  //   const route = "/"
  //   const { container, getByText } = renderWithReduxAndRouter(<MainContent />, { route });
  //   expect(getByText("Build a Voting App")).toBeTruthy();
  // });
});