# About Decentralized Gameshop

This project was created using [React](https://create-react-app.dev/) with [Web3.js](https://web3js.readthedocs.io/en/v1.10.0/) library on the frontend and [Hardhat](https://hardhat.org/) on the backend and [Solidity](https://soliditylang.org/) for smart contract development. <br/>
Decentralized Gameshop is a decentralized application that represents your standard online webshop where you would purchase serial keys for game clients such as Steam., but instead of a server, stores and retrives data from the blockchain.<br/>
**Roles**<br/>
There are two roles in this application.<br/>

1. Admin/Owner

   - The address that deployed the contract is Admin and has permissions to:
   - Add a product
   - Remove a product
   - Update a product
   - Can view the purchase log
   - Withdraw balance

2. Customer
   - Can purchase serial keys
   - Can view list of purchased serial keys
     <br/>

**Product Status**<br/>
The game/product can have next status:<br/>

1. UNAVAILABLE - All product keys have been bought
2. AVAILABLE - Product has at least 1 serial key
3. REMOVED - Admin has removed the game
   <br/>

## How to start the project

1. Inside the "gameshop\backend" run "npm install" in terminal
2. In same directory create a .env file and copy the content from .env-sample.
3. Inside the "gameshop\frontend\gameshop" run "npm install"
4. Install the [Metamask](https://metamask.io/) browser extension.
5. In Metamask test networks, select Sepolia.
6. Create test accounts. At least create 2 so both admin and customer features can be experienced.
7. Choose one of the accounts that you want to deploy the contract and be admin and in Metamask go to account details and copy the private key and set it to PRIVATE_KEY variable in .env file.
8. Visit [Infura](https://app.infura.io/dashboard) and get an API key that you will set to INFURA_API variable that is in your .env file.
9. You now need "fake eather" from faucets. Use [Infura](https://www.infura.io/faucet/sepolia) for one account and [Alchemy](https://sepoliafaucet.com/) for other, there is a 24 hour cooldown.
10. Once API keys are set, go to gameshop\backend and in the terminal run "npx hardhat run scripts/deploy.js --network sepolia". You will be notified in the terminal once the contract is deployed to an address.
11. Inside gameshop\frontend\gameshop run "npm run start" to start the frontend application.
