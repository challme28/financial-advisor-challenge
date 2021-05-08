import React from 'react';
import {render, screen} from '@testing-library/react';
import {Portfolio} from '../Portfolio';
import * as reduxHooks from '../../../utils/redux/hooks';
import risk_levels from '../../../local/risk_levels.json';
import userEvent from '@testing-library/user-event';

describe('Portfolio', () => {
  describe('risk table w/o risk selection', () => {
    beforeEach(() => {
      jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation();
      render(<Portfolio />);
    });

    it('should have values', () => {
      const value = risk_levels['1'].bonds.value + '%';
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  describe('on risk level 5', () => {
    const {getComputedStyle} = window;
    window.getComputedStyle = (elt) => getComputedStyle(elt);

    beforeEach(() => {
      jest
        .spyOn(reduxHooks, 'useAppSelector')
        .mockImplementation((f) => f({riskSelector: {riskSelection: '5'}}));
      render(<Portfolio />);
    });

    it('should write portfolio values, rebalance and see transfer message', () => {
      expect(screen.getByTestId('message')).not.toHaveTextContent(/transfer/i);
      userEvent.type(screen.getByLabelText('setBonds'), '40.91');
      userEvent.type(screen.getByLabelText('setLargeCap'), '17.76');
      userEvent.type(screen.getByLabelText('setMidCap'), '60.12');
      userEvent.type(screen.getByLabelText('setForeign'), '39.32');
      userEvent.type(screen.getByLabelText('setSmallCap'), '10.27');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByTestId('message')).toHaveTextContent(/transfer/i);
    });

    it('should have no message when values are exact', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '40');
      userEvent.type(screen.getByLabelText('setLargeCap'), '20');
      userEvent.type(screen.getByLabelText('setMidCap'), '20');
      userEvent.type(screen.getByLabelText('setForeign'), '20');
      userEvent.type(screen.getByLabelText('setSmallCap'), '0');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      screen.debug(screen.getByTestId('message'));
      expect(screen.getByTestId('message')).toHaveTextContent('');
    });

    it('should see error message for non numeric or negatives numbers', () => {
      expect(screen.getByTestId('message')).not.toHaveTextContent(/transfer/i);
      userEvent.type(screen.getByLabelText('setBonds'), '-9');
      userEvent.type(screen.getByLabelText('setLargeCap'), '9');
      userEvent.type(screen.getByLabelText('setMidCap'), '9');
      userEvent.type(screen.getByLabelText('setForeign'), '9');
      userEvent.type(screen.getByLabelText('setSmallCap'), '9');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByTestId('message')).toHaveTextContent(/please use/i);
    });

    it('should see error message for missing values', () => {
      expect(screen.getByTestId('message')).not.toHaveTextContent(/transfer/i);
      userEvent.type(screen.getByLabelText('setBonds'), '');
      userEvent.type(screen.getByLabelText('setLargeCap'), '');
      userEvent.type(screen.getByLabelText('setMidCap'), '');
      userEvent.type(screen.getByLabelText('setForeign'), '');
      userEvent.type(screen.getByLabelText('setSmallCap'), '');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByTestId('message')).toHaveTextContent(/please use/i);
    });

    it('should have negative difference for Bonds', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '45');
      userEvent.type(screen.getByLabelText('setLargeCap'), '20');
      userEvent.type(screen.getByLabelText('setMidCap'), '20');
      userEvent.type(screen.getByLabelText('setForeign'), '20');
      userEvent.type(screen.getByLabelText('setSmallCap'), '0');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByLabelText('diffBonds')).toHaveValue('-3');
    });
    it('should have negative difference for Large Cap', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '40');
      userEvent.type(screen.getByLabelText('setLargeCap'), '25');
      userEvent.type(screen.getByLabelText('setMidCap'), '20');
      userEvent.type(screen.getByLabelText('setForeign'), '20');
      userEvent.type(screen.getByLabelText('setSmallCap'), '0');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByLabelText('diffLargeCap')).toHaveValue('-4');
    });
    it('should have negative difference for Mid Cap', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '40');
      userEvent.type(screen.getByLabelText('setLargeCap'), '20');
      userEvent.type(screen.getByLabelText('setMidCap'), '25');
      userEvent.type(screen.getByLabelText('setForeign'), '20');
      userEvent.type(screen.getByLabelText('setSmallCap'), '0');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByLabelText('diffMidCap')).toHaveValue('-4');
    });
    it('should have negative difference for Foreign', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '40');
      userEvent.type(screen.getByLabelText('setLargeCap'), '20');
      userEvent.type(screen.getByLabelText('setMidCap'), '20');
      userEvent.type(screen.getByLabelText('setForeign'), '25');
      userEvent.type(screen.getByLabelText('setSmallCap'), '0');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByLabelText('diffForeign')).toHaveValue('-4');
    });
    it('should have negative difference for Small Cap', () => {
      userEvent.type(screen.getByLabelText('setBonds'), '40');
      userEvent.type(screen.getByLabelText('setLargeCap'), '20');
      userEvent.type(screen.getByLabelText('setMidCap'), '20');
      userEvent.type(screen.getByLabelText('setForeign'), '20');
      userEvent.type(screen.getByLabelText('setSmallCap'), '5');
      userEvent.click(screen.getByRole('button', {name: /rebalance/i}));
      expect(screen.getByLabelText('diffSmallCap')).toHaveValue('-5');
    });
  });
});
