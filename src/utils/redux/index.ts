import {useDispatch} from 'react-redux';
import {useMemo} from 'react';
import {bindActionCreators} from 'redux';
import {Action} from '@reduxjs/toolkit';

export type GenericAction<T> = Action & {
  payload: T;
};

export type GenericActionPayload = {[key: string]: any};

export function useActions<T>(actions: T): T {
  const dispatch = useDispatch();
  return useMemo<T>(() => bindActionCreators(actions as any, dispatch) as any, [
    dispatch,
    actions,
  ]);
}
