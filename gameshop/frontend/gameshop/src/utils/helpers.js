import Web3 from "web3";

export const generateSerialKey = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const formatPrice = (price) => {
  const web3 = new Web3(window.ethereum);
  return web3.utils.toWei(price, "ether");
};

export const convertToEth = (price) => {
  const web3 = new Web3(window.ethereum);
  return web3.utils.fromWei(price, "ether");
};

export const inputValidationMsg = (error, className) => {
  if (error) {
    return <p className={className}>{"*" + error}</p>;
  } else {
    return null;
  }
};

export const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
