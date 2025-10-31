import { useBuildTaskAPI } from "../stores/buildTaskAPI";

type SourceCodeBuildRequest = {
  Code: string;
  Language: "C" | "C++" | "Fortran";
  // Optional
  CoreID?: string; // Using lowest precision C0 Athens core if not specified
  TraceVariables?: TraceVariableRequest[]; // Used to trace variables on Reference core runs
  DataSources?: DataSource[]; // Setting optional default data source for tasks started from this build
  Arguments?: string; // Setting optional default arguments for tasks started from this build
};

type DataSource = {
  ResourceID: string;
  ResourceType: "Gateway" | "Bucket" | "SignaloidCloudStorage";
  Location: string;
};

type TraceVariableRequest = {
  File: string;
  LineNumber: number;
  Expression: string;
};

export function useCreateBuild() {
  const sigBuildAPI = useBuildTaskAPI();
  const coreID = "cor_b21e4de9927158c1a5b603c2affb8a09";

  const buildTask = (
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
`;

    const applicationArguments = `${amount} ${minValue} ${maxValue}`;

    const buildRequest: SourceCodeBuildRequest = {
      Code: code,
      Language: "C",
      Arguments: applicationArguments,
      CoreID: coreID,
    };

    sigBuildAPI.buildRequest(buildRequest);
  };

  return {
    buildTask,
  };
}
