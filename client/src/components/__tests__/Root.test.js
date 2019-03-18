import React from 'react';
import { shallow } from 'enzyme';
import Root from '../Root';
import { checkComponentPropTypes } from '../../utils/utils';

describe("It should render Root", () => {
  it("should render component", () => {
    const component = shallow(<Root />);
    expect(component).toBeDefined();
  });

  it("should render without warnings", () => {
    const expectedProps = { store: {} };
    const propsErr = checkComponentPropTypes(Root, expectedProps);
    expect(propsErr).toBeUndefined();
  });
});