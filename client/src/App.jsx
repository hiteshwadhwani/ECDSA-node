import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [secret, setSecretKey] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        secret={secret}
        setSecretKey={setSecretKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        message={message}
        setMessage={setMessage}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        secret={secret}
        setSecretKey={setSecretKey}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
}

export default App;
