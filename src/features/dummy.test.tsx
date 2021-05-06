import {shallow} from 'enzyme';
import Dummy from './dummy';
import React from 'react';
import {RiskSelector} from './risk-selector/RiskSelector';
import {Portfolio} from './porfolio/Portfolio';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {store} from '../utils/redux/store';
import App from '../App';

test('renders learn react link', () => {
  const {getByText} = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/Financial Advisor/i)).toBeInTheDocument();
});

describe('Dummy', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Dummy />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Home button clicked', () => {
    it('calls setStep with 0', () => {
      wrapper.find('button').simulate('click');
      expect(wrapper.find(RiskSelector)).toHaveLength(1);
    });

    it('calls setStep with 1', () => {
      wrapper.find(RiskSelector).invoke('continue')();
      expect(wrapper.find(Portfolio)).toHaveLength(1);
    });
  });
});
