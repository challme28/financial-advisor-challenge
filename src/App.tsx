import React, {useState} from 'react';
import {Grid} from 'react-foundation';

import style from './App.module.scss';

import {RiskSelector} from "./features/risk-selector/RiskSelector";

function App(): JSX.Element {
  const [step, setStep] = useState(0);
  return (
    <main className={style.app}>
      <Grid
        className={style.header}
        centerAlign
      >
        <h1>Financial Advisor</h1>
      </Grid>
      {step === 0 &&
      <RiskSelector continue={() => setStep(1)}/>
      }
    </main>
  );
}

export default App;
