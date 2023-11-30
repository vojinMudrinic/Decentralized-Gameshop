import * as React from "react";
const SearchSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 6a5 5 0 0 1 5 5m.659 5.655L21 21m-2-10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
    />
  </svg>
);
export default SearchSvg;
