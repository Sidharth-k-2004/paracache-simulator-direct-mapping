import React, { useState } from 'react';
import './App.css';

function App() {
  const [cacheSize, setCacheSize] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [offsetBits, setOffsetBits] = useState('');
  const [offsetvalue, setOffsetvalue] = useState('');
  const [memoryTable, setMemoryTable] = useState([]);
  const [cacheTable, setCacheTable] = useState([]);
  const [tagBits, setTagBits] = useState('');
  const [tagvalue, setTagvalue] = useState('');
  const [indexBits, setIndexBits] = useState('');
  const [indexvalue, setIndexvalue] = useState('');
  const [instructionLength, setInstructionLength] = useState('');
  const [datavalue, setdatavalue] = useState('');
  const [missRate, setMissRate] = useState(0);
  const [hitRate, setHitRate] = useState(0);

  const handleReset = () => {
    setCacheSize('');
    setMemorySize('');
    setOffsetBits('');
    setMemoryTable([]);
    setCacheTable([]);
    setTagBits('');
    setIndexBits('');
    setInstructionLength('');
    setMissRate(0);
    setHitRate(0);
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

    // Generate cache table
    const newCacheTable = [];
    for (let i = 0; i < cacheLines; i++) {
      newCacheTable.push({ index: i, valid: false, tag: '', data: '' });
    }
    setCacheTable(newCacheTable);
    setOffsetvalue(offsetBits);
    setTagvalue(tagBits);
    setIndexvalue(indexBits);

    // Handle form submission
    // You can send cacheSize, memorySize, and offsetBits to the backend here
  };

  const handleNext = () => {
    const values = datavalue.split(',');
    const binaryValue = parseInt(values[0]).toString(2);
    const paddedBinaryValue = binaryValue.padStart(instructionLength, '0');
  
    const tag = paddedBinaryValue.slice(0, tagBits);
    const index = paddedBinaryValue.slice(tagBits, tagBits + indexBits);
    const offset = paddedBinaryValue.slice(tagBits + indexBits);
    setTagvalue(tag);
    setIndexvalue(index);
    setOffsetvalue(offset);
  
    // Update datavalue state with remaining values
    values.shift();
    setdatavalue(values.join(','));
  
    // Check if the tag is present in the cache
    const cacheLine = cacheTable.find(entry => entry.index === index && entry.tag === tag);
    if (cacheLine) {
      // Cache hit
      setHitRate(prev => prev + 1);
  
      // Update cache entry as most recently used
      cacheLine.valid = true;
      cacheLine.tag = tag;
      cacheLine.data = values[0]; // Store the current value, not the next one
      setCacheTable(prevCache => [...prevCache.filter(entry => !(entry.index === index && entry.tag === tag)), cacheLine]);
    } else {
      // Cache miss
      setMissRate(prev => prev + 1);
  
      // Find the least recently used cache entry to replace
      const lruCacheLine = cacheTable.find(entry => !entry.valid) || cacheTable[0];
  
      // Replace the least recently used cache entry
      const newCacheLine = { index, valid: true, tag, data: values[0] }; // Store the current value, not the next one
      setCacheTable(prevCache => [...prevCache.filter(entry => !(entry.index === lruCacheLine.index && entry.tag === lruCacheLine.tag)), newCacheLine]);
    }
  
    // Send values to Flask backend along with hit rate and miss rate
    fetch('http://localhost:5000/send_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: values, missRate, hitRate }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle response if needed
        console.log('Response from Flask backend:', data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
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
            type="text"
            placeholder="Memory Size"
            value={memorySize}
            onChange={(e) => setMemorySize(e.target.value)}
          />
          <input
            type="text"
            placeholder="Offset Bits"
            value={offsetBits}
            onChange={(e) => setOffsetBits(e.target.value)}
          />
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="input-section">
          <input
            type="text"
            placeholder="data values"
            value={datavalue}
            onChange={(e) => setdatavalue(e.target.value)}
          />
          <button onClick={handleNext}>Next</button>
        </div>
        <div>
          <h3>Hit Rate: {hitRate}%</h3>
          <h3>Miss Rate: {missRate}%</h3>
        </div>
      </div>
      <div className="center-panel">
        <div className="instruction-section">
          <h2>Instruction Breakdown</h2>
          <table>
            <tbody>
              <tr>
                <th>Tag Bits</th>
                <th>Index Bits</th>
                <th>Offset Bits</th>
              </tr>
              <tr>
                <td>{tagvalue}</td>
                <td>{indexvalue}</td>
                <td>{offsetvalue}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cache-table">
          <h2>Cache Table</h2>
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Valid</th>
                <th>Tag</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {cacheTable.map((entry) => (
                <tr key={entry.index}>
                  <td>{entry.index}</td>
                  <td>{entry.valid.toString()}</td>
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
