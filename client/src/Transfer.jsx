import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({
  address,
  setBalance,
  secret
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const msg = JSON.stringify({
        sender: address,
        amount: parseInt(sendAmount),
        recipient
      })
      const signedMessage = await signMessage(msg)
      const signature = JSON.stringify({
        ...signedMessage, s: signedMessage.s.toString(), r: signedMessage.r.toString()
      })
      const publicKey = toHex(secp256k1.getPublicKey(secret))
      const {
        data: { balance },
      } = await server.post(`send`, {
        publicKey:publicKey,
        signedMessage: signature,
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (error) {
      console.log(error)
    }
  }

  async function signMessage(msg) {
    return secp256k1.sign(hashMessage(msg), secret);
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
