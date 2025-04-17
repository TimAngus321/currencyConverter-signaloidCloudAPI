// Clean up pinia store by adding functions here and using them in the store
// Use Pinia for state stuff and this for logic

import { useSignaloidAPIStore } from '../stores/signaloidAPI'

type SourceCodeTaskRequest = {
  Type: 'SourceCode'
  SourceCode: {
    Object: 'SourceCode'
    Code: string
    Arguments: string
    Language: 'C' | 'C++'
  }
  Overrides?: {
    Core?: string
  }
}

// Update this to use buildTaskAPI
export const useSigAPIComposable = () => {
  const sigAPI = useSignaloidAPIStore()

  const coreID = 'cor_b21e4de9927158c1a5b603c2affb8a09'

  const prepCreateTask = (
    amount: number | null,
    minValue: number | null,
    maxValue: number | null
  ) => {

    const code: string = `
#include <stdio.h>
#include <stdlib.h>
#include <uxhw.h>

int main(int argc, char *argv[])
{
	double amount;
	double minConversionRate;
	double maxConversionRate;
	double conversionRate;
	double convertedAmount;

	/*
	 *	Parse arguments
	 */
	if (argc < 3) {
		fprintf(stderr, "Usage: amount minConversion maxConversion\\n");
		return 1;
	}

	amount = atof(argv[1]);
	minConversionRate = atof(argv[2]);
	maxConversionRate = atof(argv[3]);

	/*
	 *	Convert currency
	 */
	conversionRate = UxHwDoubleUniformDist(minConversionRate, maxConversionRate);
	convertedAmount = amount * conversionRate;


	/*
	 *	Print result
	 */
	printf("%lf\\n", convertedAmount);
	return 0;
}
`
    const applicationArguments = `${amount} ${minValue} ${maxValue}`;

    const taskRequest: SourceCodeTaskRequest = {
      Type: 'SourceCode',
      SourceCode: {
        Object: 'SourceCode',
        Code: code,
        Arguments: applicationArguments,
        Language: 'C'
      },
      Overrides: {
        Core: coreID
      }
    }
    
    sigAPI.createTask(taskRequest)
  }

  return {
    prepCreateTask
  }
}

