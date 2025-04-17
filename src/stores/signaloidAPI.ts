import axios from 'axios'
import { defineStore } from 'pinia'

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

export const TaskStatus = {
  Initialising: 'Initialising',
  Accepted: 'Accepted',
  Building: 'Building',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Stopped: 'Stopped'
} as const

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus]

export const useSignaloidAPIStore = defineStore('signaloidAPI', {
  state: () => ({
    sigClient: axios.create({
      baseURL: 'https://api.signaloid.io',
      headers: {
        Authorization: import.meta.env.VITE_SIGNALOID_API_KEY,
        'Content-Type': 'application/json'
      }
    }),
    taskOutputRes: null as string | null,
    activeTaskID: null as string | null,
    plotURL: null as string | null,
    activeTaskStatus: null as TaskStatusType | null
  }),
  getters: {
    getTaskOutputRes: (state) => state.taskOutputRes,
    getTaskID: (state) => state.activeTaskID,
    getTaskStatus: (state) => state.activeTaskStatus
  },
  actions: {
    // This unholy monstrosity needs to be split up and cleaned up.
    // Remember to store resuts as state so I can use the getter to pull it wherever
    async createTask(taskRequest: SourceCodeTaskRequest) {
      console.log('Submitting the task to the API...')
      // clear taskOutputRes for each new request
      this.taskOutputRes = {}
      let taskPostResponse: any | undefined
      try {
        taskPostResponse = await this.sigClient.post('/tasks', taskRequest)
        if (!taskPostResponse.data.TaskID) {
          throw new Error('Task was not created successfully')
        }
        console.log(`...task successfully created with ID: ${taskPostResponse.data.TaskID}`)
        console.log(`all task response data: ${JSON.stringify(taskPostResponse.data, null, 2)}`)

        this.activeTaskID = taskPostResponse.data.TaskID
        this.activeTaskStatus = taskPostResponse.data.Status

        await this.pollActiveTaskStatus()
        if (this.activeTaskStatus !== 'Completed') {
          throw new Error(`Task did not end successfully with status ${this.activeTaskStatus}`)
        }
        await this.getStdoutResponse();
        await this.getStdoutPlotFromResult();
      } catch (error) {
        console.error(`create source code task err `, error)
      }
    },

    async pollActiveTaskStatus() {
      try {
        if (!this.activeTaskID) {
          return
        }
        const taskID = this.activeTaskID
        const taskGetResponse = await this.sigClient.get(`/tasks/${taskID}`)
        const taskStatus = taskGetResponse.data.Status
        this.activeTaskStatus = taskStatus as TaskStatusType
        const delay = (ms: any) => new Promise((res) => setTimeout(res, ms))
        while (![`Completed`, `Cancelled`, `Stopped`].includes(this.activeTaskStatus)) {
          await delay(2000)
          const taskGetResponse = await this.sigClient.get(`/tasks/${taskID}`)
          const taskStatus = taskGetResponse.data.Status
          this.activeTaskStatus = taskStatus as TaskStatusType
          console.log(`...task status : ${taskStatus}`)
        }
      } catch (error) {
        console.error('Failed to poll task status', error)
        throw error
      }
    },
    async getStdoutResponse() {
      try {
        const taskID = this.activeTaskID
        const taskOutputsResponse = await this.sigClient.get(
          `/tasks/${taskID}/outputs?sanitized=false`
        )
        console.log(`/tasks/${taskID}/outputs?sanitized=false`)
        const outputStream = await axios.get(taskOutputsResponse.data.Stdout)
        const stdOut = outputStream.data
        this.taskOutputRes = String(stdOut)
        console.log('Task Outputs stdOut:', stdOut)
      } catch (error) {
        console.error('Failed to get task response', error)
        throw error
      }
    },
    async getStdoutPlotFromResult() {
      try {
        if (!this.taskOutputRes) {
          throw new Error('Cannot plot empty stdout')
        }
        const payload = "Ux" + this.taskOutputRes.split("Ux")[1];
        const plotResponse = await this.sigClient.post('/plot', { payload: payload })
        const plotURL = plotResponse.data.presignedURL as string
        console.log('Plot URL: ', plotURL)
        this.plotURL = plotURL
      } catch (error) {
        console.error('Failed to get task response', error)
        throw error
      }
    }
  }
})
