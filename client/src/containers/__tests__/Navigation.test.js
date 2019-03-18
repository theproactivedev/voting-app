import React from 'react';
import { shallow } from 'enzyme';
import Navigation from '../Navigation';
import { checkComponentPropTypes } from '../../utils/utils';
import { createMemoryHistory } from 'history';
import { renderIntoDocument, fireEvent, cleanup } from 'react-testing-library';


describe("it should render Navigation", () => {
  it("should render component", () => {
    const component = shallow(<Navigation />);
    expect(component).toBeDefined();
  });

  it("should render without warnings", () => {
    const expectedProps = {
      isUserAuthenticated: false,
      user: {},
      userModal: {}, 
      error: ""
    };
    const propsErr = checkComponentPropTypes(Navigation, expectedProps);
    expect(propsErr).toBeUndefined();
  });

  // it("should bring user to home page", () => {
  //   const { getByText } = renderIntoDocument(<Navigation />);
  //   const homePageAnchor = getByText("FCC Voting App");
  //   homePageAnchor.click();


  // });

  afterEach(cleanup);
});