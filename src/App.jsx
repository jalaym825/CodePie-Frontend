import CodeEditor from "./pages/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";
import Dashboard from "./Pages/Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/account/login" element={<LoginSignUp />} />
      <Route path="/code" element={<CodeEditor />} />
      <Route path="/" element={<MainHeader />}>
        <Route index element={<Homepage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;