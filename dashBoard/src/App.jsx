import React from "react";
import SurveyDashBoard from "./pages/surveysDashBoard";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<SurveyDashBoard />} />
        </Routes>
      </Router>

  );
}

export default App;
