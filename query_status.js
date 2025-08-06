import {
  AxelarGMPRecoveryAPI,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const sdk = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
});

const txHash =
  "2A1E587A9CC6644890959590940DB1CB99CE6BF5C92FD7C6412222CBC5548C63";

const txStatus = await sdk.queryTransactionStatus(txHash);

console.log(txStatus);
