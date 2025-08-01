import { decodeAccountID } from "ripple-address-codec";
import { ethers } from "ethers";

const xrplAddress = "rEM59UKdVUUPoUj7LEJuiH658c5MPhmJXE";

// 1. Decode base58 to 20-byte AccountID
const accountBytes = decodeAccountID(xrplAddress); // Uint8Array of length 20
console.log(accountBytes);

const accountBytes1 = ethers.toUtf8Bytes(xrplAddress);
console.log(accountBytes1);

// 2. Convert to hex and pad
const evmDestinationAddress = ethers.hexlify(accountBytes1);

console.log("EVM-style address:", evmDestinationAddress);
// Example output: 0xcdaa5ba0215e9359fa62cb5a5650a17b362817ac
