import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Cell, Grid} from 'react-foundation';
import {Category, Data, Risk} from '../risk-selector/RiskSelector';

import {useAppSelector} from '../../utils/redux/hooks';
import {selectRiskSelection} from '../risk-selector/riskSelectorSlice';

import style from './Portfolio.module.scss';
import risks_levels from '../../local/risk_levels.json';

export function Portfolio(): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const risks: Risk = risks_levels;
  const riskSelected: Record<Category, Data> = risks[riskSelection || '0'];

  const [bonds, setBonds] = useState<string>('');
  const [largeCap, setLargeCap] = useState<string>('');
  const [midCap, setMidCap] = useState<string>('');
  const [foreign, setForeign] = useState<string>('');
  const [smallCap, setSmallCap] = useState<string>('');

  const [disabledRebalance, setDisabledRebalance] = useState<boolean>(true);

  const [diffBonds, setDiffBonds] = useState<[string, number]>([' ', 0]);
  const [diffLargeCap, setDiffLargeCap] = useState<[string, number]>([' ', 0]);
  const [diffMidCap, setDiffMidCap] = useState<[string, number]>([' ', 0]);
  const [diffForeign, setDiffForeign] = useState<[string, number]>([' ', 0]);
  const [diffSmallCap, setDiffSmallCap] = useState<[string, number]>([' ', 0]);

  const [newBonds, setNewBonds] = useState<string>(' ');
  const [newLargeCap, setNewLargeCap] = useState<string>(' ');
  const [newMidCap, setNewMidCap] = useState<string>(' ');
  const [newForeign, setNewForeign] = useState<string>(' ');
  const [newSmallCap, setNewSmallCap] = useState<string>(' ');

  const [message, setMessage] = useState<[boolean, string]>([false, '']);

  useEffect(() => {
    if (bonds && largeCap && midCap && foreign && smallCap) {
      setDisabledRebalance(false);
    } else {
      setDisabledRebalance(true);
    }
  }, [bonds, largeCap, midCap, foreign, smallCap]);

  const getMessage = (negativeArray: Data[], positiveArray: Data[]) => {
    let i = 0,
      j = 0;
    let currPosVal = positiveArray[0].value;
    let currNegVal = negativeArray[0].value;
    let message = '';
    while (i < positiveArray.length && j < negativeArray.length) {
      const sum = Math.round((currPosVal + currNegVal) * 100) / 100;
      if (sum > 0) {
        message += `• Transfer ${Math.abs(currNegVal)} from ${
          negativeArray[j].label
        } to ${positiveArray[i].label} \n`;
        j++;
        if (j < negativeArray.length) currNegVal = negativeArray[j].value;
        currPosVal = sum;
      } else if (sum < 0) {
        message += `• Transfer ${currPosVal} from ${negativeArray[j].label} to ${positiveArray[i].label} \n`;
        i++;
        if (i < positiveArray.length) currPosVal = positiveArray[i].value;
        currNegVal = sum;
      } else {
        message += `• Transfer ${currPosVal} from ${negativeArray[j].label} to ${positiveArray[i].label} \n`;
        i++;
        j++;
        if (i < positiveArray.length) currPosVal = positiveArray[i].value;
        if (j < negativeArray.length) currNegVal = negativeArray[j].value;
      }
    }
    return message;
  };

  function calculateTransfers(
    _bonds: number,
    _largeCap: number,
    _midCap: number,
    _foreign: number,
    _smallCap: number
  ) {
    const total =
      Math.round((_bonds + _largeCap + _midCap + _foreign + _smallCap) * 100) /
      100;

    setNewBonds(`${(total * riskSelected.bonds.value) / 100}`);
    setNewLargeCap(`${(total * riskSelected.large_cap.value) / 100}`);
    setNewMidCap(`${(total * riskSelected.mid_caps.value) / 100}`);
    setNewForeign(`${(total * riskSelected.foreign.value) / 100}`);
    setNewSmallCap(`${(total * riskSelected.small_cap.value) / 100}`);

    const diffB =
      Math.round(((total * riskSelected.bonds.value) / 100 - _bonds) * 100) /
      100;
    const diffL =
      Math.round(
        ((total * riskSelected.large_cap.value) / 100 - _largeCap) * 100
      ) / 100;
    const diffM =
      Math.round(
        ((total * riskSelected.mid_caps.value) / 100 - _midCap) * 100
      ) / 100;
    const diffF =
      Math.round(
        ((total * riskSelected.foreign.value) / 100 - _foreign) * 100
      ) / 100;
    const diffS =
      Math.round(
        ((total * riskSelected.small_cap.value) / 100 - _smallCap) * 100
      ) / 100;

    setDiffBonds([`${diffB < 0 ? '' : '+'}${diffB}`, diffB]);
    setDiffLargeCap([`${diffL < 0 ? '' : '+'}${diffL}`, diffL]);
    setDiffMidCap([`${diffM < 0 ? '' : '+'}${diffM}`, diffM]);
    setDiffForeign([`${diffF < 0 ? '' : '+'}${diffF}`, diffF]);
    setDiffSmallCap([`${diffS < 0 ? '' : '+'}${diffS}`, diffS]);

    const negativeArray: Data[] = [];
    const positiveArray: Data[] = [];
    [
      {label: 'Bonds', value: diffB},
      {label: 'Large Cap', value: diffL},
      {label: 'Mid Cap', value: diffM},
      {label: 'foreign', value: diffF},
      {label: 'Small Cap', value: diffS},
    ].forEach((data: Data) => {
      if (data.value === 0) return;
      if (data.value < 0) negativeArray.push(data);
      if (data.value > 0) positiveArray.push(data);
    });
    negativeArray.sort((a, b) => a.value - b.value);
    positiveArray.sort((a, b) => b.value - a.value);

    setMessage([false, getMessage(negativeArray, positiveArray)]);
  }

  const rebalance = () => {
    const _bonds = Number(bonds);
    const _largeCap = Number(largeCap);
    const _midCap = Number(midCap);
    const _foreign = Number(foreign);
    const _smallCap = Number(smallCap);
    if (
      isNaN(_bonds) ||
      isNaN(_largeCap) ||
      isNaN(_midCap) ||
      isNaN(_foreign) ||
      isNaN(_smallCap)
    ) {
      setMessage([
        true,
        'Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.',
      ]);
      return;
    }
    calculateTransfers(_bonds, _largeCap, _midCap, _foreign, _smallCap);
  };

  return (
    <div className={style.portfolioContainer}>
      <Grid className={style.gridContainer} centerAlign>
        <Cell small={12} className={style.label}>
          Personalized portfolio
        </Cell>
        <Cell small={12} medium={8} large={6} centerAlign>
          <p className={style.riskLabel}>Risk level {riskSelection}</p>
          <table className={style.riskTable}>
            <tbody>
              <tr>
                <th>Bonds</th>
                <th>Large Cap</th>
                <th>Mid Cap</th>
                <th>Foreign</th>
                <th>Small Cap</th>
              </tr>
              <tr>
                <td>{riskSelected.bonds.value}%</td>
                <td>{riskSelected.large_cap.value}%</td>
                <td>{riskSelected.mid_caps.value}%</td>
                <td>{riskSelected.foreign.value}%</td>
                <td>{riskSelected.small_cap.value}%</td>
              </tr>
            </tbody>
          </table>
          <Grid className={style.currentInvestmentContainer}>
            <Cell small={9} medium={10}>
              <p className={style.currentInvestmentLabel}>
                Please enter your current portfolio
              </p>
            </Cell>
            <Cell small={3} medium={2}>
              <Button isDisabled={disabledRebalance} onClick={rebalance}>
                Rebalance
              </Button>
            </Cell>
          </Grid>
          <Grid className={style.riskCalculatorContainer}>
            <Cell small={12} className={style.riskCalculatorInputLabels}>
              <Grid>
                <Cell small={4}>Current Amount</Cell>
                <Cell small={2}>Difference</Cell>
                <Cell small={2}>New Amount</Cell>
                <Cell small={4}>Recommended transfers</Cell>
              </Grid>
            </Cell>
            <Cell small={8} className={style.riskCalculatorMain}>
              <Grid>
                <Cell small={12}>
                  <Grid className={style.riskCalculatorRow}>
                    <Cell small={3}>Bonds $:</Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setBonds(event.target.value)
                        }
                        type="text"
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={diffBonds[0]}
                        className={`${
                          diffBonds[1] < 0 ? style.red : style.green
                        }`}
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={newBonds}
                        style={{color: 'blue'}}
                      />
                    </Cell>
                  </Grid>
                </Cell>
                <Cell small={12}>
                  <Grid className={style.riskCalculatorRow}>
                    <Cell small={3}>Large Cap $:</Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setLargeCap(event.target.value)
                        }
                        type="text"
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={diffLargeCap[0]}
                        className={`${
                          diffLargeCap[1] < 0 ? style.red : style.green
                        }`}
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={newLargeCap}
                        style={{color: 'blue'}}
                      />
                    </Cell>
                  </Grid>
                </Cell>
                <Cell small={12}>
                  <Grid className={style.riskCalculatorRow}>
                    <Cell small={3}>Mid Cap $:</Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setMidCap(event.target.value)
                        }
                        type="text"
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={diffMidCap[0]}
                        className={`${
                          diffMidCap[1] < 0 ? style.red : style.green
                        }`}
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={newMidCap}
                        style={{color: 'blue'}}
                      />
                    </Cell>
                  </Grid>
                </Cell>
                <Cell small={12}>
                  <Grid className={style.riskCalculatorRow}>
                    <Cell small={3}>Foreign $:</Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setForeign(event.target.value)
                        }
                        type="text"
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={diffForeign[0]}
                        className={`${
                          diffForeign[1] < 0 ? style.red : style.green
                        }`}
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={newForeign}
                        style={{color: 'blue'}}
                      />
                    </Cell>
                  </Grid>
                </Cell>
                <Cell small={12}>
                  <Grid className={style.riskCalculatorRow}>
                    <Cell small={3}>Small Cap $:</Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setSmallCap(event.target.value)
                        }
                        type="text"
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={diffSmallCap[0]}
                        className={`${
                          diffSmallCap[1] < 0 ? style.red : style.green
                        }`}
                      />
                    </Cell>
                    <Cell small={3} className={style.riskCalculatorInput}>
                      <input
                        disabled
                        type="text"
                        value={newSmallCap}
                        style={{color: 'blue'}}
                      />
                    </Cell>
                  </Grid>
                </Cell>
              </Grid>
            </Cell>
            <Cell small={4} className={style.riskCalculatorTransfer}>
              <div className={style.riskCalculatorTransferWrap}>
                <p className={`${message[0] ? style.red : ''}`}>{message[1]}</p>
              </div>
            </Cell>
          </Grid>
        </Cell>
      </Grid>
    </div>
  );
}
