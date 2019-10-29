import {
    useCallback,
    useEffect,
    useRef
} from "react";

interface buffer {
    current: String
}

interface config {
    /** Maximum time between characters in milliseconds. Used to determine if input is from keyboard or a scanner. Defaults to 50ms.*/
    waitTime?: number,
    /** Character that barcode scanner prefixes input with.*/
    startCharacter?: number,
    /** Character that barcode scanner suffixes input with. Defaults to line return.*/
    endCharacter?: number,
    /** Callback to use on complete scan input.*/
    onComplete: (code: String) => void,
    /** Callback to use on error. */
    onError?: (error: String) => void,
    /** Minimum length a scanned code should be. Defaults to 0.*/
    minLength?: number,
    /** Ignore scan input if this node is focused.*/
    ignoreIfFocusOn?: Node,
    /** Stop propagation on keydown event. Defaults to false.*/
    stopPropagation?: Boolean,
    /** Prevent default on keydown event. Defaults to false.*/
    preventDefault?: Boolean,
    /** Bind keydown event to this node. Defaults to document.*/
    container?: Node
}

/**
 * Checks for scan input within a container and sends the output to a callback function.
 * @param param0 Config object
 */
const useScanDetection = ({
    waitTime = 50,
    startCharacter,
    endCharacter = 13,
    onComplete,
    onError,
    minLength = 1,
    ignoreIfFocusOn,
    stopPropagation = false,
    preventDefault = false,
    container = document
}: config) => {

    const buffer: buffer = useRef("")
    const timeout: any = useRef(false)

    const clearBuffer = () => {
        buffer.current = ""
    }

    const onKeyDown: Function = useCallback((event: KeyboardEvent) => {
        if (event.currentTarget !== ignoreIfFocusOn) {
            if (event.keyCode === endCharacter) {
                clearTimeout(timeout.current)
                if (buffer.current.length >= minLength) {
                    onComplete(buffer.current.slice(!!startCharacter ? 1 : 0))
                }
                else if (!!onError) {
                    onError("incomplete scan detected")
                }
                clearBuffer()
            }
            if (buffer.current.length > 0 || event.keyCode === startCharacter || !startCharacter) {
                clearTimeout(timeout.current)
                timeout.current = setTimeout(clearBuffer, waitTime)
                buffer.current += event.key
            }
        }
        if (stopPropagation) {
            event.stopPropagation()
        }
        if (preventDefault) {
            event.preventDefault()
        }
    }, [
            startCharacter,
            endCharacter,
            waitTime,
            onComplete,
            onError,
            minLength,
            ignoreIfFocusOn,
            stopPropagation,
            preventDefault
        ])

    useEffect(() => {
        return () => {
            clearTimeout(timeout.current)
        }
    }, [])

    useEffect(() => {
        container.addEventListener("keydown", (onKeyDown) as EventListener)
        return () => {
            container.removeEventListener("keydown", (onKeyDown) as EventListener)
        }
    }, [onKeyDown])
}

export default useScanDetection