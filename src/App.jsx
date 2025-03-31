import CodeEditor from "./pages/UpdatedEditor";
import { BrowserRouter as Router } from "react-router";
import { Routes, Route } from "react-router";
import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/account/login" element={<LoginSignUp />} />
          <Route path="/code" element={<CodeEditor />} />
          <Route path="/" element={<MainHeader />}>
            <Route path="" element={<Homepage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
