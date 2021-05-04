import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GenericActionPayload} from '../../utils/redux';
import {RootState} from '../../utils/redux/store';

export interface RiskSelectorState {
  riskSelection?: string;
}

export type RiskSelectorAction = GenericActionPayload & {
  riskSelection: string;
};

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

export const {actions} = riskSelectorSlice;

export const selectRiskSelection = (state: RootState): string | undefined =>
  state.riskSelector.riskSelection;

export default riskSelectorSlice.reducer;
