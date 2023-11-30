import { useContext, useState } from "react";
import ProfileSvg from "../../svg/ProfileSvg";
import styles from "./NavBar.module.css";
import { Context } from "../../utils/GameShopContext";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const { pathname } = location;
  const { account, fetchData } = useContext(Context);
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.container}>
      {!account ? (
        <button className={styles.btn} onClick={fetchData}>
          <p>Connect wallet</p>
        </button>
      ) : (
        <div className={styles.profileInfo} onClick={() => setOpen(!open)}>
          <ProfileSvg />
          {`Connected: ${account.substring(0, 6)}...${account.substring(38)}`}
          <div
            className={[styles.navLinks, open ? styles.opened : ""].join(" ")}
          >
            <Link
              className={[
                styles.link,
                pathname === "/" ? styles.active : "",
              ].join(" ")}
              to={"/"}
            >
              Home
            </Link>
            <Link
              className={[
                styles.link,
                pathname === "/products" ? styles.active : "",
              ].join(" ")}
              to={"/products"}
              state={account}
            >
              Products
            </Link>
            <Link
              className={[
                styles.link,
                pathname === "/profile" ? styles.active : "",
              ].join(" ")}
              to={"/profile"}
              state={account}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
