import { useRef, useState } from 'react';
import useScanDetection from './useScanDetection';

function App() {
  const [value, setValue] = useState<string | undefined>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [keys, setKeys] = useState<string[]>([])

  const handleScanComplete = (e: string) => {
    if (inputRef.current) {
      const scannedValue = e.toUpperCase();
      alert("Scanned: " + scannedValue)
      inputRef.current.value = scannedValue;
      setValue(scannedValue);
    }
  };

  useScanDetection({
    onComplete: handleScanComplete,
    minLength: 7,
  });

  return (
    <div className="m-5 flex flex-col gap-5">
      <div>Scanner Input</div>
      <input
        type="text"
        className="border border-gray-500 rounded w-64 py-1 px-2"
        ref={inputRef}
        onInput={(event) => {
          const inputEvent = event.nativeEvent as InputEvent;
          if (inputEvent.inputType === 'insertText') {
            setValue(inputRef.current?.value || '');
          }
        }}
        // onKeyDown={(event) => {
        //   setKeys([...keys, event.key])
        //   if (event.key === 'Enter') {
        //     setValue(inputRef.current?.value || '');
        //   }
        // }}
      />
      <div>✍: {value}</div>
      <div>Keys: {keys.join(", ")}</div>
    </div>
  );
}

export default App;
