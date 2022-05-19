import React from "react";

import { CembooPlayer } from "./components";

import "./App.css";

const App: React.FC<{ url: string; mediaId: string }> = ({ url, mediaId }) => {
  return <CembooPlayer url={url} />;
};

export default App;
