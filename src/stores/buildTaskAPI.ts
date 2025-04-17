import axios from 'axios'
import { defineStore } from 'pinia'

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

export const useBuildTaskAPI = defineStore('buildTaskAPI', {
    state: () => ({
      sigClient: axios.create({
        baseURL: 'https://api.signaloid.io',
        headers: {
          Authorization: import.meta.env.VITE_SIGNALOID_API_KEY,
          'Content-Type': 'application/json'
        }
      }),
      Code: null as string | null,
      Language: null as string | null,
      CoreID: null as string | null,
    }),
    getters: {
 
    },
    actions: {}
});