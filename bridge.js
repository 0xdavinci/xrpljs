import { Client, Wallet } from "xrpl";
// import { ethers } from 'ethers';

function hex(str) {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
}

async function transferXRPtoEVM() {
  try {
    // Step 1: Set up XRPL Testnet and EVM Sidechain Testnet clients
    const xrplClient = new Client("wss://s.altnet.rippletest.net:51233");
    // const provider = new ethers.JsonRpcProvider('https://rpc-evm-sidechain.xrpl.org');
    // const signer = new ethers.Wallet('YOUR_EVM_PRIVATE_KEY', provider); // Replace with Wallet B's EVM private key

    console.log("Connecting to XRPL Testnet...");
    await xrplClient.connect();

    // Step 2: Define wallet addresses
    const walletAAddress = "rEM59UKdVUUPoUj7LEJuiH658c5MPhmJXE"; // Replace with Wallet A's XRPL Testnet address
    const walletBEVMAddress = "0x4F4AbBDCC9c536cF32b55e663574428979181fdA"; // Replace with Wallet B's EVM address on XRPL EVM Sidechain Testnet
    console.log("Wallet A (XRPL Testnet):", walletAAddress);
    console.log("Wallet B (EVM Sidechain Testnet):", walletBEVMAddress);
    console.log(hex(walletBEVMAddress.replace("0x", "")));

    // Step 3: Set up Axelar ITS contract
    // const ITS_ADDRESS = '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C';
    // const ITS_ABI = [
    //   'function interchainTransfer(string memory _destinationChain, bytes memory _destinationAddress, uint256 _amount, bytes memory _data) payable',
    // ];
    // const itsContract = new ethers.Contract(ITS_ADDRESS, ITS_ABI, signer);

    // Step 4: Send XRP from Wallet A (XRPL Testnet) to Axelar Gateway
    const gatewayAddress = "rNrjh1KGZk2jBR3wPfAQnoidtFFYQKbQn2"; // Replace with Axelar Gateway address from docs.axelar.dev
    const amount = "1000000"; // 1 XRP in drops (1 XRP = 1,000,000 drops)
    const destinationChain = "xrpl-evm"; // Axelar chain ID for XRPL EVM Sidechain Testnet

    const payment = {
      TransactionType: "Payment",
      Account: walletAAddress,
      Amount: amount,
      Destination: gatewayAddress,
      Memos: [
        {
          Memo: {
            MemoType: hex("type"),
            MemoData: hex("interchain_transfer"),
          },
        },
        {
          Memo: {
            MemoType: hex("destination_address"),
            MemoData: hex(walletBEVMAddress.replace("0x", "")),
          },
        },
        {
          Memo: {
            MemoType: hex("destination_chain"),
            MemoData: hex(destinationChain),
          },
        },
        {
          Memo: {
            MemoType: "6761735f6665655f616d6f756e74", // hex("gas_fee_amount")
            MemoData: hex("100000"), // amount of tokens to allocate to gas fees
          },
        },
      ],
    };

    console.log("Preparing XRPL transaction...");
    const prepared = await xrplClient.autofill(payment);
    const wallet = Wallet.fromSeed("sEdVKb8mWMVma5YwQCsYU7phx4EXpzT"); // Replace with Wallet A's XRPL Testnet seed
    const signed = wallet.sign(prepared);
    console.log("Submitting XRPL transaction...");
    const result = await xrplClient.submitAndWait(signed.tx_blob);
    console.log("XRPL Transaction Result:", result);

    // Step 5: Verify balance of Wallet B on XRPL EVM Sidechain Testnet
    // console.log('Checking Wallet B balance on EVM Sidechain Testnet...');
    // const balance = await provider.getBalance(walletBEVMAddress);
    // console.log('Wallet B EVM Sidechain Testnet Balance:', ethers.formatEther(balance), 'XRP');

    // Step 6: Disconnect XRPL client
    await xrplClient.disconnect();
    console.log("Disconnected from XRPL Testnet.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function test() {
  const testWallet = "0x0A90c0Af1B07f6AC34f3520348Dbfae73BDa358E";
  console.log(hex(testWallet.replace("0x", "")));
}

// Execute the transfer
await transferXRPtoEVM();
//test();
