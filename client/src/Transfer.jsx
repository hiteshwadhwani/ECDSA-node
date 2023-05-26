import { useState } from "react";
import server from "./server";
import {secp256k1} from 'ethereum-cryptography/secp256k1'
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils'
import {keccak256} from 'ethereum-cryptography/keccak'

function Transfer({ address, setBalance, secret, setSecretKey,message,setMessage }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    const signedMessage = signMessage(message)
    evt.preventDefault();
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signedMessage: signedMessage,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function signMessage(msg) {
    return secp256k1.sign(hashMessage(msg), secret, {recovered: true});
  }

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
