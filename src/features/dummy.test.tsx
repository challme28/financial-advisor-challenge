import {shallow} from 'enzyme';
import Dummy from './dummy';
import React from 'react';

describe('Dummy', () => {
  let wrapper: any;
  const setState = jest.fn();
  const useStateMock: any = (initState: any) => [initState, setState];

  beforeEach(() => {
    wrapper = shallow(<Dummy />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Home button clicked', () => {
    it('calls setStep with 0', () => {
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      console.log(wrapper.debug());
      wrapper.find('button').props().onClick();
      expect(setState).toHaveBeenCalled();
      expect(setState).toHaveBeenCalledWith(0);
    });
  });
});
