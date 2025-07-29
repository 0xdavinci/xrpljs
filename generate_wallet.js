import { Wallet } from "xrpl";

const wallet = Wallet.generate();
console.log(wallet);
console.log(wallet.address);
console.log(wallet.seed);