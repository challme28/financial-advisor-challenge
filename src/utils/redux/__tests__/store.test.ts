import {actions as riskSelectorActions} from '../../../features/risk-selector/riskSelectorSlice';
import {store} from '../store';

describe('utils/store', () => {
  describe('store', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should reduce', () => {
      const expectedState = {riskSelector: {riskSelection: '1'}};
      const {save} = riskSelectorActions;
      store.dispatch(save({riskSelection: '1'}));
      expect(store.getState()).toStrictEqual(expectedState);
    });
  });
});
