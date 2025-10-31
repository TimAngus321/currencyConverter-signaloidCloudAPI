import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBuildTaskAPI } from '../buildTaskAPI'
import axios from 'axios'

// Create mock axios instance
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn()
}

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      get: vi.fn()
    }
  }
})

describe('useBuildTaskAPI', () => {
  let store: ReturnType<typeof useBuildTaskAPI>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBuildTaskAPI()
    vi.clearAllMocks()
  })

  describe('generatePlot', () => {
    it('throws an error if taskOutputRes is null', async () => {
      store.taskOutputRes = null
      
      await store.generatePlot()
      
      // The error should be caught and logged
      expect(store.plotURL).toBeNull()
    })

    it('throws an error if taskOutputRes is empty', async () => {
      store.taskOutputRes = ''
      
      await store.generatePlot()
      
      // The error should be caught and logged
      expect(store.plotURL).toBeNull()
    })

    it('correctly extracts the payload and makes a POST request to the /plot endpoint', async () => {
      const mockTaskOutput = 'Some output Ux1234567890abcdef more data'
      const mockPresignedURL = 'https://example.com/plot.png'
      
      store.taskOutputRes = mockTaskOutput
      
      mockAxiosInstance.post.mockResolvedValue({
        data: { presignedURL: mockPresignedURL }
      })
      
      await store.generatePlot()
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/plot', {
        payload: 'Ux1234567890abcdef more data'
      })
    })

    it('correctly sets the plotURL state upon a successful API response', async () => {
      const mockTaskOutput = 'Some output Ux1234567890abcdef more data'
      const mockPresignedURL = 'https://example.com/plot.png'
      
      store.taskOutputRes = mockTaskOutput
      
      mockAxiosInstance.post.mockResolvedValue({
        data: { presignedURL: mockPresignedURL }
      })
      
      await store.generatePlot()
      
      expect(store.plotURL).toBe(mockPresignedURL)
    })
  })

  describe('checkTaskStatus', () => {
    it('calls the task outputs API with the sanitized=false query parameter', async () => {
      const mockTaskID = 'task-123'
      store.taskId = mockTaskID
      
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          Stdout: 'https://example.com/stdout.txt'
        }
      })
      
      vi.mocked(axios.get).mockResolvedValue({
        data: 'Sample output UxABCDEF123'
      } as any)
      
      const mockGeneratePlot = vi.spyOn(store, 'generatePlot').mockResolvedValue()
      
      await store.checkTaskStatus()
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/tasks/${mockTaskID}/outputs?sanitized=false`
      )
    })

    it('calls generatePlot after successfully retrieving and setting taskOutputRes', async () => {
      const mockTaskID = 'task-123'
      const mockStdoutURL = 'https://example.com/stdout.txt'
      const mockStdoutData = 'Sample output UxABCDEF123'
      
      store.taskId = mockTaskID
      
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          Stdout: mockStdoutURL
        }
      })
      
      vi.mocked(axios.get).mockResolvedValue({
        data: mockStdoutData
      } as any)
      
      const mockGeneratePlot = vi.spyOn(store, 'generatePlot').mockResolvedValue()
      
      await store.checkTaskStatus()
      
      expect(store.taskOutputRes).toBe(mockStdoutData)
      expect(mockGeneratePlot).toHaveBeenCalled()
    })
  })
})
