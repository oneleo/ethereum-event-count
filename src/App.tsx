import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import { keccak256, toUtf8Bytes, JsonRpcProvider } from "ethers";
import "./App.css";

const rpcUrl = import.meta.env.VITE_RPC_URL;
const etherScanApiUrl = import.meta.env.VITE_ETHER_SCAN_API_URL;
const etherScanApiKey = import.meta.env.VITE_ETHER_SCAN_API_KEY;

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>();

  // Transaction must have been sent to EntryPoint contract
  const entryPointAddress = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";

  // Identifier for PostOpRevertReason event
  // = "0xf62676f440ff169a3a9afdbf812e89e7f95975ee8e5c31214ffdef631c5f4792"
  const postOpRevertReasonId = keccak256(
    toUtf8Bytes("PostOpRevertReason(bytes32,address,uint256,bytes)")
  );

  const calculateLogNumberFromApi = async () => {
    const FROM_BLOCK = "";
    const TO_BLOCK = "";
    const PAGE = "";
    const OFFSET = "";

    // Refer: https://docs.etherscan.io/api-endpoints/logs#get-event-logs-by-topics
    const request = `https://${etherScanApiUrl}?module=logs
    &action=getLogs
    &address=${entryPointAddress}
    &fromBlock=${FROM_BLOCK}
    &toBlock=${TO_BLOCK}
    &topic0=${postOpRevertReasonId}
    &page=${PAGE}
    &offset=${OFFSET}
    &apikey=${etherScanApiKey}`.replace(/\s+/g, "");

    const response = await axios.get(request);

    setData(response.data.result);

    const message = response.data.message;
    const count = response.data.result.length;

    console.log(`message: ${message}, count: ${count}`);
  };

  const calculateLogNumberFromEthers = async () => {
    const provider = new JsonRpcProvider(rpcUrl);
    const eventFilter = {
      address: entryPointAddress,
      topics: [postOpRevertReasonId],
      fromBlock: 0,
    };
    const logs = await provider.getLogs(eventFilter);
    setData(logs);
    console.log(`count: ${logs.length}`);
  };

  const printData = () => {
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button onClick={calculateLogNumberFromApi}>From etherscan API</button>
      </div>
      <div className="card">
        <button onClick={calculateLogNumberFromEthers}>
          From ethers provider
        </button>
      </div>
      <div className="card">
        <button onClick={printData}>Print data</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
