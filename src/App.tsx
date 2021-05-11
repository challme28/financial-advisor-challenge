import React, {useState} from 'react';

import style from './App.module.scss';
import home from './assets/image/home.png';

import {RiskSelector} from './features/risk-selector/RiskSelector';
import {Portfolio} from './features/porfolio/Portfolio';

function App(): JSX.Element {
  const [step, setStep] = useState(0);
  return (
    <main className={style.app}>
      <div className={style.header}>
        <button className={style.headerHomeBtn} onClick={() => setStep(0)}>
          <img className={style.headerHome} src={home} alt="home button" />
        </button>
        <h1>Financial Advisor</h1>
      </div>
      {step === 0 && <RiskSelector continue={() => setStep(1)} />}
      {step === 1 && <Portfolio />}
    </main>
  );
}

export default App;
