import { renderHook, act } from '@testing-library/react-hooks'
import useScanDetection from '../index'

jest.useFakeTimers()

describe('useScanDetection', () => {

    beforeEach(() => {
        jest.clearAllTimers()
    })

    const events = [
        {
            keyCode: 49,
            key: "1"
        },
        {
            keyCode: 50,
            key: "2"
        },
        {
            keyCode: 51,
            key: "3"
        },
        {
            keyCode: 13,
            key: "Enter"
        }
    ].map(key => new KeyboardEvent("keydown", key))

    it("should call onComplete on a complete code", () => {
        const config = {
            onComplete: jest.fn()
        }

        const result = renderHook(() => useScanDetection(config))

        events.forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        expect(config.onComplete)
            .toHaveBeenCalled()
        expect(config.onComplete)
            .toBeCalledWith("123")
    })
    it('should evaluate after timeToEvaluate has passed from the last character', () => {
        const config = {
            onComplete: jest.fn()
        }

        const result = renderHook(() => useScanDetection(config))

        events.slice(0, -1).forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        jest.advanceTimersToNextTimer()

        expect(config.onComplete)
            .toHaveBeenCalled()
        expect(config.onComplete)
            .toBeCalledWith("123")
    })
    it("should call onError on an incomplete code", () => {
        const config = {
            onComplete: jest.fn(),
            onError: jest.fn(),
            minLength: 5
        }

        const result = renderHook(() => useScanDetection(config))

        events.forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        expect(config.onError)
            .toHaveBeenCalled()
    })
    it("should not call onComplete or onError if keypresses are too far apart", () => {
        const config = {
            onError: jest.fn(),
            onComplete: jest.fn()
        }

        const result = renderHook(() => useScanDetection(config))

        events.forEach((event, k) => {
            jest.spyOn(performance, "now").mockImplementationOnce(() => 250 * k)
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        expect(config.onError)
            .not
            .toHaveBeenCalled()
        expect(config.onComplete)
            .not
            .toHaveBeenCalled()
    })
    it("should wait for startCharacter to be inputted before buffering", () => {
        const config = {
            onComplete: jest.fn(),
            startCharacter: [49]
        }
        const result = renderHook(() => useScanDetection(config))

        events.forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        expect(config.onComplete)
            .toBeCalledWith("23")
    })
    it("should ignore keypress events when element in ignoreIfFocusOn is focused", () => {
        const config = {
            onComplete: jest.fn(),
            onError: jest.fn(),
            ignoreIfFocusOn: document
        }
        const result = renderHook(() => useScanDetection(config))

        events.forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        expect(config.onComplete)
            .not
            .toBeCalled()
        expect(config.onError)
            .not
            .toBeCalled()
    })

    it("should cleanup any timers on unmount", () => {
        const config = {
            onComplete: jest.fn()
        }

        const result = renderHook(() => useScanDetection(config))

        events.slice(0, 2).forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
        })

        act(() => {
            result.unmount()
        })

        expect(jest.getTimerCount())
            .toEqual(0)
    })

    it('should respect preventDefault', () => {
        const config = {
            onComplete: jest.fn(),
            preventDefault: true
        }

        renderHook(() => useScanDetection(config))

        const event = events[0]

        const mockPreventDefault = jest.spyOn(event, "preventDefault")

        document.dispatchEvent(event)

        expect(mockPreventDefault)
            .toHaveBeenCalled()
    })
    it('should respect stopPropagation', () => {
        const config = {
            onComplete: jest.fn(),
            stopPropagation: true
        }

        renderHook(() => useScanDetection(config))

        const event = events[0]

        const mockStopPropagation = jest.spyOn(event, "stopPropagation")

        document.dispatchEvent(event)

        expect(mockStopPropagation)
            .toHaveBeenCalled()
    })
})