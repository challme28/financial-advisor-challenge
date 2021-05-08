import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Cell, Grid} from 'react-foundation';
import {Category, Data, Risk} from '../risk-selector/RiskSelector';
import {
  calculateDiffPortfolio,
  calculateNewPortfolio,
  getMessage,
  sortPortfolio,
  verifyUserPortfolio,
} from '../utils';

import {useAppSelector} from '../../utils/redux/hooks';
import {selectRiskSelection} from '../risk-selector/riskSelectorSlice';

import style from './Portfolio.module.scss';
import risks_levels from '../../local/risk_levels.json';

export function Portfolio(): JSX.Element {
  const riskSelection = useAppSelector(selectRiskSelection);
  const risks: Risk = risks_levels;
  const riskSelected: Record<Category, Data> = risks[riskSelection || '1'];

  const [userPortfolio, setUserPortfolio] = useState<Record<Category, string>>({
    bonds: '',
    largeCap: '',
    midCap: '',
    foreign: '',
    smallCap: '',
  });

  const [disabledRebalance, setDisabledRebalance] = useState<boolean>(true);

  const [diffPortfolio, setDiffPortfolio] = useState<
    Record<Category, [string, number]>
  >({
    bonds: [' ', 0],
    largeCap: [' ', 0],
    midCap: [' ', 0],
    foreign: [' ', 0],
    smallCap: [' ', 0],
  });

  const [newPortfolio, setNewPortfolio] = useState<Record<Category, string>>({
    bonds: ' ',
    largeCap: ' ',
    midCap: ' ',
    foreign: ' ',
    smallCap: ' ',
  });

  const [message, setMessage] = useState<[boolean, string]>([false, '']);

  const updateCategory = (e: ChangeEvent<HTMLInputElement>) =>
    setUserPortfolio({
      ...userPortfolio,
      [e.target.name]: e.target.value,
    });

  useEffect(() => {
    if (
      userPortfolio.bonds &&
      userPortfolio.largeCap &&
      userPortfolio.midCap &&
      userPortfolio.foreign &&
      userPortfolio.smallCap
    ) {
      setDisabledRebalance(false);
    } else {
      setDisabledRebalance(true);
    }
  }, [
    userPortfolio.bonds,
    userPortfolio.largeCap,
    userPortfolio.midCap,
    userPortfolio.foreign,
    userPortfolio.smallCap,
  ]);

  const rebalance = () => {
    const [failed, message, userPortfolioN] = verifyUserPortfolio(
      userPortfolio
    );
    setMessage([failed, message]);
    if (failed) return;

    const total =
      Math.round(
        (userPortfolioN.bonds +
          userPortfolioN.largeCap +
          userPortfolioN.midCap +
          userPortfolioN.foreign +
          userPortfolioN.smallCap) *
          100
      ) / 100;

    const diffPortfolio = calculateDiffPortfolio(
      total,
      userPortfolioN,
      riskSelected
    );
    setDiffPortfolio({
      bonds: diffPortfolio.bonds,
      largeCap: diffPortfolio.largeCap,
      midCap: diffPortfolio.midCap,
      foreign: diffPortfolio.foreign,
      smallCap: diffPortfolio.smallCap,
    });

    const newPortfolio = calculateNewPortfolio(total, riskSelected);
    setNewPortfolio({
      bonds: newPortfolio.bonds,
      largeCap: newPortfolio.largeCap,
      midCap: newPortfolio.midCap,
      foreign: newPortfolio.foreign,
      smallCap: newPortfolio.smallCap,
    });

    const {positiveArray, negativeArray} = sortPortfolio(
      diffPortfolio.bonds[1],
      diffPortfolio.largeCap[1],
      diffPortfolio.midCap[1],
      diffPortfolio.foreign[1],
      diffPortfolio.smallCap[1]
    );

    if (negativeArray.length && positiveArray.length) {
      setMessage([false, getMessage(negativeArray, positiveArray)]);
    }
  };

  const riskTable = (
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
          <td>{riskSelected.largeCap.value}%</td>
          <td>{riskSelected.midCap.value}%</td>
          <td>{riskSelected.foreign.value}%</td>
          <td>{riskSelected.smallCap.value}%</td>
        </tr>
      </tbody>
    </table>
  );

  const bondsRow = (
    <Grid className={style.riskCalculatorRow}>
      <Cell small={3}>Bonds $:</Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="setBonds" hidden>
          setBonds
        </label>
        <input
          id="setBonds"
          name="bonds"
          onChange={updateCategory}
          type="text"
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="diffBonds" hidden>
          diffBonds
        </label>
        <input
          id="diffBonds"
          disabled
          type="text"
          value={diffPortfolio.bonds[0]}
          className={`${diffPortfolio.bonds[1] < 0 ? style.red : style.green}`}
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <input
          disabled
          type="text"
          value={newPortfolio.bonds}
          className={style.blue}
        />
      </Cell>
    </Grid>
  );

  const largeCapRow = (
    <Grid className={style.riskCalculatorRow}>
      <Cell small={3}>Large Cap $:</Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="setLargeCap" hidden>
          setLargeCap
        </label>
        <input
          id="setLargeCap"
          name="largeCap"
          onChange={updateCategory}
          type="text"
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="diffLargeCap" hidden>
          diffLargeCap
        </label>
        <input
          id="diffLargeCap"
          disabled
          type="text"
          value={diffPortfolio.largeCap[0]}
          className={`${
            diffPortfolio.largeCap[1] < 0 ? style.red : style.green
          }`}
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <input
          disabled
          type="text"
          value={newPortfolio.largeCap}
          className={style.blue}
        />
      </Cell>
    </Grid>
  );

  const midCapRow = (
    <Grid className={style.riskCalculatorRow}>
      <Cell small={3}>Mid Cap $:</Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="setMidCap" hidden>
          setMidCap
        </label>
        <input
          id="setMidCap"
          name="midCap"
          onChange={updateCategory}
          type="text"
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="diffMidCap" hidden>
          diffMidCap
        </label>
        <input
          id="diffMidCap"
          disabled
          type="text"
          value={diffPortfolio.midCap[0]}
          className={`${diffPortfolio.midCap[1] < 0 ? style.red : style.green}`}
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <input
          disabled
          type="text"
          value={newPortfolio.midCap}
          className={style.blue}
        />
      </Cell>
    </Grid>
  );

  const foreignRow = (
    <Grid className={style.riskCalculatorRow}>
      <Cell small={3}>Foreign $:</Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="setForeign" hidden>
          setForeign
        </label>
        <input
          id="setForeign"
          name="foreign"
          onChange={updateCategory}
          type="text"
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="diffForeign" hidden>
          diffForeign
        </label>
        <input
          id="diffForeign"
          disabled
          type="text"
          value={diffPortfolio.foreign[0]}
          className={`${
            diffPortfolio.foreign[1] < 0 ? style.red : style.green
          }`}
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <input
          disabled
          type="text"
          value={newPortfolio.foreign}
          className={style.blue}
        />
      </Cell>
    </Grid>
  );

  const smallCapRow = (
    <Grid className={style.riskCalculatorRow}>
      <Cell small={3}>Small Cap $:</Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="setSmallCap" hidden>
          setSmallCap
        </label>
        <input
          id="setSmallCap"
          name="smallCap"
          onChange={updateCategory}
          type="text"
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <label htmlFor="diffSmallCap" hidden>
          diffSmallCap
        </label>
        <input
          id="diffSmallCap"
          disabled
          type="text"
          value={diffPortfolio.smallCap[0]}
          className={`${
            diffPortfolio.smallCap[1] < 0 ? style.red : style.green
          }`}
        />
      </Cell>
      <Cell small={3} className={style.riskCalculatorInput}>
        <input
          disabled
          type="text"
          value={newPortfolio.smallCap}
          className={style.blue}
        />
      </Cell>
    </Grid>
  );

  return (
    <div className={style.portfolioContainer}>
      <Grid className={style.gridContainer} centerAlign>
        <Cell small={12} className={style.label}>
          Personalized portfolio
        </Cell>
        <Cell small={12} medium={11} large={7} centerAlign>
          <p className={style.riskLabel}>Risk level {riskSelection}</p>
          {riskTable}
          <Grid className={style.currentInvestmentContainer}>
            <Cell medium={9}>
              <p className={style.currentInvestmentLabel}>
                Please enter your current portfolio
              </p>
            </Cell>
            <Cell medium={3}>
              <Button isDisabled={disabledRebalance} onClick={rebalance}>
                Rebalance
              </Button>
            </Cell>
          </Grid>
          <Grid className={style.riskCalculatorContainer}>
            <Cell small={12} className={style.riskCalculatorInputLabels}>
              <Grid>
                <Cell small={6} medium={4}>
                  Current Amount
                </Cell>
                <Cell small={3} medium={2}>
                  Difference
                </Cell>
                <Cell small={3} medium={2}>
                  New Amount
                </Cell>
                <Cell medium={4} hideOnlyFor="small">
                  Recommended transfers
                </Cell>
              </Grid>
            </Cell>
            <Cell small={12} medium={8} className={style.riskCalculatorMain}>
              <Grid>
                <Cell small={12}>{bondsRow}</Cell>
                <Cell small={12}>{largeCapRow}</Cell>
                <Cell small={12}>{midCapRow} </Cell>
                <Cell small={12}>{foreignRow} </Cell>
                <Cell small={12}>{smallCapRow} </Cell>
              </Grid>
            </Cell>
            <Cell
              hideOnlyFor="small"
              medium={4}
              className={style.riskCalculatorTransfer}
            >
              <div className={style.riskCalculatorTransferWrap}>
                <p
                  data-testid="message"
                  className={`${message[0] ? style.red : ''}`}
                >
                  {message[1]}
                </p>
              </div>
            </Cell>

            <Cell hideFor="medium" className={style.riskCalculatorInputLabels}>
              Recommended transfers
            </Cell>
            <Cell hideFor="medium" className={style.riskCalculatorTransfer}>
              <div className={style.riskCalculatorTransferWrap}>
                <p
                  data-testid="message"
                  className={`${message[0] ? style.red : ''}`}
                >
                  {message[1]}
                </p>
              </div>
            </Cell>
          </Grid>
        </Cell>
      </Grid>
    </div>
  );
}
