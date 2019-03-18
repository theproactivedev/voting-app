import React from 'react';
import { shallow } from 'enzyme';
import Form from '../polls/Form';
import { checkComponentPropTypes } from '../../utils/utils';

describe("It should render form", () => {
  it("should be present", () => {
    const component = shallow(<Form />);
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