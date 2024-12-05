import { useRef, useState } from 'react';
import useScanDetection from './useScanDetection';

function App() {
  const [value, setValue] = useState<string | undefined>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleScanComplete = (e: string) => {
    if (inputRef.current) {
      const scannedValue = e.toUpperCase();
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
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            const val = (event.target as HTMLInputElement).value;
            setValue(val);
          }
        }}
      />
      <div>✍: {value}</div>
    </div>
  );
}

export default App;
