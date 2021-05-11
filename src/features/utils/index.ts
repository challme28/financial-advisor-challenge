import {Category, Data} from '../risk-selector/RiskSelector';

export const getMessage = (
  negativeArray: Data[],
  positiveArray: Data[]
): string => {
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
      // if (j < negativeArray.length) currNegVal = negativeArray[j].value;
      currPosVal = sum;
    } else if (sum < 0) {
      message += `• Transfer ${currPosVal} from ${negativeArray[j].label} to ${positiveArray[i].label} \n`;
      i++;
      // if (i < positiveArray.length) currPosVal = positiveArray[i].value;
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

export const verifyUserPortfolio = (
  userPortfolio: Record<Category, string>
): [boolean, string, Record<Category, number>] => {
  const userPortfolioN = {
    bonds: Number(userPortfolio.bonds ? userPortfolio.bonds : undefined),
    largeCap: Number(
      userPortfolio.largeCap ? userPortfolio.largeCap : undefined
    ),
    midCap: Number(userPortfolio.midCap ? userPortfolio.midCap : undefined),
    foreign: Number(userPortfolio.foreign ? userPortfolio.foreign : undefined),
    smallCap: Number(
      userPortfolio.smallCap ? userPortfolio.smallCap : undefined
    ),
  };

  // Verify if portfolio's categories is a number and positive
  if (
    isNaN(userPortfolioN.bonds) ||
    userPortfolioN.bonds < 0 ||
    isNaN(userPortfolioN.largeCap) ||
    userPortfolioN.largeCap < 0 ||
    isNaN(userPortfolioN.midCap) ||
    userPortfolioN.midCap < 0 ||
    isNaN(userPortfolioN.foreign) ||
    userPortfolioN.foreign < 0 ||
    isNaN(userPortfolioN.smallCap) ||
    userPortfolioN.smallCap < 0
  ) {
    return [
      true,
      'Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.',
      userPortfolioN,
    ];
  } else {
    return [false, '', userPortfolioN];
  }
};

export const calculateNewPortfolio = (
  totalUserPortfolio: number,
  riskSelected: Record<Category, Data>
): Record<Category, string> => ({
  bonds: `${(totalUserPortfolio * riskSelected.bonds.value) / 100}`,
  largeCap: `${(totalUserPortfolio * riskSelected.largeCap.value) / 100}`,
  midCap: `${(totalUserPortfolio * riskSelected.midCap.value) / 100}`,
  foreign: `${(totalUserPortfolio * riskSelected.foreign.value) / 100}`,
  smallCap: `${(totalUserPortfolio * riskSelected.smallCap.value) / 100}`,
});

export const calculateDiffPortfolio = (
  totalUserPortfolio: number,
  userPortfolio: Record<string, number>,
  riskSelected: Record<Category, Data>
): Record<Category, [string, number]> => {
  const diffB =
    Math.round(
      ((totalUserPortfolio * riskSelected.bonds.value) / 100 -
        userPortfolio.bonds) *
        100
    ) / 100;
  const diffL =
    Math.round(
      ((totalUserPortfolio * riskSelected.largeCap.value) / 100 -
        userPortfolio.largeCap) *
        100
    ) / 100;
  const diffM =
    Math.round(
      ((totalUserPortfolio * riskSelected.midCap.value) / 100 -
        userPortfolio.midCap) *
        100
    ) / 100;
  const diffF =
    Math.round(
      ((totalUserPortfolio * riskSelected.foreign.value) / 100 -
        userPortfolio.foreign) *
        100
    ) / 100;
  const diffS =
    Math.round(
      ((totalUserPortfolio * riskSelected.smallCap.value) / 100 -
        userPortfolio.smallCap) *
        100
    ) / 100;

  // Return tuple for ui and data manipulation
  return {
    bonds: [`${diffB < 0 ? '' : '+'}${diffB}`, diffB],
    largeCap: [`${diffL < 0 ? '' : '+'}${diffL}`, diffL],
    midCap: [`${diffM < 0 ? '' : '+'}${diffM}`, diffM],
    foreign: [`${diffF < 0 ? '' : '+'}${diffF}`, diffF],
    smallCap: [`${diffS < 0 ? '' : '+'}${diffS}`, diffS],
  };
};

export const sortPortfolio = (
  diffBonds: number,
  diffLargeCap: number,
  diffMidCap: number,
  diffForeign: number,
  diffSmallCap: number
): Record<'positiveArray' | 'negativeArray', Data[]> => {
  const negativeArray: Data[] = [];
  const positiveArray: Data[] = [];
  // Divide portfolio in negative and positive values
  [
    {label: 'Bonds', value: diffBonds},
    {label: 'Large Cap', value: diffLargeCap},
    {label: 'Mid Cap', value: diffMidCap},
    {label: 'Foreign', value: diffForeign},
    {label: 'Small Cap', value: diffSmallCap},
  ].forEach((data: Data) => {
    if (data.value === 0) return;
    if (data.value < 0) negativeArray.push(data);
    if (data.value > 0) positiveArray.push(data);
  });
  negativeArray.sort((a, b) => a.value - b.value);
  positiveArray.sort((a, b) => b.value - a.value);

  return {
    positiveArray,
    negativeArray,
  };
};
