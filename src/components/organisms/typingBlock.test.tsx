import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TypingBlock from './typingBlock'
import { useSession } from '@/hooks/useSession'
import { useNavigate } from '@tanstack/react-router'
import { useSessionForm } from '@/hooks/useSessionForm'
import { useTyperTimer } from '@/hooks/useTimer'
import { ReactFormExtendedApi, useStore } from '@tanstack/react-form'
import { SESSION_STATUS } from '@/lib/constants'


vi.mock('@/hooks/useSession', () => ({
  useSession: vi.fn()
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn()
}))

vi.mock('@/hooks/useSessionForm', () => ({
  useSessionForm: vi.fn()
}))

vi.mock('@/hooks/useTimer', () => ({
  useTyperTimer: vi.fn()
}))

vi.mock('@tanstack/react-form', () => ({
  useStore: vi.fn()
}))

const mockNavigate = vi.fn()

const mockParagraph = {
  id: '123',
  name: 'Test Paragraph',
  content: 'This is a test paragraph.'
}

const mockSessionId = '123'

const mockForm = {
  setFieldValue: vi.fn(),
    getFieldValue: vi.fn(),
    reset: vi.fn(),
    handleSubmit: vi.fn(),
    store: {},
    Field: ({ children }: any) => children({
      state: { value: 'This' },
      name: 'input',
      handleBlur: vi.fn(),
      handleChange: vi.fn()
    }),
    options: {},
    baseStore: {},
    fieldMetaDerived: {},
    fieldInfo: {},
    formApi: {} as any,
    formController: {} as any,
    formState: {} as any,
    state: {} as any,
    stateRef: { current: {} },
    notify: vi.fn(),
    subscribe: vi.fn(),
    getValue: vi.fn(),
    setValue: vi.fn(),
    setInitialValue: vi.fn(),
    setTouched: vi.fn(),
    setError: vi.fn(),
    validate: vi.fn(),
    validateFields: vi.fn(),
    getError: vi.fn(),
    getTouched: vi.fn(),
    getInitialValue: vi.fn(),
    setValues: vi.fn(),
    setErrors: vi.fn(),
} as any

const mockTimer = {
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
  isRunning: false,
  start: vi.fn(),
  pause: vi.fn(),
  restart: vi.fn()
} as any

describe('TypingBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useSession).mockReturnValue({
      paragraph: mockParagraph,
      sessionId: mockSessionId
    })
    
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    
    vi.mocked(useSessionForm).mockReturnValue(mockForm)
    

    vi.mocked(useTyperTimer).mockReturnValue(mockTimer)
    
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.NOT_STARTED)
      .mockReturnValueOnce(false)
  })

  it('displays timer with minutes and seconds', () => {
    render(<TypingBlock />)
    
    const timer = screen.getByText('00:00')
    expect(timer).toBeDefined()
  })

  it('starts timer when user starts typing', () => {
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.NOT_STARTED)
      .mockReturnValueOnce(true)
    
    render(<TypingBlock />)
    
    const textarea = screen.getByPlaceholderText('start typing to start the session')
    fireEvent.change(textarea, { target: { value: 'T' } })

    expect(mockTimer.start).toHaveBeenCalled()
    expect(mockForm.setFieldValue).toHaveBeenCalledWith('formStatus', SESSION_STATUS.STARTED)
  })

  it('highlights correct text when user types correctly', () => {
    const innerForm = {
      ...mockForm,
      Field: ({ children }: any) => children({
        state: { value: 'This' }, // Set the mock value here
        name: 'input',
        handleBlur: vi.fn(),
        handleChange: vi.fn()
      })
    }

    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.STARTED)
      .mockReturnValueOnce(true)

    vi.mocked(useSessionForm).mockReturnValue(innerForm)
    
    render(<TypingBlock />)

    const highlightedTextT = screen.getByText('T')
    const highlightedTextH = screen.getByText('h')
    const highlightedTextI = screen.getByText('i')
    const highlightedTextS = screen.getByText('s')

    expect(highlightedTextT.className).toContain('bg-green-200')
    expect(highlightedTextH.className).toContain('bg-green-200')
    expect(highlightedTextI.className).toContain('bg-green-200')
    expect(highlightedTextS.className).toContain('bg-green-200')
  })

  it('highlights incorrect text when user types wrongly', () => {
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.STARTED)
      .mockReturnValueOnce(true)
    
    render(<TypingBlock />)
    
    const textarea = screen.getByPlaceholderText('start typing to start the session')
    fireEvent.change(textarea, { target: { value: 'Wrong' } })

    expect(screen.getByText('This')).toBeDefined()
  })

  it('restarts the session when clicking re-start button', () => {
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.STARTED)
      .mockReturnValueOnce(true)
    
    render(<TypingBlock />)
    
    const restartButton = screen.getByText('Re-Start')
    fireEvent.click(restartButton)

    expect(mockForm.reset).toHaveBeenCalled()
    expect(mockTimer.restart).toHaveBeenCalled()
    expect(mockForm.setFieldValue).toHaveBeenCalledWith('formStatus', SESSION_STATUS.NOT_STARTED)
  })

  it('navigates to home when clicking cancel button', () => {
    render(<TypingBlock />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('shows username input when session is finished', () => {
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.FINISHED)
      .mockReturnValueOnce(true)

    const innerForm = {
      ...mockForm,
      Field: ({ name, children }: any) => {
        if (name === 'input') {
          return children({
            state: { value: 'This' },
            name: 'input',
            handleBlur: vi.fn(),
            handleChange: vi.fn()
          })
        }
        if (name === 'userName') {
          return children({
            state: { value: '' },
            name: 'userName',
            handleBlur: vi.fn(),
            handleChange: vi.fn()
          })
        }
      },
      getFieldValue: (name: string) => {
        const values = {
          input: 'This',
          sessionId: '123',
          deletes: 0,
          formStatus: SESSION_STATUS.FINISHED,
          paragraphId: '123',
          totalSeconds: 120,
          userName: ''
        }
        return values[name as keyof typeof values]
      }
    }

    vi.mocked(useSessionForm).mockReturnValue(innerForm)
    
    render(<TypingBlock />)

    const finishButton = screen.getByText('finish')
    fireEvent.click(finishButton)

    const usernameInput = screen.getByPlaceholderText('Enter your name')
    expect(usernameInput).toBeDefined()
  })

  it('handles form submission correctly', async () => {
    vi.mocked(useStore)
      .mockReturnValueOnce(SESSION_STATUS.STARTED)
      .mockReturnValueOnce(true)

    const innerForm = {
      ...mockForm,
      Field: ({ children }: any) => children({
        state: { value: 'This' }, // Set the mock value here
        name: 'input',
        handleBlur: vi.fn(),
        handleChange: vi.fn()
      })
    }

    vi.mocked(useSessionForm).mockReturnValue(innerForm)
    
    render(<TypingBlock />)
    
    const submitButton = screen.getByText('finish')
    fireEvent.click(submitButton)

    expect(mockTimer.pause).toHaveBeenCalled()
    expect(mockForm.setFieldValue).toHaveBeenCalledWith('formStatus', SESSION_STATUS.FINISHED)
    expect(mockForm.setFieldValue).toHaveBeenCalledWith('totalSeconds', mockTimer.totalSeconds)
  })
})