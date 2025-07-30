// Generate new wallet (A)
// Fund from pre assigned wallet (B)

import xrpl from "xrpl";
import dotenv from "dotenv";

// Load environment variables from .evn file

dotenv.config();

async function main() {
  // Variable environment variables
  const { XRPL_NETWORK, FUND_WALLET_SEED } = process.env;
  if (!XRPL_NETWORK || !FUND_WALLET_SEED) {
    throw new Error(
      "XRPL_NETWORK and FUND_WALLET_SEED must be defined in .env file"
    );
  }
  // Initialize XRPL client and connect to Testnet
  const client = new xrpl.Client(process.env.XRPL_NETWORK);
  await client.connect();
  console.log("Connected to Testnet");

  try {
    // Fund wallet (replace wit your actual Testnet wallet seed)
    const fundWalletSeed = process.env.FUND_WALLET_SEED;
    const fundWallet = xrpl.Wallet.fromSeed(fundWalletSeed);

    // Check fund wallet balance
    const fundWalletBalance = await client.getXrpBalance(fundWallet.address);
    console.log("Fund Wallet balance", fundWalletBalance, "XRP");

    // Generate a new wallet
    const newWallet = xrpl.Wallet.generate();
    console.log("New wallet generated:");
    console.log("Address:", newWallet.address);
    console.log("Seed:", newWallet.seed);

    // Check generated wallet current balance
    // const newWalletBalance = await client.getXrpBalance(newWallet.address);
    // console.log("New wallet Balance", newWalletBalance, "XRP");

    // Prepare a Payment transaction tofund the new wallet
    const payment = {
      TransactionType: "Payment",
      Account: fundWallet.address,
      Destination: newWallet.address,
      Amount: xrpl.xrpToDrops("1"),
    };

    // Autofill transaction
    const prepared = await client.autofill(payment);
    console.log("Transaction Prepared");

    // Sign the transaction with the fund wallet
    const signed = fundWallet.sign(prepared);
    console.log("Transaction signed");

    // Submit the transaction
    const result = await client.submitAndWait(signed.tx_blob);
    console.log("Transction result:", result.result.meta.TransactionResult);

    // Verify the new wallet's balance & current fund wallet balance
    const newBalance = await client.getXrpBalance(newWallet.address);
    console.log("New Wallet Balance", newBalance, "XRP");
    const currentFundWalletBalance = await client.getXrpBalance(
      fundWallet.address
    );
    console.log("Current Fund Wallet Balance", currentFundWalletBalance, "XRP");
  } catch (error) {
    console.log("Error", error.message);
  } finally {
    // Disconnect from the client
    await client.disconnect();
    console.log("Disconnected from Testnet");
  }
}

main();
