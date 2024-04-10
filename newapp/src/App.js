import React, { useState } from 'react';
import './App.css';

function App() {
  const [cacheSize, setCacheSize] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [offsetBits, setOffsetBits] = useState('');
  const [memoryTable, setMemoryTable] = useState([]);
  const [cacheTable, setCacheTable] = useState([]);
  const [tagBits, setTagBits] = useState('');
  const [indexBits, setIndexBits] = useState('');
  const [instructionLength, setInstructionLength] = useState('');
  const [searchData, setSearchData] = useState('');
  const [tagBinary, setTagBinary] = useState('');
  const [indexBinary, setIndexBinary] = useState('');
  const [offsetBinary, setOffsetBinary] = useState('');

  const handleReset = () => {
    setCacheSize('');
    setMemorySize('');
    setOffsetBits('');
    setMemoryTable([]);
    setCacheTable([]);
    setTagBits('');
    setIndexBits('');
    setInstructionLength('');
    setSearchData('');
    setTagBinary('');
    setIndexBinary('');
    setOffsetBinary('');
  };

  const handleSubmit = () => {
    // Calculate the number of blocks based on memory size and offset bits
    const numberOfBlocks = memorySize / Math.pow(2, offsetBits);

    // Generate memory table
    const newMemoryTable = [];
    for (let i = 0; i < numberOfBlocks; i++) {
      const startAddress = i * Math.pow(2, offsetBits);
      const endAddress = startAddress + Math.pow(2, offsetBits) - 1;
      newMemoryTable.push({ blockNumber: i, startAddress, endAddress });
    }
    setMemoryTable(newMemoryTable);

    // Calculate tag bits, index bits, and instruction length
    const cacheLines = cacheSize / Math.pow(2, offsetBits);
    const indexBitsCount = Math.log2(cacheLines);
    setIndexBits(indexBitsCount);

    const instructionLengthCount = Math.log2(memorySize);
    setInstructionLength(instructionLengthCount);

    const tagBitsCount = instructionLengthCount - indexBitsCount - offsetBits;
    setTagBits(tagBitsCount);

    // Convert user data to binary
    const binaryDataString = Number(searchData).toString(2).padStart(instructionLengthCount, '0');

    // Split binary data into tag, index, and offset parts
    const tagBinaryString = binaryDataString.substring(0, tagBitsCount);
    const indexBinaryString = binaryDataString.substring(tagBitsCount, tagBitsCount + indexBitsCount);
    const offsetBinaryString = binaryDataString.substring(tagBitsCount + indexBitsCount);
    setTagBinary(tagBinaryString);
    setIndexBinary(indexBinaryString);
    setOffsetBinary(offsetBinaryString);

    // Generate cache table
    const newCacheTable = [];
    for (let i = 0; i < cacheLines; i++) {
      newCacheTable.push({ line: i, tag: '', data: '' });
    }
    setCacheTable(newCacheTable);

    // Handle form submission
    // You can send cacheSize, memorySize, offsetBits, and searchData to the backend here
  };

  const handleMemorySizeChange = (value) => {
    setMemorySize(value);
    const instructionLengthCount = Math.log2(value);
    setInstructionLength(instructionLengthCount);
    const tagBitsCount = instructionLengthCount - indexBits - offsetBits;
    setTagBits(tagBitsCount);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="input-section">
          <input
            type="text"
            placeholder="Cache Size"
            value={cacheSize}
            onChange={(e) => setCacheSize(e.target.value)}
          />
          <input
            type="number"
            placeholder="Memory Size"
            value={memorySize}
            onChange={(e) => handleMemorySizeChange(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="Offset Bits"
            value={offsetBits}
            onChange={(e) => setOffsetBits(e.target.value)}
          />
          <input
            type="text"
            placeholder="Data to Search"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
          <div className="button-group">
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        <div className="input-section">
          {/* Additional input section as mentioned */}
        </div>
      </div>
      <div className="center-panel">
        <div className="instruction-section">
          <h2>Instruction Breakdown</h2>
          <table className="instruction-table">
            <thead>
              <tr>
                <th>Tag Bits</th>
                <th>Tag Binary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tagBits}</td>
                <td>{tagBinary}</td>
              </tr>
            </tbody>
          </table>
          <table className="instruction-table">
            <thead>
              <tr>
                <th>Index Bits</th>
                <th>Index Binary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{indexBits}</td>
                <td>{indexBinary}</td>
              </tr>
            </tbody>
          </table>
          <table className="instruction-table">
            <thead>
              <tr>
                <th>Offset Bits</th>
                <th>Offset Binary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{offsetBits}</td>
                <td>{offsetBinary}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cache-table">
          <h2>Cache Table</h2>
          <table>
            <thead>
              <tr>
                <th>Line</th>
                <th>Tag</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {cacheTable.map((entry) => (
                <tr key={entry.line}>
                  <td>{entry.line}</td>
                  <td>{entry.tag}</td>
                  <td>{entry.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="right-panel">
        <div className="memory-block-section">
          <h2>Memory Block Table</h2>
          <table>
            <thead>
              <tr>
                <th>Block Number</th>
                <th>Start Address</th>
                <th>End Address</th>
              </tr>
            </thead>
            <tbody>
              {memoryTable.map((block) => (
                <tr key={block.blockNumber}>
                  <td>{block.blockNumber}</td>
                  <td>{block.startAddress}</td>
                  <td>{block.endAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
