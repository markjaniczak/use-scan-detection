import { renderHook, act } from '@testing-library/react-hooks'
import useScanDetection from '../index'

jest.useFakeTimers()

describe('useScanDetection', () => {

    beforeEach(() => {
        jest.spyOn(performance, 'now').mockImplementation(() => Math.random() * 50)
    })

    afterEach(() => {
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
            keyCode: 13,
            key: "Enter"
        }
    ].map(key => new KeyboardEvent("keydown", key))

    it("should call onComplete on a complete scan", () => {
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
            .toBeCalledWith("12")
    })
    it("should call onError on a partial scan", () => {
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
    it("should be incomplete if keys are too far apart", () => {
        const config = {
            onError: jest.fn(),
            onComplete: jest.fn()
        }

        jest.spyOn(performance, 'now').mockImplementation(() => 100)

        const result = renderHook(() => useScanDetection(config))

        events.forEach(event => {
            document.dispatchEvent(event)
            act(() => {
                result.rerender()
            })
            jest.runAllTimers()
        })

        expect(config.onError)
            .toHaveBeenCalled()
        expect(config.onComplete)
            .not
            .toHaveBeenCalled()
    })
    it("should wait for startCharacter to be inputted", () => {
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
            .toBeCalledWith("2")
    })
    it("should ignore input on ignoreIfFocusOn when focused", () => {
        const config = {
            onComplete: jest.fn(),
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
    })

    it("should cleanup any timers", () => {
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