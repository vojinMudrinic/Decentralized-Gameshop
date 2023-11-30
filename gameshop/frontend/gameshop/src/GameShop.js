import React from "react";
import { Route, Routes } from "react-router-dom";

import styles from "./GameShop.module.css";
import NavBar from "./Components/NavBar/NavBar";
import HomeScreen from "./Pages/HomeScreen/HomeScreen";
import { GameShopContextProvider } from "./utils/GameShopContext";
import ProductsScreen from "./Pages/ProductsScreen/ProductsScreen";
import ProfileScreen from "./Pages/ProfileScreen/ProfileScreen";

function GameShop() {
  return (
    <GameShopContextProvider>
      <div className={styles.wrapper}>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<HomeScreen />} />
          <Route path={"/products"} element={<ProductsScreen />} />
          <Route path={"/profile"} element={<ProfileScreen />} />
        </Routes>
      </div>
    </GameShopContextProvider>
  );
}

export default GameShop;
