import React from "react";
import styles from "./AddCard.module.css";
import PlusSvg from "../../svg/PlusSvg";

const AddCard = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <PlusSvg onClick={onClick} />
    </div>
  );
};

export default AddCard;
