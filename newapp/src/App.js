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
  const [misscount, setMisscount] = useState(0);
  const [hitRate, setHitRate] = useState(0);
  const [hitcount, setHitcount] = useState(0);
  // const [count,setcount]=useState(0);

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
    setCacheTable([]);
    setHitcount(0);
    setMisscount(0);
    // setcount(0);
  };
  const handleSubmit = () => {
    // Calculate the number of blocks based on memory size and offset bits
    const numberOfBlocks = memorySize / Math.pow(2, offsetBits);
    // Generate memory table
    const newMemoryTable = [];
    for (let i = 0; i < numberOfBlocks; i++) {
      // Generate data for each memory block based on offset bits
      const blockData = [];
      for (let j = 0; j < Math.pow(2, offsetBits); j++) {
        blockData.push(`B. ${i.toString(16).toUpperCase()} W. ${j.toString(16).toUpperCase()}`);
      }
      newMemoryTable.push(blockData);
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
  };


  const handleNext = () => {
    // Check if there are any data values left to process
    if (!datavalue) {
      alert('No more data values to process.');
      return;
    }
  
    const values = datavalue.split(',');
    const binaryValue = parseInt(values[0],16).toString(2);
 
    const paddedBinaryValue = binaryValue.padStart(instructionLength, '0');
  
    const tag = paddedBinaryValue.slice(0, tagBits);
    const index = paddedBinaryValue.slice(tagBits, tagBits + indexBits);
    const offset = paddedBinaryValue.slice(tagBits + indexBits);
    setTagvalue(tag);
    setIndexvalue(index);
    setOffsetvalue(offset);
  
    const cacheLine = cacheTable.find(
      (entry) => entry.index === parseInt(index, 2) && entry.valid && entry.tag === tag
    );
    if (cacheLine) {
      // Cache hit
      setHitcount((prev) => prev + 1);
      // Update cache entry as most recently used
      cacheLine.data = values[0]; // Store the current value, not the next one
    } else {
      // Cache miss
      setMisscount((prev) => prev + 1);
      const cacheIndex = parseInt(index, 2);
      const newCacheLine = { index: cacheIndex, valid: true, tag, data: values[0] }; // Store the current value, not the next one
      cacheTable[cacheIndex] = newCacheLine;
    }
  
    // Update datavalue state with remaining values or reset if all values processed
    if (values.length > 1) {
      values.shift();
      setdatavalue(values.join(','));
    } else {
      // Reset datavalue state
      setdatavalue('');
    }
  
    // Calculate hit rate and miss rate
    const totalAccesses = hitcount + misscount +1 // Add 1 for the current access
    const hitRate = (hitcount / totalAccesses) * 100;
    const missRate = (misscount / totalAccesses) * 100;
    setHitRate(hitRate);
    setMissRate(missRate);
  };
  
  // const handleNext = () => {
  //   const values = datavalue.split(',');
  //   const binaryValue = parseInt(values[0]).toString(2);
  //   const paddedBinaryValue = binaryValue.padStart(instructionLength, '0');
  
  //   const tag = paddedBinaryValue.slice(0, tagBits);
  //   const index = paddedBinaryValue.slice(tagBits, tagBits + indexBits);
  //   const offset = paddedBinaryValue.slice(tagBits + indexBits);
  //   setTagvalue(tag);
  //   setIndexvalue(index);
  //   setOffsetvalue(offset);
  
  //   const cacheLine = cacheTable.find(entry => entry.index === parseInt(index, 2) && entry.valid && entry.tag === tag);
  //   if (cacheLine) {
  //     // Cache hit
  //     setHitcount(prev => prev + 1);
  //     // Update cache entry as most recently used
  //     cacheLine.data = values[0]; // Store the current value, not the next one
  //   } else {
  //     // Cache miss
  //     setMisscount(prev => prev + 1);
  //     const cacheIndex = parseInt(index, 2);
  //     const newCacheLine = { index: cacheIndex, valid: true, tag, data: values[0] }; // Store the current value, not the next one
  //     cacheTable[cacheIndex] = newCacheLine;
  //   }
    
  //   // Update datavalue state with remaining values
  //   values.shift();
  //   setdatavalue(values.join(','));
  
  //   // Calculate hit rate and miss rate only if totalAccesses is not zero
  //   const totalAccesses = hitcount + misscount;
  //   if (totalAccesses !== 0) {
  //     const hitRate = (hitcount / totalAccesses) * 100;
  //     const missRate = (misscount / totalAccesses) * 100;
  //     setHitRate(hitRate);
  //     setMissRate(missRate);
  //   }
  // };
  
  
  

  

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
          <h3>Number of hits: {hitcount}</h3>
          <h3>Number of misses: {misscount}</h3>
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
       <div className="memory-block-container">
        <div className="memory-block-section">
              <h2>Memory segment</h2>
          {memoryTable.map((blockData, index) => (
            <div key={index}>
              {blockData.map((data) => (
                <span key={data}>{data}&nbsp;&nbsp;&nbsp;</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
