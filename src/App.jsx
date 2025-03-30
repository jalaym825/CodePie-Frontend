import { BrowserRouter as Router } from "react-router";
import { Routes, Route } from "react-router";
import CodeEditor from "./CodeEditor";

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
