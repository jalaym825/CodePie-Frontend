import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { UserContext } from "./context/UserContext";

// Pages
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NewContestPage from "./pages/Contests/NewContestPage";
import ContestDetails from "./Pages/Contest/ContestInfo"; // New merged component
import ContestLeaderBoard from "./Pages/Contest/ContestLeaderBoard";
import CodeEditor from "./pages/Editor";
import AddProblemsPage from "./pages/Problems/AddProblemsPage";
import LoadingScreen from "./components/ui/LoadingScreen";

// Layouts
import HomeLayout from "./pages/Layouts/HomeLayout";
import HeaderWrapper from "./pages/Layouts/HeaderWrapper";

function App() {
  const { userInfo } = useContext(UserContext);
  console.log(userInfo)
  const isLoading = userInfo?.id?.length === 0;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Homepage />} />
        </Route>

        <Route path="/contests" element={<HomeLayout />}>
          <Route element={<HeaderWrapper />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<NewContestPage />} />
            <Route path=":contestId">
              <Route index element={<ContestDetails />} />
              <Route path="leaderboard" element={<ContestDetails tab="leaderboard"/>} />
              <Route path="problems" element={<ContestDetails tab="problems"/>} />
              <Route path="add-problems" element={<AddProblemsPage />} />
            </Route>
          </Route>
          <Route path=":contestId/problems/:problemId" element={isLoading ? <LoadingScreen /> : <CodeEditor />} />
        </Route>
        <Route path="/problems">
          <Route index element={<h1>Problems Page</h1>} />
          <Route path="create" element={<AddProblemsPage />} />
          <Route path=":id" element={isLoading ? <LoadingScreen /> : <CodeEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;