import {configureStore} from '@reduxjs/toolkit';
import riskSelectorReducer from '../features/risk-selector/riskSelectorSlice';

export const store = configureStore({
  reducer: {
    riskSelector: riskSelectorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
