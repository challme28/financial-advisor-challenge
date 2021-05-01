import React from 'react';
import style from './App.module.scss';

import {RiskSelector} from "./features/risk-selector/RiskSelector";

function App(): JSX.Element {
  return (
    <main className={style.app}>
      <header className={style.header}>
        <h1>Financial Advisor</h1>
      </header>
      <RiskSelector />
    </main>
  );
}

export default App;
