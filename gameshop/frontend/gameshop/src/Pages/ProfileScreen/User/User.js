import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./User.module.css";
import SerialKeySvg from "../../../svg/SerialKeySvg";
import { Context } from "../../../utils/GameShopContext";

const User = () => {
  const { contract, account } = useContext(Context);
  const [products, setProducts] = useState([]);

  const getUserProducts = useCallback(async () => {
    try {
      const products = await contract?.methods
        .getCustomerGames()
        .call({ from: account });
      setProducts(products);
    } catch (error) {
      console.error(error);
    }
  }, [contract?.methods, account]);

  const renderProducts = useMemo(() => {
    return products?.map((el, i) => (
      <div className={styles.product} key={i}>
        {el.name}
        <div className={styles.key}>
          <span>{el.key}</span>
          <SerialKeySvg />
        </div>
      </div>
    ));
  }, [products]);

  useEffect(() => {
    getUserProducts();
  }, [getUserProducts]);

  return (
    <div className={styles.container}>
      <h1>Purchased products</h1>
      <div className={styles.productWrapper}>{renderProducts}</div>
    </div>
  );
};

export default User;
