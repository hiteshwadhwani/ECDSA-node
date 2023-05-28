import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [secret, setSecretKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        secret={secret}
        setSecretKey={setSecretKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        secret={secret}
      />
    </div>
  );
}

export default App;
