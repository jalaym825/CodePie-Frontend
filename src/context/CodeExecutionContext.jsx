// CodeExecutionContext.jsx
import { createContext } from "react";

export const CodeExecutionContext = createContext({
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
});