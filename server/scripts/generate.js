const secp = require("ethereum-cryptography/secp256k1")
const {toHex} = require('ethereum-cryptography/utils')
const {keccak256} = require('ethereum-cryptography/keccak')

const privateKey = toHex(secp.secp256k1.utils.randomPrivateKey())

console.log("Private Key : " , privateKey)

const publicKey = secp.secp256k1.getPublicKey(privateKey)

function getAddress(publicKey) {
    const sliced = publicKey.slice(1);
    const hashed = keccak256(sliced);
    return hashed.slice(-20);
}

console.log("Public Key : " , toHex(publicKey))

console.log("address : " , toHex(getAddress(publicKey)))



