import React, { useRef } from "react";
import Modal from "react-modal";

import styles from "./FilterModal.module.css";
import CloseSvg from "../../svg/CloseSvg";
import { convertToEth } from "../../utils/helpers";
import { PRODUCT_STATUS } from "../../constants/constants";

Modal.setAppElement("body");

const FilterModal = ({ isOpen, setIsOpen, setGames, sourceData }) => {
  const fromPrice = useRef();
  const toPrice = useRef();
  const statusRef = useRef();

  const searchFilters = () => {
    if (fromPrice.current.value && !toPrice.current.value) {
      const data = sourceData?.current?.filter(
        (el) =>
          convertToEth(Number(el.price)) >= fromPrice.current.value &&
          Number(el.status) === Number(statusRef.current.value)
      );
      setGames(data);
      setIsOpen(false);
    }

    if (!fromPrice.current.value && toPrice.current.value) {
      const data = sourceData?.current?.filter(
        (el) =>
          convertToEth(Number(el.price)) <= toPrice.current.value &&
          Number(el.status) === Number(statusRef.current.value)
      );
      setGames(data);
      setIsOpen(false);
    }

    if (fromPrice.current.value && toPrice.current.value) {
      const data = sourceData?.current?.filter(
        (el) =>
          convertToEth(Number(el.price)) >= fromPrice.current.value &&
          convertToEth(Number(el.price)) <= toPrice.current.value &&
          Number(el.status) === Number(statusRef.current.value)
      );
      setGames(data);
      setIsOpen(false);
    }

    if (
      !fromPrice.current.value &&
      !toPrice.current.value &&
      statusRef.current.value
    ) {
      const data = sourceData?.current?.filter(
        (el) => Number(el.status) === Number(statusRef.current.value)
      );
      setGames(data);
      setIsOpen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} className={styles.wrapper}>
      <div className={styles.container}>
        <CloseSvg
          onClick={() => setIsOpen(false)}
          className={styles.closeSvg}
        />
        <h1>Filters</h1>
        <div className={styles.inputFields}>
          <div className={styles.inputWrapper}>
            <span>From:</span>
            <input
              type="number"
              step="any"
              placeholder="0.0 ETH"
              ref={fromPrice}
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <span>To:</span>
            <input
              type="number"
              step="any"
              placeholder="0.0 ETH"
              ref={toPrice}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.selectWrapper}>
          <span>Status:</span>
          <select ref={statusRef}>
            <option value={PRODUCT_STATUS.AVAILABLE}>Available</option>
            <option value={PRODUCT_STATUS.UNAVAILABLE}>Out of stock</option>
          </select>
        </div>

        <div className={styles.addButton}>
          <button
            type="button"
            className={styles.searchButton}
            onClick={searchFilters}
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
