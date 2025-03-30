import CodeEditor from "./pages/UpdatedEditor";
import { BrowserRouter as Router } from "react-router";
import { Routes, Route } from "react-router";
<<<<<<< Updated upstream

import 'prismjs/themes/prism-tomorrow.css';
=======
import CodeEditor from "./CodeEditor";
import LoginSignUp from "./Pages/LoginSignUp";
>>>>>>> Stashed changes

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/account/login" element={<LoginSignUp />} />
          <Route path="/" element={<CodeEditor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
