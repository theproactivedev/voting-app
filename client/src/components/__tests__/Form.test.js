import React from 'react';
import Form from '../polls/Form';
import { checkComponentPropTypes } from '../../utils/utils';
import { render } from 'react-testing-library';

describe("It should render form", () => {
  it("should be present", () => {
    const component = render(<Form />);
    expect(component).toBeDefined();
  });

  it("should not throw a warning", () => {
    const expectedProps = {
      handleSubmit: () => {},
      handleOptionsChange: () => {},
      handleQuestionChange: () => {}
    };

    const propsErr = checkComponentPropTypes(Form, expectedProps);
    expect(propsErr).toBeUndefined();
  })
});