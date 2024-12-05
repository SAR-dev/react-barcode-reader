import { useRef, useState } from 'react';
import useScanDetection from './useScanDetection';

function App() {
  const [tempValue, setTempvalue] = useState("")

  const inputRef = useRef<HTMLInputElement>(null);

  const handleScanComplete = (e: string) => {
    if (inputRef.current) {
      const scannedValue = e.toUpperCase();
      // inputRef.current.value = scannedValue;
      setTempvalue(scannedValue);
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
        onChange={e => setTempvalue(e.target.value)}
        value={tempValue}
        // onKeyDown={(event) => {
        //   if (event.key === 'Enter') {
        //     setValue(tempValue);
        //   }
        // }}
      />
      <div>✍: {tempValue}</div>
    </div>
  );
}

export default App;
