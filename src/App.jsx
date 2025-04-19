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
import AuthInitializer from "./pages/Layouts/AuthInitializer";

function App() {
  const { userInfo } = useContext(UserContext);
  const isLoading = userInfo?.id?.length === 0;

  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginSignUp />} />
        
        {/* Main Application with Header */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Homepage />} />
          
          {/* Contests Section */}
          <Route path="/contests" element={<HeaderWrapper />}>
            {/* Contest List */}
            <Route index element={<Dashboard />} />
            
            {/* Create New Contest (Admin only) */}
            <Route path="create" element={<NewContestPage />} />
            
            {/* Contest Specific Routes */}
            <Route path=":contestId">
              {/* Contest Details Page - Shows overview, problems, and join button */}
              <Route index element={<ContestDetails />} />
              
              {/* Contest Leaderboard */}
              <Route path="leaderboard" element={<ContestLeaderBoard />} />
              
              {/* Individual Problem Solving */}
              <Route path="problems/:problemId" element={isLoading ? <LoadingScreen /> : <CodeEditor />} />
              
              {/* Add Problems to Contest (Admin only) */}
              <Route path="add-problems" element={<AddProblemsPage />} />
            </Route>
          </Route>
          
          {/* Independent Problems Section */}
          <Route path="/problems" element={<HeaderWrapper />}>
            {/* Problems List */}
            <Route index element={<h1>Problems Page</h1>} />
            
            {/* Create New Problem (Admin only) */}
            <Route path="create" element={<AddProblemsPage />} />
            
            {/* Individual Problem Solving */}
            <Route path=":id" element={isLoading ? <LoadingScreen /> : <CodeEditor />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;