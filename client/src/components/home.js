import React from "react";
import SearchBar from "./searchbar";
import "./css/home.css";

export default () => {
  return (
    <div className="main">
      <p className="title">
        Be a part of Orange County dance community. Connect with a mentor near you.
      </p>
      <p className="sub">Connect. Learn. Thrive.</p>
      <SearchBar className="inputSearch" />
    </div>
  );
};
