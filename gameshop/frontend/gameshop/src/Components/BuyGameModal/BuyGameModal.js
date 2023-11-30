import React, { useContext, useState } from "react";
import Modal from "react-modal";

import styles from "./BuyGameModal.module.css";
import CloseSvg from "../../svg/CloseSvg";
import { convertToEth, formatPrice } from "../../utils/helpers";
import { Context } from "../../utils/GameShopContext";
import LoaderSvg from "../../svg/LoaderSvg";

Modal.setAppElement("body");

const BuyGameModal = ({ data, isOpen, setIsOpen, callback }) => {
  const { contract, account } = useContext(Context);
  const { name, price, id } = data || {};
  const convertedPrice = convertToEth(Number(price));

  const [loading, setLoading] = useState(false);

  const buyGame = async () => {
    setLoading(true);
    try {
      await contract?.methods
        .buyGame(Number(id))
        .send({ from: account, value: formatPrice(convertedPrice) });
      setLoading(false);
      setIsOpen(false);
      callback();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <Modal isOpen={isOpen} className={styles.wrapper}>
      {loading ? (
        <div className={styles.loadingMessage}>
          <LoaderSvg className={styles.loader} />
          <h1>Pending...</h1>
          <span>This window will close once the transaction is completed</span>
        </div>
      ) : (
        <div className={styles.container}>
          <CloseSvg
            onClick={() => setIsOpen(false)}
            className={styles.closeSvg}
          />
          <h1>Buy game!</h1>
          <div className={styles.overview}>
            <span>Product name: {name}</span>
            <span>Product price: {convertedPrice} ETH</span>
          </div>
          <div className={styles.addButton}>
            <button
              type="button"
              className={styles.submitButton}
              onClick={buyGame}
            >
              <span>Purchase</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BuyGameModal;
