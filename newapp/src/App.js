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
  const [count,setcount]=useState(0);
  const [writePolicy, setWritePolicy] = useState('write-back');
  const [editMemoryModalOpen, setEditMemoryModalOpen] = useState(false);
  const [editMemoryAddress, setEditMemoryAddress] = useState('');
  const [editMemoryValue, setEditMemoryValue] = useState('');
  const[updatedValue,setUpdatedCacheValue]=useState([]);
  const[recentmemory,setrecentmemory]=useState('');

  // Function to handle closing the edit memory modal
  const handleEditMemoryModalClose = () => {
    setEditMemoryModalOpen(false);
  };
  const handleEditMemoryModalOpen = () => {
    setEditMemoryModalOpen(true);
  };
  const findCacheEntryByIndexAndTag = (indexToFind, tagToFind) => {
    // Traverse through the cacheTable array
    for (let i = 0; i < cacheTable.length; i++) {
      const cacheEntry = cacheTable[i];
  
      // Check if index and tag match the specified values
      if (cacheEntry.index === indexToFind && cacheEntry.tag === tagToFind) {
        // If match found, return the cache entry
        return cacheEntry;
      }
    }
  
    // Return null if no matching cache entry is found
    return null;
  };

  // Function to handle editing memory
  const handleEditMemory = () => {
    // Close the modal
    setEditMemoryModalOpen(false);

    // Check if the memory address is in the cache
    // const memoryAddress = parseInt(editMemoryAddress, 16);
    // // console.log(memoryAddress);
    // const cacheEntry = cacheTable.find((entry) => {
    //   const blockStartAddress = entry.index * Math.pow(2, offsetBits);
    //   const blockEndAddress = blockStartAddress + Math.pow(2, offsetBits) - 1;
    //   return memoryAddress >= blockStartAddress && memoryAddress <= blockEndAddress;
    // });
    const memoryAddress = parseInt(editMemoryAddress, 16);
    console.log("memory address entered is",memoryAddress);
    setrecentmemory(memoryAddress);
    // Convert recent memory address to hexadecimal
const recentMemoryHex = memoryAddress.toString(16).toUpperCase();

// Convert recent memory address to binary
const recentMemoryBinary = memoryAddress.toString(2).padStart(memorySize.toString(16).length * 4, '0');
console.log(offsetBits);
// Extract the offset bits from the binary representation of recent memory
const recentOffsetBinary = recentMemoryBinary.slice(-offsetBits);

console.log("Recent Memory Hexadecimal:", recentMemoryHex);
console.log("Recent Memory Binary:", recentMemoryBinary);
console.log("Recent Offset (Binary):", recentOffsetBinary);

  const tag = memoryAddress >>> (offsetBits + indexBits); 
  console.log("tag value",tag);// Calculate the tag based on offset and index bits
  const index = (memoryAddress >>> offsetBits) & ((1 << indexBits) - 1); // Calculate the index based on offset bits
  console.log("index value",index);

    var cacheEntry;
  var position;
  for (let i = 0; i < cacheTable.length; i++) {
    cacheEntry = cacheTable[i];

    // Check if index and tag match the specified values
    console.log("cacheEntry.index",cacheEntry.index);
    console.log(index.toString());
    console.log(parseInt(cacheEntry.tag, 2));
    console.log(tag.toString());
    if (cacheEntry.index.toString() === index.toString() && parseInt(cacheEntry.tag, 2).toString() === tag.toString()) {
      // If match found, return the cache entry
      console.log("hi");
      // console.log(cacheEntry.offsets);
      position=i;
      break;
    }else{
      cacheEntry= null;
    }
  }
  console.log(cacheTable);
  console.log(cacheTable[position]);
    // If memory address is in cache, set the dirty bit to 1
    if (cacheEntry&& writePolicy==='write-back') {
      cacheEntry.dirtybit = '1';
      // const recentMemoryBinary = recentmemory.toString(2).padStart(memorySize.toString(16).length * 4, '0'); // Convert recent memory address to binary
      // const recentOffset = recentMemoryBinary.slice(-offsetBits); // Extract the offset bits from the binary representation of recent memory
  
      let i = 0;
      
      while (i < cacheEntry.offsets.length) {
        console.log(cacheEntry.offsets[0][0].toString());
        if (cacheEntry.offsets[i][0].toString() === recentOffsetBinary.toString()) {
          cacheEntry.offsets[i][1] = '1';
          console.log("updated dirty bit in offest",recentOffsetBinary)
          break; // Exit the loop once the offset is found and updated
        }
        i++;
      }
      console.log("hello");
      setCacheTable([...cacheTable]); // Update the cache table state
      console.log("edited memory value is ",editMemoryValue);
      console.log("edited memory is ",editMemoryAddress);
      const updatedEntry = [editMemoryAddress, editMemoryValue];
      setUpdatedCacheValue((prevUpdatedValue) => [...prevUpdatedValue, updatedEntry]);
    }
     else {
      
        const blockIndex = Math.floor(memoryAddress / Math.pow(2, offsetBits));
    const wordIndex = memoryAddress % Math.pow(2, offsetBits);

    // Update the memory table with the new value
    setMemoryTable((prevMemoryTable) => {
      const updatedMemoryTable = [...prevMemoryTable];
      updatedMemoryTable[blockIndex][wordIndex][3] = editMemoryValue; // Update DATA field
      return updatedMemoryTable;
    });
    }
  };
  
  
  

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
    setcount(0);
  };
  const generateRandomData = () => {
    return Math.floor(Math.random() * 256).toString(16).toUpperCase();
  };
  
  const handleSubmit = () => {
    // Calculate the number of blocks based on memory size and offset bits
    const numberOfBlocks = memorySize / Math.pow(2, offsetBits);
    // Generate memory table
    const newMemoryTable = [];
    
    for (let i = 0; i < numberOfBlocks; i++) {
      const blockData = [];
      for (let j = 0; j < Math.pow(2, offsetBits); j++) {
        const randomData = generateRandomData();
        blockData.push([i,`B. ${i.toString(16).toUpperCase()}`,`W. ${j.toString(16).toUpperCase()}`,randomData])
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
      const offsets = [];
      // Populate offsets array based on the offset bits
      for (let j = 0; j < Math.pow(2, offsetBits); j++) {
        offsets.push( [ j.toString(2).padStart(offsetBits, '0'), '0'] );
      }
      newCacheTable.push({ index: i, valid: false, tag: '', data: '', offsets:offsets });
    }
  
    
    setCacheTable(newCacheTable);
    setOffsetvalue(offsetBits);
    setTagvalue(tagBits);
    setIndexvalue(indexBits);
  };




const handleNext = () => {
  // Check if there are any data values left to process
  var miss = misscount;
  var hit = hitcount;
  if (!datavalue) {
    alert('No more data values to process.');
    return;
  }

  const values = datavalue.split(',');
  const binaryValue = parseInt(values[0], 16).toString(2);

  const paddedBinaryValue = binaryValue.padStart(instructionLength, '0');
  setcount((prev) => prev + 1);
  const tag = paddedBinaryValue.slice(0, tagBits);
  const index = paddedBinaryValue.slice(tagBits, tagBits + indexBits);
  const offset = paddedBinaryValue.slice(tagBits + indexBits);
  
  
  setTagvalue(tag);
  setIndexvalue(index);
  setOffsetvalue(offset);

  const cacheIndex = parseInt(index, 2);
  const cacheLine = cacheTable[cacheIndex];
  
  if (cacheLine && cacheLine.valid && cacheLine.tag === tag) {
    // Cache hit
    hit = hitcount + 1;
    setHitcount((prev) => prev + 1);
    // Update cache entry as most recently used
    cacheLine.data = `Block:${parseInt(tag + index, 2).toString(16).toUpperCase()}`; // Store the current value, not the next one
  } else {
    // Cache miss
    miss = misscount + 1;
    setMisscount((prev) => prev + 1);

    if (cacheLine && cacheLine.dirtybit === '1') {
      // Check if the dirty bit is set
      var i=0;
      var off;
      for(i in cacheLine.offsets)
      {
        console.log(cacheLine.offsets);
        if(cacheLine.offsets[i][1]=='1')
        {
          off=cacheLine.offsets[i][0];
        }
      }
      console.log("offset is",off);
      const memoryAddress = parseInt(cacheLine.tag + index + off, 2);
      console.log("memory address is",memoryAddress);
      console.log("cacheline.tag is",cacheLine.tag);
      console.log("index is",index);
      console.log("offest is",offset);
      const blockIndex = Math.floor(memoryAddress / Math.pow(2, offsetBits));
      const wordIndex = memoryAddress % Math.pow(2, offsetBits);
     
      var val;
      var i=0;
      for(i in updatedValue)
      {
        console.log("valllll",updatedValue[i][0].toString());
        console.log("vallll",memoryAddress.toString(16));
        if (updatedValue[i][0].toString() === memoryAddress.toString(16)) {
          console.log('hi');
          val = updatedValue[i][1];
          console.log(val);
        }
      }

      // Update the memory table with the new value
      setMemoryTable((prevMemoryTable) => {
        const updatedMemoryTable = [...prevMemoryTable];
        updatedMemoryTable[blockIndex][wordIndex][3] = val; // Update DATA field with cache data
        return updatedMemoryTable;
      });
    }

    cacheTable[cacheIndex] = {
      index: cacheIndex,
      valid: true,
      tag,
      data: `Block:${parseInt(tag + index, 2).toString(16).toUpperCase()}`,
      dirtybit: '0',
      offsets:cacheLine.offsets
    };
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
  const totalAccesses = count + 1; // Add 1 for the current access
  const hitRate = (hit / totalAccesses) * 100;
  const missRate = (miss / totalAccesses) * 100;
  setHitRate(hitRate);
  setMissRate(missRate);
};

  const handleWritePolicyChange = (e) => {
    setWritePolicy(e.target.value);
  };
 
  
  return (
    <div className="container">
      <div className="left-panel">
        <div className="input-section" >
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
          <button className="button" onClick={handleReset}>Reset</button>
          <button className="button" onClick={handleSubmit}>Submit</button>
        </div>
        <div className="input-section">
          <input
            type="text"
            placeholder="Data Values (Comma-separated)"
            value={datavalue}
            onChange={(e) => setdatavalue(e.target.value)}
          />
          <button className="button" onClick={handleNext}>Next</button>
        </div>
        <div>
          <h3 className="hit">Hit Rate: {hitRate}%</h3>
          <h3 className="miss">Miss Rate: {missRate}%</h3>
          <h3 className="hitno">Number of hits: {hitcount}</h3>
          <h3 className="missno">Number of misses: {misscount}</h3>
        </div>
      </div>
      <div className="center-panel">
        <div className="header">
          
          <div className="simulator-section">
            <h2>CACHE SIMULATOR</h2>
            {/* Instruction breakdown and cache table */}
          </div>
          <div className="direct-mapped-section">
            <h2>Direct Mapping Technique</h2>
            {/* Instructions specific to direct mapping */}
          </div>
        </div>
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
                <th>Dirtybit</th>
              </tr>
            </thead>
            <tbody>
              {cacheTable.map((entry) => (
                <tr key={entry.index}>
                  <td>{entry.index}</td>
                  <td>{entry.valid.toString()}</td>
                  <td>{entry.tag}</td>
                  <td>{entry.data}</td>
                  <td>{entry.dirtybit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="right-panel">
        <div className="memory-block-container">
          <div className="memory-block-section">
            <h2>Memory Segment</h2>
            {/* <div className='memtable'>

            {memoryTable.map((blockData, index) => (
              <div key={index}>
                {blockData.map((data, subIndex) => (
                  <span key={`${index}-${subIndex}`}>{data}&nbsp;&nbsp;&nbsp;</span>
                ))}
              </div>
            ))}
            </div> */}
            {/* <div className="memtable">
              {memoryTable.map((blockData, index) => (
                <div key={index}>
                  {Object.values(blockData).map((value, wordIndex) => ( // Corrected line
                    <span key={`${index}-${wordIndex}`}>{`Word ${wordIndex}: ${value}`}&nbsp;&nbsp;&nbsp;</span>
                  ))}
                </div>
              ))}
            </div> */}
            <div className="memtable">
  {memoryTable.map((entry, index) => (
    <div key={index} className="memory-block">
      {entry.map((en, subIndex) => (
        <div key={subIndex}>
          {en[1]}, {en[2]}, {en[3]}
        </div>
      ))}
    </div>
  ))}
</div>
{/* <div className="memtable">
  {memoryTable.map((block, blockIndex) => (
    <div key={blockIndex} className="memory-block">
      <div>
        {block.word.BLOCK}, {block.word.WORD}, {block.word.DATA}
      </div>
    </div>
  ))}
</div> */}



          </div>
          
        </div>
        <div className="write-policy-box">
          <h2>Write Policy</h2>
          <div>
            <input
              type="radio"
              id="write-back"
              name="write-policy"
              value="write-back"
              checked={writePolicy === 'write-back'}
              onChange={handleWritePolicyChange}
            />
            <label htmlFor="write-back">Write-Back</label>
          </div>
          <div>
            <input
              type="radio"
              id="write-through"
              name="write-policy"
              value="write-through"
              checked={writePolicy === 'write-through'}
              onChange={handleWritePolicyChange}
            />
            <label htmlFor="write-through">Write-Through</label>
          </div>
        </div>
        <div>
          <button onClick={handleEditMemoryModalOpen}>Edit Memory</button>
          {editMemoryModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleEditMemoryModalClose}>&times;</span>
              <h2>Edit Memory</h2>
              <div>
                <input
                  type="text"
                  placeholder="Memory Address"
                  value={editMemoryAddress}
                  onChange={(e) => setEditMemoryAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="New Value"
                  value={editMemoryValue}
                  onChange={(e) => setEditMemoryValue(e.target.value)}
                />
                <button onClick={handleEditMemory}>Edit</button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;