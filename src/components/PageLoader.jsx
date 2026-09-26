import React from "react";
import "./PageLoader.css";

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-inner">
        <div className="loader-ring">
          <span></span>
        </div>

        <img
          src="/logo.png"
          alt="Green Hill Studio"
          className="loader-logo"
        />

        <p>GREEN HILL STUDIO</p>
        <span className="loader-loading">LOADING</span>
      </div>
    </div>
  );
}