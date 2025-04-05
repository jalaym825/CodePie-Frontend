import CodeEditor from "./pages/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router"
import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ContestPage from "./Pages/Dashboard/ContestPage";
import NewContestPage from "./pages/NewContest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/account/login" element={<LoginSignUp />} />
        <Route path="/" element={<MainHeader />}>
          <Route index element={<Homepage />} />
          <Route path="/contests">
            <Route path="/contests/" element={<Dashboard />} />                                 //contests List page
            <Route path="/contests/create" element={<NewContestPage />} />                      //Create Competition page
            <Route path="/contests/:contestId" element={<h1>Contest details</h1>} />            //Competition details page
            <Route path="/contests/:contestId/problems/:problemId" element={<CodeEditor />} />  //Problem details page inside competition
          </Route>
          {/* <Route path="/contests/:id" element={<ContestPage />} /> */}
        </Route>
        <Route path="/problems" >
          <Route path="/problems/" element={<h1>Problems Page</h1>} />        //Problems List page
          <Route path="/problems/create" element={<h1>Create Problem</h1>} /> //Create Problem page
          <Route path="/problems/:id" element={<CodeEditor />} />             //Problem details page
        </Route>
      </Routes>
    </Router>
  );
}

export default App;