import * as React from "react";
const GameSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M2 18h16v-8H2v8ZM20 8v12H0V8h9V2h5V0h2v4h-5v4h9Zm-6 7h2v-2h-2v2Zm-3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-7-2h1v-1h2v1h1v2H7v1H5v-1H4v-2Z"
    />
  </svg>
);
export default GameSvg;
