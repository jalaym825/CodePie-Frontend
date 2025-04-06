// CodeExecutionContextProvider.jsx
import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { socket } from '../lib/socket';
import { CodeExecutionContext } from './CodeExecutionContext';
// import { problems } from "../helpers/editorData";
import { UserContext } from './UserContext';
import { EditorSettingsContext } from './EditorSettingsContext';

export default function CodeExecutionContextProvider({ children }) {
    const [code, setCode] = useState('');
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [contest, setContest] = useState(null);
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

    const [showResultDialog, setShowResultDialog] = useState(false);

    const { userInfo } = useContext(UserContext);
    const { language } = useContext(EditorSettingsContext);

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

            if (data.testCaseId === "") return; // Ignore empty test case ID

            if (data.status === "ACCEPTED") {
                statusColor = 'bg-green-500';
                statusMessage = 'Success';
                toast.success('Code executed successfully');
            } else if (data.status === "WRONG_ANSWER") {
                statusColor = 'bg-yellow-500';
                statusMessage = 'Wrong Answer';
                toast.warning('Wrong answer');
            } else if (data.status === "TIME_LIMIT_EXCEEDED") {
                statusColor = 'bg-red-500';
                statusMessage = 'Time Limit';
                toast.error('Time limit exceeded');
            } else if (data.status === "COMPILATION_ERROR") {
                statusColor = 'bg-red-500';
                statusMessage = 'Compilation Error';
                toast.error('Compilation error');
            } else {
                toast.info(data.message || 'Unknown error');
            }

            setStatusBadge({ label: statusMessage, color: statusColor });

            if (data.time) setExecutionTime(data.time);
            if (data.memory) setMemoryUsage((data.memory / 1024).toFixed(2));

            //Add the function here which adds the test case result to the list.
            setTestResults(prev => [...prev, {
                ...data,
                testCaseId: data.testCaseId,
                status: data.status,
                time: data.time
            }]);
            //

            setRecentSubmissions((prev) => [
                {
                    id: Date.now(),
                    language: data.languageId || 'unknown',
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

    const handleFetchContest = useCallback(async (contestId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/contests/${contestId}`, { userId: userInfo.id }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            // console.log('Problem fetched:', response);

            if (response.status === 200) {
                const contest = response.data.data;
                console.log('Fetched contest:', contest);
                setContest(contest);
            }

            return {
                status: response.status,
                isJoined: response.data.data.isJoined,
            };
        } catch (error) {
            console.error('Error fetching contest:', error);
            toast.error('Error fetching contest data');
        }
    }, [userInfo]);

    // const handleProblemChange = useCallback((problemId) => {
    //     const problem = problems.find((p) => p.id === problemId);
    //     if (problem) {
    //         setSelectedProblem(problem);
    //         setTestResults([]);
    //     }
    // }, []);

    const executeCode = useCallback(async (input, expectedOutput = '', testCaseId = '') => {
        // you can use expectedOutput later if needed
        try {
            console.log('Executing code with input:', input, 'Expected Output:', expectedOutput);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/run`, {
                problemId: selectedProblem.id,
                sourceCode: code,
                languageId: language.id,
                input,
                testCaseId,
                output: expectedOutput, // optional: include this in the API call if needed
            }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            throw new Error(`Error submitting code: ${error.message}`);
        }
    }, [code, language, selectedProblem]);


    const runCustomTest = useCallback(async () => {
        setIsRunning(true);
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
        setStatusBadge({ label: 'Processing', color: 'bg-blue-500' });
        try {
            await executeCode(testCase.input, testCase.output, testCase.id);
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
            console.log('Submitting solution:', {
                problemId: selectedProblem.id,
                sourceCode: code,
                languageId: language.id,
            });
            // setIsRunning(true);
            setStatusBadge({ label: 'Processing', color: 'bg-blue-500' });

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/`, {
                problemId: selectedProblem.id,
                sourceCode: code,
                languageId: language.id,
            }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            })
            if (res.status === 201) {
                setShowResultDialog(true);
                toast.success('Solution submitted successfully!');
            }
            console.log('Submission response:', res.data);
        } catch (error) {
            console.log('Error submitting solution:', error);
            toast.error('Error submitting solution');
        } finally {
            setIsTestingAll(false);
        }
    }, [selectedProblem, code, language]);

    const ctxValue = useMemo(() => ({
        contest,
        setContest,
        fetchContest: handleFetchContest,
        problems,
        setProblems,
        code,
        setCode,
        selectedProblem,
        // setSelectedProblem: handleProblemChange,
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
        showResultDialog,
        setShowResultDialog,
    }), [
        contest,
        setContest,
        handleFetchContest,
        problems,
        setProblems,
        code,
        selectedProblem,
        // handleProblemChange,
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
        showResultDialog,
        setShowResultDialog,
    ]);

    return (
        <CodeExecutionContext.Provider value={ctxValue}>
            {children}
        </CodeExecutionContext.Provider>
    );
}