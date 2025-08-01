# XRPL EVM Sidechain Bridge

This project contains scripts to transfer XRP between the XRPL testnet and the XRPL EVM sidechain using Axelar's interchain transfer system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your wallet credentials:
```bash
# EVM Sidechain Configuration
EVM_PRIVATE_KEY=your_evm_private_key_here
XRPL_ADDRESS=your_xrpl_address_here
XRPL_SEED=your_xrpl_seed_here
```

## Scripts

### 1. Transfer XRP from XRPL to EVM Sidechain
```bash
node bridge.js
```
This script transfers XRP from the XRPL testnet to the EVM sidechain.

### 2. Transfer XRP from EVM Sidechain to XRPL
```bash
node transfer_xrp_evm_to_xrpl.js
```
This script transfers XRP from the EVM sidechain back to the XRPL testnet.

### 3. Fund a new wallet
```bash
node fund_new_wallet.js
```
Creates and funds a new XRPL testnet wallet.

### 4. Fund existing wallet
```bash
node fund_wallet.js
```
Funds an existing XRPL testnet wallet.

## Configuration

### Environment Variables

- `EVM_PRIVATE_KEY`: Your EVM private key (without 0x prefix)
- `XRPL_ADDRESS`: Your XRPL wallet address
- `XRPL_SEED`: Your XRPL wallet seed (for signing transactions)

### Network Endpoints

- **XRPL Testnet**: `wss://s.altnet.rippletest.net:51233`
- **EVM Sidechain**: `https://rpc.testnet.xrplevm.org`
- **Axelar ITS Contract**: `0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C`

## How it works

1. **XRPL to EVM**: Uses XRPL memos to send transfer instructions to the Axelar gateway
2. **EVM to XRPL**: Uses the Axelar ITS contract on the EVM sidechain to initiate the transfer back to XRPL

## Important Notes

- Make sure you have sufficient balance on both networks before attempting transfers
- The transfer process involves multiple confirmations and may take several minutes
- Always test with small amounts first
- Keep your private keys secure and never commit them to version control

## Troubleshooting

- If transfers fail, check that you have sufficient balance on the source network
- Ensure your wallet addresses are correct
- Verify that the Axelar network is operational
- Check the console output for detailed error messages 