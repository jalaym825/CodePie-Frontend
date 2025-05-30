// CodeExecutionContext.jsx
import { createContext } from "react";

export const CodeExecutionContext = createContext({
    contest: String,
    setContest: () => {},
    fetchContest: () => {},
    problem: String,
    setProblem: () => {},
    code: '',
    setCode: () => {},
    language: '',
    setLanguage: () => {},
    selectedProblem: {},
    setSelectedProblem: () => {},
    output: '',
    isRunning: false,
    statusBadge: { label: 'Ready', color: 'bg-green-500' },
    executionTime: null,
    memoryUsage: null,
    recentSubmissions: [],
    testResults: [],
    setTestResults: () => {},
    isTestingAll: false,
    stdin: '',
    setStdin: () => {},
    runCustomTest: () => {},
    runTestCase: () => {},
    runAllTests: () => {},
    submitSolution: () => {},
    fetchProblem: () => {},
    showResultDialog: Boolean,
    setShowResultDialog: () => {},
    loading: Boolean,
    setLoading: () => {},
    formatCode: () => {},
});