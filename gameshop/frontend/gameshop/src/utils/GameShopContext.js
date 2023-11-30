import React, { useCallback, useEffect, useState } from "react";
import { connectWallet, connectContract } from "../constants/constants";
import { useNavigate } from "react-router-dom";

export const Context = React.createContext();

export const GameShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const contract = await connectContract();
      const account = await connectWallet();
      setAccount(account);
      setContract(contract);
    } catch (error) {
      setError("Please install Metamask");
    }
  };

  const onChangeWalletListener = useCallback(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          navigate("/");
        }
      });
    } else {
      setAccount(null);
      console.log("Metamask not installed");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    onChangeWalletListener();
  }, [onChangeWalletListener]);

  return (
    <Context.Provider value={{ account, fetchData, contract, error }}>
      {children}
    </Context.Provider>
  );
};
