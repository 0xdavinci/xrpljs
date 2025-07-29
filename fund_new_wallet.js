// Generate new wallet (A)
// Fund from pre assigned wallet (B)

import xrpl from 'xrpl';  

async function main() {
  // Initialize XRPL client and connect to Testnet
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log("Connected to Testnet");

  try {
    // Fund wallet (replace wit your actual Testnet wallet seed)
    const fundWalletSeed = "sEdS6ogSey4SAKXmZpu1rmmc1oyL1Nz";
    const fundWallet = xrpl.Wallet.fromSeed(fundWalletSeed);

    // Check fund wallet balance
    const fundWalletBalance = await client.getXrpBalance(fundWallet.address);
    console.log("Fund Walle balance", fundWalletBalance, 'XRP');

  } catch (error) {
    console.log('Error', error.message);
  } finally {
    // Disconnect from the client
    await client.disconnect();
    console.log('Disconnected from Testnet');
  }
}

main();