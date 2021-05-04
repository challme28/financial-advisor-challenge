import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Dispatch} from 'react';

import type {RootState, AppDispatch} from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): Dispatch<AppDispatch> =>
  useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
