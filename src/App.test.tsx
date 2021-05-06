import React from 'react';
import App from './App';
import {shallow} from 'enzyme';
import {RiskSelector} from './features/risk-selector/RiskSelector';
import {Portfolio} from './features/porfolio/Portfolio';

describe('App.tsx', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setStep with 0', () => {
    wrapper.find('button').props().onClick();
    expect(wrapper.find(RiskSelector)).toHaveLength(1);
  });

  it('calls setStep with 1', () => {
    wrapper.find(RiskSelector).props().continue();
    expect(wrapper.find(Portfolio)).toHaveLength(1);
  });
});
