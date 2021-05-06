import React from 'react';
import style from '../App.module.scss';
import home from '../assets/image/home.png';
import {Grid} from 'react-foundation';
import {RiskSelector} from './risk-selector/RiskSelector';
import {Portfolio} from './porfolio/Portfolio';

export default function Dummy(): JSX.Element {
  const [step, setStep] = React.useState(0);

  return (
    <main className={style.app}>
      <Grid className={style.header} centerAlign>
        <button
          id="home-button"
          className={style.headerHomeBtn}
          onClick={() => setStep(0)}
        >
          <img className={style.headerHome} src={home} alt="home button" />
        </button>
        <h1>Financial Advisor</h1>
      </Grid>
      {step === 0 && <RiskSelector continue={() => setStep(1)} />}
      {step === 1 && <Portfolio />}
    </main>
  );
}
