// CodeExecutionContextProvider.jsx
import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { socket } from '../lib/socket';
import { CodeExecutionContext } from './CodeExecutionContext';
import { problems } from "../helpers/editorData";
import { UserContext } from './UserContext';

export default function CodeExecutionContextProvider({ children }) {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('71');
    const [selectedProblem, setSelectedProblem] = useState(problems[0]);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [statusBadge, setStatusBadge] = useState({
        label: 'Ready',
        color: 'bg-green-500'
    });
    const [executionTime, setExecutionTime] = useState(null);
    const [memoryUsage, setMemoryUsage] = useState(null);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [isTestingAll, setIsTestingAll] = useState(false);
    const [stdin, setStdin] = useState('');

    const { userInfo } = useContext(UserContext);

    // Socket effects
    useEffect(() => {
        socket.emit('register', userInfo.id);
        const handleSubmissionResult = (data) => {
            console.log('Submission result:', data);
            
            setIsRunning(false);

            let resultOutput = '';
            if (data.stdout) resultOutput += data.stdout;
            if (data.stderr) resultOutput += data.stderr;
            if (data.compile_output) resultOutput += data.compile_output;
            if (data.message) resultOutput += data.message;

            setOutput(resultOutput || 'No output');

            let statusColor = 'bg-gray-500';
            let statusMessage = data.status.description;

            if (data.status.id === 3) {
                statusColor = 'bg-green-500';
                statusMessage = 'Success';
                toast.success('Code executed successfully');
            } else if (data.status.id === 4) {
                statusColor = 'bg-yellow-500';
                statusMessage = 'Wrong Answer';
                toast.warning('Wrong answer');
            } else if (data.status.id === 5) {
                statusColor = 'bg-red-500';
                statusMessage = 'Time Limit';
                toast.error('Time limit exceeded');
            } else if (data.status.id === 6) {
                statusColor = 'bg-red-500';
                statusMessage = 'Compilation Error';
                toast.error('Compilation error');
            } else {
                toast.info(data.status.description);
            }

            setStatusBadge({ label: statusMessage, color: statusColor });

            if (data.time) setExecutionTime(data.time);
            if (data.memory) setMemoryUsage((data.memory / 1024).toFixed(2));

            setRecentSubmissions((prev) => [
                {
                    id: Date.now(),
                    language: data.language || 'unknown',
                    timestamp: new Date().toLocaleTimeString(),
                    status: statusMessage,
                    time: data.time,
                },
                ...prev
            ].slice(0, 5));
        };

        socket.on("submissionResult", handleSubmissionResult);
        socket.on('connect', () => console.log('Connected to socket server'));

        return () => {
            socket.off("submissionResult", handleSubmissionResult);
            socket.off('connect');
        };
    }, [userInfo.id]);

    const handleFetchProblem = useCallback(async (problemId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${problemId}`, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
            // console.log('Problem fetched:', response);

            if (response.status === 200) {
                const problem = response.data.data;
                console.log('Fetched problem:', problem);
                
                setSelectedProblem(problem);
                setCode('');
                setStdin(problem.stdin || '');
                setTestResults([]);
                setOutput('');
                setExecutionTime(null);
                setMemoryUsage(null);
                setIsRunning(false);
                setStatusBadge({ label: 'Ready', color: 'bg-green-500' });
                setRecentSubmissions([]);
                setIsTestingAll(false);
            }

            return {
                status: response.status,
            };
        } catch (error) {
            console.error('Error fetching problem:', error);
            toast.error('Error fetching problem data');
        }
    }, []);

    const handleProblemChange = useCallback((problemId) => {
        const problem = problems.find((p) => p.id === problemId);
        if (problem) {
            setSelectedProblem(problem);
            setTestResults([]);
        }
    }, []);

    const executeCode = useCallback(async (input) => {
        try {
            console.log('Executing code with input:', input, 'Code:', code, 'Language:', language);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/run`, {
                problemId: "3bc05c41-14e5-42de-a983-0bb21828ab8b",
                sourceCode: code,
                languageId: language,
                input,
            }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            throw new Error(`Error submitting code: ${error.message}`);
        }
    }, [code, language]);

    const runCustomTest = useCallback(async () => {
        setIsRunning(true);
        setStatusBadge({ label: 'Processing', color: 'bg-blue-500' });
        setOutput('Running code...');
        setExecutionTime(null);
        setMemoryUsage(null);

        try {
            await executeCode(stdin);
        } catch (error) {
            setIsRunning(false);
            setStatusBadge({ label: 'Error', color: 'bg-red-500' });
            setOutput(`Error: ${error.message}`);
            toast.error(`Error running code: ${error.message}`);
        }
    }, [executeCode, stdin]);

    const runTestCase = useCallback(async (testCase, index) => {
        try {
            await executeCode(testCase.input);
        } catch (error) {
            setTestResults((prev) => {
                const newResults = [...prev];
                newResults[index] = {
                    passed: false,
                    input: testCase.input,
                    expected: testCase.output,
                    actual: 'Error: ' + error.message,
                    error: true,
                };
                return newResults;
            });
            return { passed: false, error: true };
        }
    }, [executeCode]);

    const runAllTests = useCallback(async () => {
        setIsTestingAll(true);
        setTestResults([]);

        try {
            const visibleTestCases = selectedProblem.testCases.filter(tc => !tc.isHidden);
            for (let i = 0; i < visibleTestCases.length; i++) {
                await runTestCase(visibleTestCases[i], i);
            }
        } catch (error) {
            console.log('Error running all test cases:', error);
            toast.error('Error running all test cases');
        } finally {
            setIsTestingAll(false);
        }
    }, [runTestCase, selectedProblem]);

    const submitSolution = useCallback(async () => {
        setIsTestingAll(true);
        setTestResults([]);

        try {
            const visibleTestCases = selectedProblem.testCases.filter(tc => !tc.isHidden);
            for (let i = 0; i < visibleTestCases.length; i++) {
                await runTestCase(visibleTestCases[i], i);
            }

            const hiddenTestCases = selectedProblem.testCases.filter(tc => tc.isHidden);
            for (let i = 0; i < hiddenTestCases.length; i++) {
                await runTestCase(
                    hiddenTestCases[i],
                    visibleTestCases.length + i
                );
            }
        } catch (error) {
            console.log('Error submitting solution:', error);
            toast.error('Error submitting solution');
        } finally {
            setIsTestingAll(false);
        }
    }, [runTestCase, selectedProblem]);

    const ctxValue = useMemo(() => ({
        code,
        setCode,
        language,
        setLanguage,
        selectedProblem,
        setSelectedProblem: handleProblemChange,
        output,
        isRunning,
        statusBadge,
        executionTime,
        memoryUsage,
        recentSubmissions,
        testResults,
        setTestResults,
        isTestingAll,
        stdin,
        setStdin,
        runCustomTest,
        runTestCase,
        runAllTests,
        submitSolution,
        fetchProblem: handleFetchProblem,
    }), [
        code,
        language,
        selectedProblem,
        handleProblemChange,
        output,
        isRunning,
        statusBadge,
        executionTime,
        memoryUsage,
        recentSubmissions,
        testResults,
        isTestingAll,
        stdin,
        runCustomTest,
        runTestCase,
        runAllTests,
        submitSolution,
        handleFetchProblem,
    ]);

    return (
        <CodeExecutionContext.Provider value={ctxValue}>
            {children}
        </CodeExecutionContext.Provider>
    );
}