import React from 'react';

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {save, selectRiskSelection} from "./riskSelectorSlice";

import style from './RiskSelector.module.scss';
import risks from "../../local/risk_levels.json";

interface Risk {
  bonds: number,
  largeCap: number,
  midCaps: number,
  foreign: number,
  smallCap: number,
}

export function RiskSelector(): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const dispatch = useAppDispatch();

  return (
    <div className={style.riskSelectorContainer}>
      <div className={style.headerLabels}>
        <p className={style.labelSelect}>
          Please select a risk level for your investment portfolio
        </p>
        <div className={style.levels}>
          <p>Low</p>
          <p>High</p>
        </div>
      </div>
      <div className={style.riskSelector}>
        <ul className={style.riskSelectorUl}>
          {new Array(10)
            .fill(0)
            .map((v, i: number) =>
              <li
                className={(riskSelection === i + 1) ? style.selected : ""}
                onClick={() => dispatch(save({riskSelection: i + 1}))}
              >
                {i + 1}
              </li>)}
        </ul>
      </div>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <tbody>
          <tr>
            <th>Risk</th>
            <th>Bonds %</th>
            <th>Large Cap %</th>
            <th>Mid Cap %</th>
            <th>Foreign %</th>
            <th>Small Cap %</th>
          </tr>
          {Object.values(risks).map((v: Risk, i: number) =>
            <tr className={(riskSelection === i + 1) ? style.selected : ""}>
              <td>{i + 1}</td>
              <td>{v.bonds}</td>
              <td>{v.largeCap}</td>
              <td>{v.midCaps}</td>
              <td>{v.foreign}</td>
              <td>{v.smallCap}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}