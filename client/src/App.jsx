import React from "react";
import Surveys from "./pages/survey"


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<Surveys />} />
     
        </Routes>
      </Router>

  );
}

export default App;
