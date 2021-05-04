import React, {useState} from 'react';
import {Grid} from 'react-foundation';

import style from './App.module.scss';
import home from './assets/image/home.png';

import {RiskSelector} from "./features/risk-selector/RiskSelector";
import {Portfolio} from "./features/porfolio/Portfolio";

function App(): JSX.Element {
  const [step, setStep] = useState(0);
  return (
    <main className={style.app}>
      <Grid
        className={style.header}
        centerAlign
      >
        <button
          className={style.headerHomeBtn}
          onClick={() => setStep(0)}
        >
          <img
            className={style.headerHome}
            src={home}
            alt="home button"/>
        </button>
        <h1>Financial Advisor</h1>
      </Grid>
      {step === 0 &&
      <RiskSelector continue={() => setStep(1)}/>
      }
      {step === 1 &&
      <Portfolio reset={() => setStep(0)}/>}
    </main>
  );
}

export default App;
