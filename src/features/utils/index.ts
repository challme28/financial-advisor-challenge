import {Data} from '../risk-selector/RiskSelector';

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
