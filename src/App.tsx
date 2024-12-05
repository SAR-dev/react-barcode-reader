import { useRef, useState } from 'react';
import useScanDetection from './useScanDetection';

function App() {
  const [value, setValue] = useState<string | undefined>('');
  const [disabled, setDisabled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [keys, setKeys] = useState<string[]>([])

  const handleScanComplete = (e: string) => {
    if (inputRef.current) {
      const scannedValue = e.toUpperCase();
      inputRef.current.value = scannedValue;
      setValue(scannedValue);
      setDisabled(true)
      setTimeout(() => {
        setDisabled(() => false);
      }, 2000);
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
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setValue(inputRef.current?.value || '');
          }
        }}
        onChange={e => setKeys([...keys, e.target.value])}
        disabled={disabled}
      />
      <div>✍: {value}</div>
      <div>Keys: {keys.join(", ")}</div>
    </div>
  );
}

export default App;
