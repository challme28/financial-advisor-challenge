import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Cell, Grid} from 'react-foundation';
import {Risk} from '../risk-selector/RiskSelector';

import {useAppSelector} from '../../app/hooks';
import {selectRiskSelection} from '../risk-selector/riskSelectorSlice';

import style from './Portfolio.module.scss';
import risks_levels from '../../local/risk_levels.json';

interface Diff {
  key: string;
  value: number;
}

export function Portfolio(): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const risks: Record<string, Risk> = risks_levels;
  const riskSelected: Risk = risks[riskSelection || '0'];

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

  const [message, setMessage] = useState<[boolean, string]>([false, '']);

  const [newBonds, setNewBonds] = useState<string>(' ');
  const [newLargeCap, setNewLargeCap] = useState<string>(' ');
  const [newMidCap, setNewMidCap] = useState<string>(' ');
  const [newForeign, setNewForeign] = useState<string>(' ');
  const [newSmallCap, setNewSmallCap] = useState<string>(' ');

  useEffect(() => {
    if (bonds && largeCap && midCap && foreign && smallCap) {
      setDisabledRebalance(false);
    } else {
      setDisabledRebalance(true);
    }
  }, [bonds, largeCap, midCap, foreign, smallCap]);

  const getMessage = (negativeArray: Diff[], positiveArray: Diff[]) => {
    let i = 0,
      j = 0;
    let currPosVal = positiveArray[0].value;
    let currNegVal = negativeArray[0].value;
    let message = '';
    while (i < positiveArray.length && j < negativeArray.length) {
      const sum = Math.round((currPosVal + currNegVal) * 100) / 100;
      if (sum > 0) {
        message += `• Transfer ${Math.abs(currNegVal)} from ${
          negativeArray[j].key
        } to ${positiveArray[i].key} \n`;
        j++;
        if (j < negativeArray.length) currNegVal = negativeArray[j].value;
        currPosVal = sum;
      } else if (sum < 0) {
        message += `• Transfer ${currPosVal} from ${negativeArray[j].key} to ${positiveArray[i].key} \n`;
        i++;
        if (i < positiveArray.length) currPosVal = positiveArray[i].value;
        currNegVal = sum;
      } else {
        message += `• Transfer ${currPosVal} from ${negativeArray[j].key} to ${positiveArray[i].key} \n`;
        i++;
        j++;
        if (i < positiveArray.length) currPosVal = positiveArray[i].value;
        if (j < negativeArray.length) currNegVal = negativeArray[j].value;
      }
    }
    return message;
  };

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
        false,
        'Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.',
      ]);
      return;
    }
    const total =
      Math.round((_bonds + _largeCap + _midCap + _foreign + _smallCap) * 100) /
      100;

    setNewBonds(`${(total * riskSelected.Bonds) / 100}`);
    setNewLargeCap(`${(total * riskSelected['Large Cap']) / 100}`);
    setNewMidCap(`${(total * riskSelected['Mid Caps']) / 100}`);
    setNewForeign(`${(total * riskSelected.Foreign) / 100}`);
    setNewSmallCap(`${(total * riskSelected['Small Cap']) / 100}`);

    const diffB =
      Math.round(((total * riskSelected.Bonds) / 100 - Number(bonds)) * 100) /
      100;
    const diffL =
      Math.round(
        ((total * riskSelected['Large Cap']) / 100 - Number(largeCap)) * 100
      ) / 100;
    const diffM =
      Math.round(
        ((total * riskSelected['Mid Caps']) / 100 - Number(midCap)) * 100
      ) / 100;
    const diffF =
      Math.round(
        ((total * riskSelected.Foreign) / 100 - Number(foreign)) * 100
      ) / 100;
    const diffS =
      Math.round(
        ((total * riskSelected['Small Cap']) / 100 - Number(smallCap)) * 100
      ) / 100;

    setDiffBonds([`${diffB < 0 ? '' : '+'}${diffB}`, diffB]);
    setDiffLargeCap([`${diffL < 0 ? '' : '+'}${diffL}`, diffL]);
    setDiffMidCap([`${diffM < 0 ? '' : '+'}${diffM}`, diffM]);
    setDiffForeign([`${diffF < 0 ? '' : '+'}${diffF}`, diffF]);
    setDiffSmallCap([`${diffS < 0 ? '' : '+'}${diffS}`, diffS]);

    const negativeArray: Diff[] = [];
    const positiveArray: Diff[] = [];
    [
      {key: 'Bonds', value: diffB},
      {key: 'Large Cap', value: diffL},
      {key: 'Mid Cap', value: diffM},
      {key: 'foreign', value: diffF},
      {key: 'Small Cap', value: diffS},
    ].forEach((diff: Diff) => {
      if (diff.value === 0) return;
      if (diff.value < 0) negativeArray.push(diff);
      if (diff.value > 0) positiveArray.push(diff);
    });
    negativeArray.sort((a, b) => a.value - b.value);
    positiveArray.sort((a, b) => b.value - a.value);

    setMessage([false, getMessage(negativeArray, positiveArray)]);
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
                <td>{riskSelected.Bonds}%</td>
                <td>{riskSelected['Large Cap']}%</td>
                <td>{riskSelected['Mid Caps']}%</td>
                <td>{riskSelected.Foreign}%</td>
                <td>{riskSelected['Small Cap']}%</td>
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
