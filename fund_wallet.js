import xrpl from "xrpl";
const api = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
await api.connect();
const { wallet, balance } = await api.fundWallet();
console.log(wallet, balance);
await api.disconnect();
