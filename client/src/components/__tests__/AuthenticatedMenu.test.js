import React from "react";
import AuthenticatedMenu from "../AuthenticatedMenu";
import { render } from "react-testing-library";
import { renderWithRouter } from "../../utils/utils";

describe("It should render AuthenticatedMenu", () => {
  it("should render without warnings", () => {
    const { container, getByTestId, getByText } = renderWithRouter(<AuthenticatedMenu active={false} />);
    expect(getByText("My Polls")).toBeDefined();
    expect(getByText("New Poll")).toBeDefined();
  })
});