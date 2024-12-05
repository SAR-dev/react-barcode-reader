import { useCallback, useEffect, useRef } from 'react';

interface bufferCharacter {
  time: number;
  char: string;
}

interface buffer {
  current: Array<bufferCharacter>;
}

interface config {
  /** Time to wait from last character to then trigger an evaluation of the buffer. */
  timeToEvaluate?: number;
  /** Average time between characters in milliseconds. Used to determine if input is from keyboard or a scanner. Defaults to 50ms.*/
  averageWaitTime?: number;
  /** Character that barcode scanner prefixes input with.*/
  startCharacter?: Array<string>;
  /** Character that barcode scanner suffixes input with. Defaults to line return.*/
  endCharacter?: Array<string>;
  /** Callback to use on complete scan input.*/
  skipCharacter?: Array<string>;
  /** Callback to skip keys on scan input.*/
  onComplete: (code: string) => void;
  /** Callback to use on error. */
  onError?: (error: string) => void;
  /** Minimum length a scanned code should be. Defaults to 0.*/
  minLength?: number;
  /** Ignore scan input if this node is focused.*/
  ignoreIfFocusOn?: Node;
  /** Stop propagation on keydown event. Defaults to false.*/
  stopPropagation?: Boolean;
  /** Prevent default on keydown event. Defaults to false.*/
  preventDefault?: Boolean;
  /** Bind keydown event to this node. Defaults to document.*/
  container?: Node;
}

const useScanDetection = ({
  timeToEvaluate = 100,
  averageWaitTime = 50,
  startCharacter = [],
  endCharacter = ['Enter', 'Escape'],
  skipCharacter = ['Shift'],
  onComplete,
  onError,
  minLength = 1,
  ignoreIfFocusOn,
  stopPropagation = false,
  preventDefault = false,
  container = document,
}: config) => {
  const buffer: buffer = useRef([]);
  const timeout: any = useRef(false);

  const clearBuffer = () => {
    buffer.current = [];
  };
  const evaluateBuffer = () => {
    clearTimeout(timeout.current);
    const sum = buffer.current
      .map(({ time }, k, arr) => (k > 0 ? time - arr[k - 1].time : 0))
      .slice(1)
      .reduce((total, delta) => total + delta, 0);
    const avg = sum / (buffer.current.length - 1);

    const code = buffer.current
      .slice(startCharacter.length > 0 ? 1 : 0)
      .map(({ char }) => char)
      .join('');

    if (
      avg <= averageWaitTime &&
      buffer.current.slice(startCharacter.length > 0 ? 1 : 0).length >=
        minLength
    ) {
      onComplete(code);
    } else {
      avg <= averageWaitTime && !!onError && onError(code);
    }
    clearBuffer();
  };

  const onKeyDown: Function = useCallback(
    (event: KeyboardEvent) => {
      if (event.currentTarget !== ignoreIfFocusOn) {
        if (endCharacter.includes(event.key)) {
          evaluateBuffer();
        }
        if (
          buffer.current.length > 0 ||
          startCharacter.includes(event.key) ||
          startCharacter.length === 0
        ) {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(evaluateBuffer, timeToEvaluate);
          if (!skipCharacter.includes(event.key)) {
            buffer.current.push({ time: performance.now(), char: event.key });
          }
        }
      }
      if (stopPropagation) {
        event.stopPropagation();
      }
      if (preventDefault) {
        event.preventDefault();
      }
    },
    [
      startCharacter,
      endCharacter,
      timeToEvaluate,
      onComplete,
      onError,
      minLength,
      ignoreIfFocusOn,
      stopPropagation,
      preventDefault,
    ]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    container.addEventListener('keydown', onKeyDown as EventListener);
    return () => {
      container.removeEventListener('keydown', onKeyDown as EventListener);
    };
  }, [onKeyDown]);
};

export default useScanDetection;
