import contractAddress from "../address/address.json";
import contractAbi from "../artifacts/contracts/GameShop.sol/GameShop.json";
import Web3 from "web3";

export const PRODUCT_STATUS = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  REMOVED: 2,
};

export const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      if (!window.ethereum) {
        window.alert("Please install metamask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Metamask not installed");
  }
};

const createContractInstance = (provider) => {
  const address = contractAddress.contract_address;
  const abi = contractAbi.abi;

  return new provider.eth.Contract(abi, address);
};

export const connectContract = async () => {
  try {
    const web3 = new Web3(window.ethereum);
    const contract = createContractInstance(web3);
    return contract;
  } catch (error) {
    console.error(error);
  }
};
