import React, {useEffect, useState} from 'react';
import {Button, Cell, Grid, Sizes} from 'react-foundation';
import PieSVG from './Pie/PieSVG';

import {useAppSelector} from '../../utils/redux/hooks';
import {useActions} from '../../utils/redux';
import {selectRiskSelection} from './riskSelectorSlice';
import {actions as riskSelectorActions} from './riskSelectorSlice';

import style from './RiskSelector.module.scss';
import risks_levels from '../../local/risk_levels.json';

export type Category = 'bonds' | 'largeCap' | 'midCap' | 'foreign' | 'smallCap';

export type Data = {
  label: string;
  value: number;
};

export type Risk = {
  [key: string]: Record<Category, Data>;
};

interface Props {
  continue: () => void;
}

export function RiskSelector(props: Props): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const {save} = useActions({...riskSelectorActions});
  const risks: Risk = risks_levels;
  const riskValues: Record<Category, Data>[] = Object.values(risks);
  const [data, setData] = useState<Data[]>();
  const [switchView, setSwitchView] = useState<boolean>(false);

  const width = 350,
    height = 350;
  const radius = Math.min(width, height) / 2;

  useEffect(() => {
    if (typeof riskSelection !== 'undefined') {
      setData(Object.values(risks[riskSelection]));
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
              onClick={() => save({riskSelection: `${i + 1}`})}
              key={i}
            >
              {i + 1}
            </li>
          ))}
        </ul>
      </div>
      <Grid className={style.tableContainer} centerAlign>
        {!switchView && (
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
              {riskValues.map((risk: Record<Category, Data>, i) => (
                <tr
                  className={
                    Number(riskSelection) === i + 1 ? style.selected : ''
                  }
                  key={i}
                >
                  <td>{i + 1}</td>
                  <td>{risk.bonds.value}</td>
                  <td>{risk.largeCap.value}</td>
                  <td>{risk.midCap.value}</td>
                  <td>{risk.foreign.value}</td>
                  <td>{risk.smallCap.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data && switchView && (
          <PieSVG
            data={data}
            width={width}
            height={height}
            innerRadius={70}
            outerRadius={radius}
          />
        )}
      </Grid>
      <Grid centerAlign className={style.buttons}>
        <Cell small={12} medium={6}>
          <Grid centerAlign>
            <Button
              isDisabled={!riskSelection}
              size={Sizes.LARGE}
              onClick={props.continue}
            >
              Continue
            </Button>
          </Grid>
        </Cell>
        <Cell small={12} medium={6} centerAlign>
          <Grid centerAlign>
            <Button
              isDisabled={!riskSelection}
              size={Sizes.LARGE}
              onClick={() => setSwitchView(!switchView)}
            >
              Switch view
            </Button>
          </Grid>
        </Cell>
      </Grid>
    </div>
  );
}
