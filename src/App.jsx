import CodeEditor from "./pages/UpdatedEditor";
import { BrowserRouter as Router } from "react-router";
import { Routes, Route } from "react-router";

import 'prismjs/themes/prism-tomorrow.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CodeEditor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
