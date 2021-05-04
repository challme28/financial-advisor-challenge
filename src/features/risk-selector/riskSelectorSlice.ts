import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface RiskSelectorState {
  riskSelection?: string;
}

export interface RiskSelectorAction {
  riskSelection: string;
}

const initialState: RiskSelectorState = {};

export const riskSelectorSlice = createSlice({
  name: 'riskSelector',
  initialState,
  reducers: {
    save: (
      state: RiskSelectorState,
      {payload}: PayloadAction<RiskSelectorAction>
    ) => {
      state.riskSelection = payload.riskSelection;
    },
  },
});

export const {save} = riskSelectorSlice.actions;

export const selectRiskSelection = (state: RootState): string | undefined =>
  state.riskSelector.riskSelection;

export default riskSelectorSlice.reducer;
