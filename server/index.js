const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {utf8ToBytes} = require('ethereum-cryptography/utils')

app.use(cors());
app.use(express.json());

const balances = {
  "6f65180cdf1da5418ac32df9298bc644b43565ce": 100, // 7a040ea351dc6afc25ede81a0d85743cb7e729e553bfb5f649adca69773134b0
  "75e3af7a94bb7c4f8d45648fd93db05563cb8d78": 50, // ed8d1df971933c2e9ea6f3c261eafcd49d5c5247dc730067f716a60e001822f6
  "d62cccb677d3739c596be812dc5a8c586fb21e80": 75, //166327180756f9d209d7f083e9c5d0fd6a808861e9033be4fc46d91ae10f9bd2
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

app.post("/send", (req, res) => {
  try {
    const { publicKey, signedMessage, msg, sender, recipient, amount } = req.body;

    const signtaure = JSON.parse(signedMessage)

    const isVerified = secp.secp256k1.verify({
      r: BigInt(signtaure.r),
      s: BigInt(signtaure.s)
    }, hashMessage(msg), publicKey)

    if(isVerified){
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender], isVerified });
      }
    }
    else{
      res.send({verified})
    }    
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
