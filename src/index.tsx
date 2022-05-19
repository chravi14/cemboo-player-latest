import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const playerDivs = document.querySelectorAll(".cemboo-player");

playerDivs.forEach((elem) => {
  const mediaObj = {
    url: elem.getAttribute("data-url") || "",
    mediaId: elem.getAttribute("data-mediaid") || "",
  };
  if (mediaObj && (mediaObj.url || mediaObj.mediaId)) {
    ReactDOM.render(
      <React.StrictMode>
        <App url={mediaObj.url} mediaId={mediaObj.mediaId} />
      </React.StrictMode>,
      elem
    );
  } else {
    ReactDOM.render(
      <React.StrictMode>
        <p>There is no media id or media url.</p>
      </React.StrictMode>,
      elem
    );
  }
});
