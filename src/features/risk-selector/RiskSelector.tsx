import React, {useEffect, useState} from 'react';
import {Button, Cell, Grid, Sizes} from 'react-foundation';
import PieSVG from './Pie/PieSVG';

import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {save, selectRiskSelection} from './riskSelectorSlice';

import style from './RiskSelector.module.scss';
import risks_levels from '../../local/risk_levels.json';

export interface Risk {
  Bonds: number;
  'Large Cap': number;
  'Mid Caps': number;
  Foreign: number;
  'Small Cap': number;
}

export interface Data {
  label: string;
  value: number;
}

interface Props {
  continue: () => void;
}

export function RiskSelector(props: Props): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const dispatch = useAppDispatch();
  const risksValues = Object.values(risks_levels);
  const risks: Record<string, Record<string, number>> = risks_levels;
  const [data, setData] = useState<Data[]>();

  const width = 450,
    height = 450,
    margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  useEffect(() => {
    if (typeof riskSelection !== 'undefined') {
      setData(
        Object.keys(risks[riskSelection]).map((k: string) => ({
          label: k,
          value: risks[riskSelection][k],
        }))
      );
    }
  }, [riskSelection, risks]);

  return (
    <div className={style.riskSelectorContainer}>
      <Grid className={style.headerLabels} centerAlign>
        <Cell small={12}>
          <p className={style.labelSelect}>
            Please select a risk level for your investment portfolio
          </p>
        </Cell>
        <Grid className={style.levels}>
          <Cell className={style.low} small={6}>
            Low
          </Cell>
          <Cell className={style.high} small={6}>
            High
          </Cell>
        </Grid>
      </Grid>
      <div className={style.riskSelector}>
        <ul className={style.riskSelectorUl}>
          {new Array(10).fill(0).map((v, i: number) => (
            <li
              className={Number(riskSelection) === i + 1 ? style.selected : ''}
              onClick={() => dispatch(save({riskSelection: `${i + 1}`}))}
              key={i}
            >
              {i + 1}
            </li>
          ))}
        </ul>
      </div>
      <Grid className={style.tableContainer} centerAlign>
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
            {risksValues.map((risk: Risk, i: number) => (
              <tr
                className={
                  Number(riskSelection) === i + 1 ? style.selected : ''
                }
                key={i}
              >
                <td>{i + 1}</td>
                <td>{risk.Bonds}</td>
                <td>{risk['Large Cap']}</td>
                <td>{risk['Mid Caps']}</td>
                <td>{risk.Foreign}</td>
                <td>{risk['Small Cap']}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && (
          <PieSVG
            data={data}
            width={width}
            height={height}
            innerRadius={100}
            outerRadius={radius}
          />
        )}
      </Grid>
      <Grid centerAlign>
        <Button
          isDisabled={!riskSelection}
          size={Sizes.LARGE}
          onClick={props.continue}
        >
          Continue
        </Button>
      </Grid>
    </div>
  );
}
