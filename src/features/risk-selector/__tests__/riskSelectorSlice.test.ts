import reducer, {actions} from '../riskSelectorSlice';

describe('riskSelectorSlice', () => {
  const expectedAction = {riskSelection: '2'};

  test('risk selection is saved', () => {
    const slice = reducer(
      {riskSelection: undefined},
      actions.save(expectedAction)
    );
    expect(slice).toStrictEqual(expectedAction);
  });
});
