import CodeEditor from "./pages/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router"
import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ContestPage from "./Pages/Dashboard/ContestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/account/login" element={<LoginSignUp />} />
        <Route path="/problems/:id" element={<CodeEditor />} />
        <Route path="/" element={<MainHeader />}>
          <Route index element={<Homepage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contests/:id" element={<ContestPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;