import React from "react";
import Surveys from "./pages/survey";
import Thanks from "./pages/thanks";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<Surveys />} />
          <Route path="/thanks" element={<Thanks />} />
        </Routes>
      </Router>

  );
}

export default App;
