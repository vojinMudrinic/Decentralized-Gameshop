import React from "react";
import { Link } from "react-router-dom";

import styles from "./ButtonLink.module.css";

const ButtonLink = ({ pathname, state, text }) => {
  return (
    <Link to={pathname} state={state} className={styles.container}>
      <span>{text}</span>
    </Link>
  );
};

export default ButtonLink;
