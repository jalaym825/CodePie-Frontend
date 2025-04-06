// import CodeEditor from "./pages/Editor";
// import { BrowserRouter as Router, Routes, Route } from "react-router"
// import 'prismjs/themes/prism-tomorrow.css';
// import LoginSignUp from "./Pages/LoginSignUp";
// import Homepage from "./Pages/Homepage";
// import MainHeader from "./components/Header/MainHeader";
// import Dashboard from "./Pages/Dashboard/Dashboard";
// import NewContestPage from "./pages/Contests/NewContestPage";
// // import AddProblem from "./Pages/AddProblemsPage"
// import ContestInfo from "./pages/Contest/ContestInfo";
// // import NewContestPage from "./Pages/Contests/NewContestPage";
// import AddProblem from "./Pages/Problems/AddProblemsPage"
// import EachContestProblems from "./Pages/Problems/EachContestProblems";
// import JoinContest from "./Pages/Contests/JoinContest";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/account/login" element={<LoginSignUp />} />
//         <Route path="/" element={<MainHeader />}>
//           <Route index element={<Homepage />} />
//           <Route path="/contests">
//             <Route path="/contests/" element={<Dashboard />} />                                 //contests List page
//             <Route path="/contests/create" element={<NewContestPage />} />                 //Create Competition page
//             <Route path="/contests/:contestId/problems" element={<AddProblem />} />            //Competition details page
//             <Route path="/contests/:contestId" element={<ContestInfo />} />            //Competition details page
//             <Route path="/contests/:contestId/join" element={<JoinContest />} />      //Competition details page
//           </Route>
//         </Route>
//         <Route path="/contests">
//           <Route path="/contests/:contestId/problems/:problemId" element={<CodeEditor />} />  //Problem details page inside competition
//         </Route>
//         <Route path="/problems" >
//           <Route path="/problems/" element={<h1>Problems Page</h1>} />        //Problems List page
//           <Route path="/problems/create" element={<AddProblem />} />
//           <Route path="/problems/:id" element={<CodeEditor />} />             //Problem details page
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import CodeEditor from "./pages/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router"
import 'prismjs/themes/prism-tomorrow.css';
import LoginSignUp from "./Pages/LoginSignUp";
import Homepage from "./Pages/Homepage";
import MainHeader from "./components/Header/MainHeader";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NewContestPage from "./pages/Contests/NewContestPage";
// import AddProblem from "./Pages/AddProblemsPage"
import ContestInfo from "./pages/Contest/ContestInfo";
// import NewContestPage from "./Pages/Contests/NewContestPage";
import AddProblem from "./Pages/Problems/AddProblemsPage"
import EachContestProblems from "./Pages/Problems/EachContestProblems";
import JoinContest from "./Pages/Contests/JoinContest";
import ContestLeaderBoard from "./Pages/Contest/ContestLeaderBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/account/login" element={<LoginSignUp />} />
        <Route path="/" element={<MainHeader />}>
          <Route index element={<Homepage />} />
          <Route path="/contests">
            <Route path="/contests/" element={<Dashboard />} />                                 //contests List page
            <Route path="/contests/create" element={<NewContestPage />} />                 //Create Competition page
            <Route path="/contests/:contestId/add-problems" element={<AddProblem />} />
            <Route path="/contests/:contestId/problems" element={<EachContestProblems />} />
            <Route path="/contests/:contestId/leaderboard" element={<ContestLeaderBoard />} />        //Competition details page
            <Route path="/contests/:contestId" element={<ContestInfo />} />            //Competition details page
            <Route path="/contests/:contestId/join" element={<JoinContest />} />      //Competition details page
          </Route>
        </Route>
        <Route path="/contests">
          <Route path="/contests/:contestId/problems/:problemId" element={<CodeEditor />} />  //Problem details page inside competition
        </Route>
        <Route path="/problems">
          <Route path="/problems/" element={<h1>Problems Page</h1>} />        //Problems List page
          <Route path="/problems/create" element={<AddProblem />} />
          <Route path="/problems/:id" element={<CodeEditor />} />             //Problem details page
        </Route>
      </Routes>
    </Router>
  );
}

export default App;