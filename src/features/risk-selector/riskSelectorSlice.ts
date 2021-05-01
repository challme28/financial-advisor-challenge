import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface RiskSelectorState {
  riskSelection?: number;
}

export interface RiskSelectorAction {
  riskSelection: number,
}

const initialState: RiskSelectorState = {};

export const riskSelectorSlice = createSlice({
  name: 'riskSelector',
  initialState,
  reducers: {
    save: (state: RiskSelectorState, {payload}: PayloadAction<RiskSelectorAction>) => {
      state.riskSelection = payload.riskSelection;
    }
  }
})

export const { save } = riskSelectorSlice.actions;

export const selectRiskSelection = (state: RootState) => state.riskSelector.riskSelection;

export default riskSelectorSlice.reducer;