import CodeEditor from "./pages/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router"
// import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NewContestPage from "./pages/Contests/NewContestPage";
import ContestInfo from "./pages/Contest/ContestInfo";
import JoinContest from "./Pages/Contests/JoinContest";
import ContestLeaderBoard from "./Pages/Contest/ContestLeaderBoard";
import React, { useContext } from "react";
import { UserContext } from "./context/UserContext";
import LoadingScreen from "./components/ui/LoadingScreen";
import AuthInitializer from "./pages/Layouts/AuthInitializer";
import AddProblemsPage from "./pages/Problems/AddProblemsPage";
import HomeLayout from "./pages/Layouts/HomeLayout";

function App() {
  const { userInfo } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/account/login" element={<LoginSignUp />} />
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Homepage />}/>
          <Route path="/contests">
            <Route path="/contests/" element={<Dashboard />} />                                 //contests List page
            <Route path="/contests/create" element={<NewContestPage />} />                 //Create Competition page
            <Route path="/contests/:contestId/add-problems" element={<AddProblemsPage />} />
            {/* <Route path="/contests/:contestId/problems" element={<EachContestProblems />} /> */}
            <Route path="/contests/:contestId/leaderboard" element={<ContestLeaderBoard />} />        //Competition details page
            <Route path="/contests/:contestId/problems" element={<ContestInfo />} />            //Competition details page
            <Route path="/contests/:contestId" element={<JoinContest />} />      //Competition details page
          </Route>
        </Route>
        <Route path="/contests">
          <Route path="/contests/:contestId/problems/:problemId" element={userInfo?.id?.length === 0 ? <LoadingScreen /> : <CodeEditor />} />  //Problem details page inside competition
        </Route>
        <Route path="/problems">
          <Route path="/problems/" element={<h1>Problems Page</h1>} />        //Problems List page
          <Route path="/problems/create" element={<AddProblemsPage />} />
          <Route path="/problems/:id" element={<CodeEditor />} />             //Problem details page
        </Route>
      </Routes>
    </Router>
  );
}

export default App;