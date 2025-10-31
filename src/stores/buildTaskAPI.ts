import axios from "axios";
import { defineStore } from "pinia";

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

// This store will handle the build

export const useBuildTaskAPI = defineStore("buildTaskAPI", {
  state: () => ({
    sigClient: axios.create({
      baseURL: "https://api.signaloid.io",
      headers: {
        Authorization: import.meta.env.VITE_SIGNALOID_API_KEY,
        "Content-Type": "application/json",
      },
    }),
    Code: null as string | null,
    Language: null as string | null,
    CoreID: null as string | null,
    buildPostResponse: null as any | null,
    buildId: null as string | null,
  }),
  getters: {
    getBuildId: (state) => state.buildId,
  },
  actions: {
    async buildRequest(buildRequest: SourceCodeBuildRequest) {
      console.log("Submitting the build to the API...");
      // let buildPostResponse: null as string | null;
      try {
        this.buildPostResponse = await this.sigClient.post(
          "/sourcecode/builds",
          buildRequest
        );
        if (this.buildPostResponse.data.BuildID) {
          console.log(
            `...build successfully created with ID: ${this.buildPostResponse.data.BuildID}`
          );
        }
        /*
         * response.data will contain the execution job response object
         */
      } catch (error) {
        console.error(error);
      }

      let buildID = this.buildPostResponse.data.BuildID;
      let buildStatus = "Accepted";

      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      console.log("Waiting for the task to finish...");
      while (![`Completed`, `Cancelled`, `Stopped`].includes(buildStatus)) {
        await delay(2000);
        try {
          const buildGetResponse = await this.sigClient.get(
            `/builds/${buildID}`
          );
          buildStatus = buildGetResponse.data.Status;
          if (this.buildPostResponse.data.BuildID) {
            console.log(`...build status : ${buildStatus}`);
          }
          /*
           * response.data will contain the task details
           */
        } catch (error) {
          console.error(error);
        }
      }

      console.log(`Build in terminal state : ${buildStatus}.`);

      console.log("Fetching build outputs...");
      let buildOutputsResponse;
      try {
        // get task data from API
        buildOutputsResponse = await this.sigClient.get(
          `/builds/${buildID}/outputs`
        );
        /*
         * response.data will contain the task outputs object
         */
        if (buildOutputsResponse.data.Build) {
          const outputStream = await axios.get(buildOutputsResponse.data.Build);
          console.log(`Build log: ${outputStream.data}`);
        }
      } catch (error) {
        // [TODO]: handle errors
      }
    },
  },
});
