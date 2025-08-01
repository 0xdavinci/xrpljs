import { Client } from "xrpl";
import { ethers } from "ethers";
import dotenv from "dotenv";
import IITS from "@axelar-network/interchain-token-service/artifacts/contracts/interfaces/IInterchainTokenService.sol/IInterchainTokenService.json" assert { type: "json" };

// Load environment variables
dotenv.config();

async function transferXRPfromEVMtoXRPL() {
  try {
    // Step 1: Set up XRPL Testnet and EVM Sidechain Testnet clients
    const xrplClient = new Client("wss://s.altnet.rippletest.net:51233");
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.testnet.xrplevm.org"
    );

    // Get private key from environment or use a default for testing
    const evmPrivateKey = process.env.EVM_PRIVATE_KEY;
    const signer = new ethers.Wallet(evmPrivateKey, provider);

    console.log("Connecting to XRPL Testnet...");
    await xrplClient.connect();

    // Step 2: Define wallet addresses
    const walletBEVMAddress = signer.address; // EVM wallet address
    const walletAXRPLAddress = process.env.XRPL_ADDRESS; // XRPL wallet address

    console.log("Wallet B (EVM Sidechain):", walletBEVMAddress);
    console.log("Wallet A (XRPL Testnet):", walletAXRPLAddress);

    // Step 3: Set up Axelar ITS contract on EVM sidechain
    const ITS_ADDRESS = "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
    const ITS_ABI = IITS.abi;

    const itsContract = new ethers.Contract(ITS_ADDRESS, ITS_ABI, signer);

    // Step 4: Check EVM wallet balance
    console.log("Checking EVM wallet balance...");
    const evmBalance = await provider.getBalance(walletBEVMAddress);
    console.log(
      "EVM Sidechain Balance:",
      ethers.formatEther(evmBalance),
      "XRP"
    );

    if (evmBalance === 0n) {
      console.log("No balance on EVM sidechain. Please fund the wallet first.");
      return;
    }

    // Step 5: Prepare transfer parameters
    const amount = ethers.parseEther("1");
    const destinationChain = "xrpl"; // Axelar chain ID for XRPL Testnet
    const destinationAddress = walletAXRPLAddress;

    // Convert XRPL address to bytes for the memo

    const destinationAddressBytes = ethers.toUtf8Bytes(destinationAddress);

    console.log("Preparing EVM transaction...");
    console.log("Amount to transfer:", ethers.formatEther(amount), "XRP");
    console.log("Destination chain:", destinationChain);
    console.log("Destination address:", destinationAddress);

    // Step 6: Execute the interchain transfer from EVM to XRPL
    console.log("Executing interchain transfer from EVM to XRPL...");
    const tx = await itsContract.interchainTransfer(
      "0xba5a21ca88ef6bba2bfff5088994f90e1077e2a1cc3dcc38bd261f00fce2824f",
      destinationChain,
      destinationAddressBytes,
      amount,
      "0x",
      ethers.parseEther("0.5"),
      {
        gasLimit: 250_000,
        value: ethers.parseEther("0.5"),
      }
    );

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction confirmation...");

    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());

    // Step 7: Wait a bit for the transfer to process on Axelar
    console.log("Waiting for Axelar to process the transfer...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    // Step 8: Check XRPL wallet balance
    console.log("Checking XRPL wallet balance...");
    const accountInfo = await xrplClient.request({
      command: "account_info",
      account: walletAXRPLAddress,
      ledger_index: "validated",
    });

    const xrplBalance = accountInfo.result.account_data.Balance;
    console.log(
      "XRPL Testnet Balance:",
      xrplBalance,
      "drops (",
      Number(xrplBalance) / 1000000,
      "XRP)"
    );

    // Step 9: Disconnect XRPL client
    await xrplClient.disconnect();
    console.log("Disconnected from XRPL Testnet.");

    console.log("Transfer completed successfully!");
    console.log("Check your XRPL wallet for the received XRP.");
  } catch (error) {
    console.error("Error:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
  }
}

// Execute the transfer
console.log("Starting XRP transfer from EVM sidechain to XRPL testnet...");
await transferXRPfromEVMtoXRPL();
