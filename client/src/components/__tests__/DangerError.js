import React from 'react';
import { shallow } from 'enzyme';
import DangerError from '../DangerError';
import { checkComponentPropTypes } from '../../utils/utils';

describe("It should render AuthenticatedMenu", () => {
  it("should render component", () => {
    const component = shallow(<DangerError />);
    // expect(component.length).toBe(2);
    expect(component).toBeDefined();
  });

  it("should render without warnings", () => {
    const expectedProps = { msg: "There's an error." };
    const propsErr = checkComponentPropTypes(DangerError, expectedProps);
    expect(propsErr).toBeUndefined();
  });
});