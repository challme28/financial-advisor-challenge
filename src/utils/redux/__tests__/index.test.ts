import React from 'react';
import * as reactRedux from 'react-redux';
import * as redux from 'redux';

import {GenericAction, GenericActionPayload, useActions} from '../index';

describe('utils/redux', () => {
  describe('useActions', () => {
    beforeEach(() => {
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => (actions: any) => actions);
      jest.spyOn(React, 'useMemo').mockImplementation((fn) => fn());
      jest
        .spyOn(redux, 'bindActionCreators')
        .mockImplementation((actions) => actions);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
      const expectedAction = {
        type: 'test/action',
        payload: {foo: 'bar'},
      };
      const fooActionCreator = (): GenericAction<GenericActionPayload> =>
        expectedAction;
      const {foo} = useActions({foo: fooActionCreator});
      expect(foo()).toBe(expectedAction);
    });
  });
});
