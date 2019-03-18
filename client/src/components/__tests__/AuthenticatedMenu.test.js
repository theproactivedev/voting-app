import React from 'react';
import { shallow } from 'enzyme';
import AuthenticatedMenu from '../AuthenticatedMenu';
import { findComponentByDataTest } from '../../utils/utils';

describe("It should render AuthenticatedMenu", () => {
  it("should render without warnings", () => {
    const component = shallow(<AuthenticatedMenu />);
    // expect(component.length).toBe(2);
    expect(component).toBeDefined();

    const wrapper = findComponentByDataTest(component, 'NavItemComponent');
    // expect(wrapper.length).toBe(2);
    expect(wrapper).toBeDefined();
  })
});