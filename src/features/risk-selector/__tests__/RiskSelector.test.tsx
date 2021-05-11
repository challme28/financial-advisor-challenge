import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from 'react-redux';
import {RiskSelector} from '../RiskSelector';
import {store} from '../../../utils/redux/store';

describe('RiskSelector', () => {
  describe('something', () => {
    const continueSpy = jest.fn();

    beforeEach(() => {
      const {getComputedStyle} = window;
      window.getComputedStyle = (elt) => getComputedStyle(elt);
      render(
        <Provider store={store}>
          <RiskSelector continue={continueSpy} />
        </Provider>
      );
    });

    it('should select risk', () => {
      userEvent.click(screen.getAllByRole('listitem')[4]);
      expect(screen.getAllByRole('listitem')[4]).toHaveClass('selected');
    });

    it('should switch views', () => {
      userEvent.click(screen.getAllByRole('listitem')[4]);
      expect(screen.getByRole('table')).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', {name: /switch/i}));
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should continue', () => {
      userEvent.click(screen.getByRole('button', {name: /continue/i}));
      expect(continueSpy).toHaveBeenCalled();
    });
  });
});
