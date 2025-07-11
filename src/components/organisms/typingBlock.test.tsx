import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TypingBlock from './typingBlock'
import { SessionContext } from '@/store/sessionStore'

const mockParagraph = {
  id: '123',
  name: 'Test Paragraph',
  content: 'This is a test paragraph.'
}

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const navigate = vi.fn()
const redirect = vi.fn().mockImplementation((args) => {
  return args
})

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  redirect: (args: unknown) => redirect(args),
  Link: () => null,
}))

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <SessionContext.Provider 
      value={{
        paragraph: mockParagraph,
        sessionId: '123'
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

describe('TypingBlock', () => {
  it('should display timer with minutes and seconds', () => {
    render(<TypingBlock />, { wrapper: createWrapper() })
    
    const timer = screen.getByText('02:00')
    expect(timer).toBeDefined()
  })

  it('should show correct paragraph content', () => {
    render(<TypingBlock />, { wrapper: createWrapper() })
    
    expect(screen.getByText(`${mockParagraph.name}`)).toBeDefined()

     mockParagraph.content.split('').forEach((char, index) => {
      const element = screen.getByTestId(`${index}-${char.replace(' ', '_')}`)
      expect(element).toBeDefined()
      expect(element.textContent).toBe(char)
    })
  })

  it('should show username input when session is finished', () => {
    render(<TypingBlock />, { 
      wrapper: createWrapper()
    })

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: mockParagraph.content } })

    const submitButton = screen.getByText('finish')
    fireEvent.click(submitButton)

    expect(screen.getByPlaceholderText('Enter your name')).toBeDefined()
    expect(screen.getByText('Save')).toBeDefined()
  })

  it('should show typing interface when session is not finished', () => {
    render(<TypingBlock />, { wrapper: createWrapper() })
    
    expect(screen.getByPlaceholderText('start typing to start the session')).toBeDefined()
    expect(screen.getByText('finish')).toBeDefined()
  })

  it('should render restart and cancel buttons', () => {
    render(<TypingBlock />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Re-Start')).toBeDefined()
    expect(screen.getByText('Cancel')).toBeDefined()
  })

  it('should save username and navigate when form is submitted', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        sessionId: '123',
        name: 'jables',
        score: 100,
        paragraphName: 'Test Paragraph',
        paragraphId: '123',
        accuracy: 100
      })
    })

    render(<TypingBlock />, { 
      wrapper: createWrapper()
    })

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: mockParagraph.content } })

    const finishButton = screen.getByText('finish')
    fireEvent.click(finishButton)

    const usernameInput = screen.getByPlaceholderText('Enter your name')
    fireEvent.change(usernameInput, { target: { value: 'jables' } })

    const form = screen.getByRole('form')
    fireEvent.submit(form)

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/result', expect.any(Object))
      expect(navigate).toHaveBeenCalledWith({
        to: '/result/123'
      })
    })
  })

it('should redirect to home page when API call fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<TypingBlock />, { 
      wrapper: createWrapper()
    })

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: mockParagraph.content } })

    const finishButton = screen.getByText('finish')
    fireEvent.click(finishButton)

    const usernameInput = screen.getByPlaceholderText('Enter your name')
    fireEvent.change(usernameInput, { target: { value: 'jables' } })

    const form = screen.getByRole('form')

    try {
      await act(async () => {
        await fireEvent.submit(form)
      })
    } catch (error: any) {
      if (!error.__isRedirect) {
        console.log(error)
      }
    }
    
    await fireEvent.submit(form)

    await vi.waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error saving result')
      expect(redirect).toHaveBeenCalledWith({
        to: '/'
      })
    })

    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })
})