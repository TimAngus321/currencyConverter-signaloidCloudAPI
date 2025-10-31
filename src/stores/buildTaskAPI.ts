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
      baseURL: "/api",
      headers: {
        Authorization: import.meta.env.VITE_SIGNALOID_API_KEY,
        "Content-Type": "application/json",
      },
    }),
    Code: null as string | null,
    Language: null as string | null,
    CoreID: null as string | null,
    buildId: null as string | null,
    taskId: null as string | null,
    taskOutputRes: null as string | null,
    plotURL: null as string | null,
  }),
  getters: {
    getBuildId: (state) => state.buildId,
    getTaskOutputRes: (state) => state.taskOutputRes,
    getPlotURL: (state) => state.plotURL,
  },
  actions: {
    async buildRequest(buildRequest: SourceCodeBuildRequest) {
      console.log("Submitting the build to the API...");
      let buildPostResponse: any | undefined;
      try {
        buildPostResponse = await this.sigClient.post(
          "/sourcecode/builds",
          buildRequest
        );
        if (buildPostResponse.data.BuildID) {
          console.log(
            `...build successfully created with ID: ${buildPostResponse.data.BuildID}`
          );
        }
        /*
         * response.data will contain the execution job response object
         */
      } catch (error) {
        console.error(error);
      }

      let buildID = buildPostResponse.data.BuildID;
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
          if (buildPostResponse.data.BuildID) {
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
        console.log("Build outputs response:", buildOutputsResponse.data);
        /*
         * response.data will contain the task outputs object
         */
        if (buildOutputsResponse.data.Build) {
          const outputStream = await axios.get(buildOutputsResponse.data.Build);
          console.log(`Build log: ${outputStream.data}`);
        } else {
          console.log("No Build property in response");
        }
      } catch (error) {
        console.error("Error fetching build outputs:", error);
      }

      console.log("Submitting the task to the API...");
      let taskPostResponse;
      try {
        taskPostResponse = await this.sigClient.post(`builds/${buildID}/tasks`);
        if (taskPostResponse.data.TaskID) {
          console.log(
            `...task successfully created with ID: ${taskPostResponse.data.TaskID}`
          );
        }
        /*
         * response.data will contain the execution job response object
         */
      } catch (error) {
        console.error(error);
      }

      let taskID = taskPostResponse?.data.TaskID;
      let taskStatus = taskPostResponse?.data.Status;

      console.log("Waiting for the task to finish...");
      while (![`Completed`, `Cancelled`, `Stopped`].includes(taskStatus)) {
        await delay(2000);
        try {
          const taskGetResponse = await this.sigClient.get(`/tasks/${taskID}`);
          taskStatus = taskGetResponse.data.Status;
          if (taskPostResponse?.data.TaskID) {
            console.log(`...task status : ${taskStatus}`);
          }
          /*
           * response.data will contain the task details
           */
        } catch (error) {
          console.error(error);
        }
      }

      console.log(`Task in terminal state : ${taskStatus}.`);

      console.log("Fetching task outputs...");
      let taskOutputsResponse;
      try {
        // get task data from API
        taskOutputsResponse = await this.sigClient.get(
          `/tasks/${taskID}/outputs?sanitized=false`
        );
        /*
         * response.data will contain the task outputs object
         */
        if (taskOutputsResponse.data.Stdout) {
          const outputStreamStdout = await axios.get(
            taskOutputsResponse.data.Stdout
          );
          console.log(`Task Stdout: ${outputStreamStdout.data}`);
          this.taskOutputRes = String(outputStreamStdout.data);
          
          // Generate plot from the output
          await this.generatePlot();
        }
        if (taskOutputsResponse.data.Stderr) {
          const outputStreamStderr = await axios.get(
            taskOutputsResponse.data.Stderr
          );
          console.log(`Task Stderr: ${outputStreamStderr.data}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async generatePlot() {
      try {
        if (!this.taskOutputRes) {
          throw new Error('Cannot plot empty stdout');
        }
        const payload = "Ux" + this.taskOutputRes.split("Ux")[1];
        const plotResponse = await this.sigClient.post('/plot', { payload: payload });
        const plotURL = plotResponse.data.presignedURL as string;
        console.log('Plot URL: ', plotURL);
        this.plotURL = plotURL;
      } catch (error) {
        console.error('Failed to generate plot:', error);
      }
    },
    async checkTaskStatus() {
      try {
        if (!this.taskId) {
          throw new Error('No task ID available');
        }
        
        const taskOutputsResponse = await this.sigClient.get(
          `/tasks/${this.taskId}/outputs?sanitized=false`
        );
        
        if (taskOutputsResponse.data.Stdout) {
          const outputStreamStdout = await axios.get(
            taskOutputsResponse.data.Stdout
          );
          this.taskOutputRes = String(outputStreamStdout.data);
          
          // Generate plot from the output
          await this.generatePlot();
        }
      } catch (error) {
        console.error('Failed to check task status:', error);
      }
    },
  },
});
