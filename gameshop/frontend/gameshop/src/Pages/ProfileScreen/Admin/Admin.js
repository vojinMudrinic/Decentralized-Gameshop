import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Modal from "react-modal";

import styles from "./Admin.module.css";
import { Context } from "../../../utils/GameShopContext";
import { convertToEth, formatDate } from "../../../utils/helpers";
import LoaderSvg from "../../../svg/LoaderSvg";
import EtherLogoSvg from "../../../svg/EtherLogoSvg";

Modal.setAppElement("body");

const Admin = () => {
  const { contract, account } = useContext(Context);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const getBalance = useCallback(async () => {
    const balance = await contract?.methods.getContractBalance().call();
    if (Number(balance) > 0) {
      const formated = convertToEth(Number(balance));
      setBalance(formated);
    } else {
      setBalance(0);
    }
  }, [contract?.methods]);

  const claimFunds = useCallback(async () => {
    try {
      setLoading(true);
      await contract?.methods.claimStoreFunds().send({ from: account });
      setLoading(false);
      getBalance();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [account, contract?.methods, getBalance]);

  const getEvents = useCallback(async () => {
    const events = await contract?.getPastEvents("Transaction", {
      fromBlock: 0,
      toBlock: "latest",
    });

    setLogs(events);
  }, [contract]);

  const renderLogs = useMemo(
    () =>
      logs.reverse().map((el, i) => {
        const { returnValues } = el;
        return (
          <div className={styles.log} key={i}>
            <span>{formatDate(returnValues.date)}</span>
            <span>{returnValues.from}</span>
            <div className={styles.logPriceWrapper}>
              <span>{convertToEth(Number(returnValues.price))}</span>
              <EtherLogoSvg />
            </div>
          </div>
        );
      }),
    [logs]
  );

  useEffect(() => {
    getBalance();
    getEvents();
  }, [getBalance, getEvents]);

  return (
    <div className={styles.container}>
      <h1>Admin</h1>
      <div className={styles.balance}>
        <div className={styles.priceWrapper}>
          <span>Total balance: {balance}</span>
          <EtherLogoSvg />
        </div>

        {balance <= 0 ? (
          <span>Balance is empty</span>
        ) : (
          <button className={styles.claimButton} onClick={claimFunds}>
            Withdraw funds
          </button>
        )}
      </div>
      <div className={styles.logs}>{renderLogs}</div>
      <Modal isOpen={loading} className={styles.modalWrapper}>
        <div className={styles.loadingMessage}>
          <LoaderSvg className={styles.loader} />
          <h1>Pending...</h1>
          <span>This window will close once the transaction is completed</span>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
