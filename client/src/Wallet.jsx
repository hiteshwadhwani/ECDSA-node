import server from "./server";
import {secp256k1} from 'ethereum-cryptography/secp256k1'
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils'
import {keccak256} from 'ethereum-cryptography/keccak'

import {useState} from 'react'

function Wallet({ address, setAddress, balance, setBalance,secret, setSecretKey,message,setMessage  }){
  async function onChange(evt) {
    setSecretKey(evt.target.value)
    const publicKey = secp256k1.getPublicKey(secret)
    const signedMessage = signMessage(message)
    const address = toHex(getAddress(publicKey))
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function signMessage(msg) {
    return secp256k1.sign(hashMessage(msg), secret, {recovered: true});
  }

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  function getAddress(publicKey) {
    const sliced = publicKey.slice(1);
    const hashed = keccak256(sliced);
    return hashed.slice(-20);
}

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Write a Message
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>

      <label>
        Enter secret Key
        <input placeholder="Type an Secret key" value={secret} onChange={onChange}></input>
      </label>

      <div>
        address : {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
