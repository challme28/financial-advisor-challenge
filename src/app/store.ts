import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import riskSelectorReducer from '../features/risk-selector/riskSelectorSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    riskSelector: riskSelectorReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
