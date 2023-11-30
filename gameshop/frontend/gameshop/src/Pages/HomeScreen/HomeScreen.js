import React, { useContext } from "react";
import { Context } from "../../utils/GameShopContext";

import styles from "./HomeScreen.module.css";
import ButtonLink from "../../Components/ButtonLink/ButtonLink";
import RocketSvg from "../../svg/RocketSvg";

const HomeScreen = () => {
  const { account } = useContext(Context);
  return (
    <div className={styles.contentContainer}>
      <h1>The decentralized</h1>
      <h1>Gameshop</h1>
      <RocketSvg />
      {account ? (
        <ButtonLink
          pathname={"/products"}
          state={account}
          text={"Proceed to shop"}
        />
      ) : null}
    </div>
  );
};

export default HomeScreen;
