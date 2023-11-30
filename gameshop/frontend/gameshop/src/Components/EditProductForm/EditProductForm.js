import React, { useContext, useState } from "react";
import Modal from "react-modal";

import styles from "./EditProductForm.module.css";
import CloseSvg from "../../svg/CloseSvg";
import { convertToEth, generateSerialKey } from "../../utils/helpers";
import { Context } from "../../utils/GameShopContext";
import LoaderSvg from "../../svg/LoaderSvg";

Modal.setAppElement("body");
const EditProductForm = ({ data, isOpen, setIsOpen, callback }) => {
  const { contract, account } = useContext(Context);
  const { name, price, id, keys } = data || {};
  const convertedPrice = convertToEth(Number(price));
  const [loading, setLoading] = useState(false);

  const removeGame = async () => {
    setLoading(true);
    try {
      await contract?.methods.removeGame(Number(id)).send({ from: account });
      setLoading(false);
      setIsOpen(false);
      callback();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const addNewKey = async () => {
    setLoading(true);
    try {
      const key = generateSerialKey(12);
      await contract?.methods
        .addSerialKey(key, Number(id))
        .send({ from: account });
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
          <h1>Edit game!</h1>
          <div className={styles.overview}>
            <span>Product name: {name}</span>
            <span>Product price: {convertedPrice} ETH</span>
          </div>
          <div className={styles.addButton}>
            {Number(keys) < 3 ? (
              <button
                type="button"
                className={styles.addKey}
                onClick={addNewKey}
              >
                <span>Generate new key</span>
              </button>
            ) : null}
            <button
              type="button"
              className={styles.removeButton}
              onClick={removeGame}
            >
              <span>Remove product</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditProductForm;
