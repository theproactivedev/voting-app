import React from 'react';
import PollChart from '../polls/PollChart';
import { checkComponentPropTypes } from '../../utils/utils';
import { render, cleanup } from 'react-testing-library';

describe("It should render PollChart", () => {
  afterEach(cleanup);

  it("PollChart should be present", () => {
    const props = {
      question: "What is your name?",
      options: ["Eirin", "Yuri", "Kim Tan"]
    };
    const component = render(<PollChart {...props} />);
    expect(component).toBeDefined();
  });

  it ("Should not throw a warning", () => {
    const expectedProps = {
      question: "What is your name?",
      options: ["Eirin", "Yuri", "Kim Tan"]
    };

    const propsErr = checkComponentPropTypes(PollChart, expectedProps);
    expect(propsErr).toBeUndefined();
  });
});
