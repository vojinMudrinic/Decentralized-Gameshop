import React from "react";
import styles from "./ProductCard.module.css";
import GameSvg from "../../svg/GameSvg";
import { convertToEth } from "../../utils/helpers";
import UnavailableSvg from "../../svg/UnavailableSvg";
import EtherLogoSvg from "../../svg/EtherLogoSvg";
import SerialKeySvg from "../../svg/SerialKeySvg";

const ProductCard = ({ data, onClick = () => {}, canEdit = false }) => {
  const { name, keys, price } = data || {};
  const convertedPrice = convertToEth(Number(price));

  return (
    <div
      className={[
        styles.container,
        Number(keys) <= 0 ? styles.unavailable : "",
      ].join(" ")}
      onClick={() =>
        Number(keys) > 0 ? onClick(data) : canEdit ? onClick(data) : () => {}
      }
    >
      <span className={styles.name}>{name}</span>
      {Number(keys) > 0 ? <GameSvg /> : <UnavailableSvg />}
      <div className={styles.info}>
        <div className={styles.valueWrapper}>
          <EtherLogoSvg />
          <span>{convertedPrice}</span>
        </div>
        <div className={styles.valueWrapper}>
          <SerialKeySvg />
          <span>{Number(keys) > 0 ? Number(keys) : "Out of stock"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
