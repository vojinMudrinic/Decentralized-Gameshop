import * as React from "react";
const UnavailableSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5.636 5.636a9 9 0 1 0 12.728 12.728M5.636 5.636a9 9 0 1 1 12.728 12.728M5.636 5.636l12.728 12.728"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default UnavailableSvg;
