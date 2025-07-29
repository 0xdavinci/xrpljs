// Generate new wallet (A)
// Fund from pre assigned wallet (B)

import xrpl from "xrpl";

async function main() {
  // Initialize XRPL client and connect to Testnet
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();
  console.log("Connected to Testnet");

  try {
    // Fund wallet (replace wit your actual Testnet wallet seed)
    const fundWalletSeed = "sEdS6ogSey4SAKXmZpu1rmmc1oyL1Nz";
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
