import server from "./server";
import {secp256k1} from 'ethereum-cryptography/secp256k1'
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils'
import {keccak256} from 'ethereum-cryptography/keccak'

function Wallet({ address, setAddress, balance, setBalance,secret, setSecretKey}){
  async function onChange(evt) {
    setSecretKey(evt.target.value)
    const publicKey = secp256k1.getPublicKey(secret)
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

  function getAddress(publicKey) {
    const sliced = publicKey.slice(1);
    const hashed = keccak256(sliced);
    return hashed.slice(-20);
}

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

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
