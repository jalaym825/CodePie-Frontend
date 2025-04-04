import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';
import { socket } from '../lib/socket';

const useCodeExecution = ({ code, language, selectedProblem }) => {
    const BASE_URL = 'http://172.16.102.239:2358';
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

    useEffect(() => {
        socket.emit('register', "xyz");
        socket.on("submissionResult", (data) => {
            console.log("Submission result received:", data);
            
            // Set running status to false
            setIsRunning(false);
            
            // Format output
            let resultOutput = '';
            if (data.stdout) {
                resultOutput += data.stdout;
            }
            if (data.stderr) {
                resultOutput += data.stderr;
            }
            if (data.compile_output) {
                resultOutput += data.compile_output;
            }
            if (data.message) {
                resultOutput += data.message;
            }
            
            resultOutput = resultOutput || 'No output';
            setOutput(resultOutput);
            
            // Set status badge based on status id
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
            
            // Set execution time and memory usage
            if (data.time) {
                setExecutionTime(data.time);
            }
            
            if (data.memory) {
                setMemoryUsage(data.memory ? (data.memory / 1024).toFixed(2) : null);
            }
            
            // Add to recent submissions
            const newSubmission = {
                id: Date.now(),
                language: language,
                timestamp: new Date().toLocaleTimeString(),
                status: statusMessage,
                time: data.time,
            };
            
            setRecentSubmissions((prev) => [newSubmission, ...prev].slice(0, 5));
        });        socket.on('connect', () => {
            console.log('Connected to the socket server');
        });
    }, [])

    const executeCode = async (input) => {
        try {
            // Create submission
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/run`, {
                problemId: "3e4a401f-1b77-45b5-a2a8-6a2e64f8daaa",
                sourceCode: code,
                languageId: language,
                input,
                output
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
        } catch (error) {
            console.error('Error submitting code:', error);
            throw new Error(`Error submitting code: ${error.message}`);
        }
    };

    const runCustomTest = async () => {
        setIsRunning(true);
        setStatusBadge({ label: 'Processing', color: 'bg-blue-500' });
        setOutput('Running code...');
        setExecutionTime(null);
        setMemoryUsage(null);
    
        try {
            await executeCode(stdin);
        } catch (error) {
            console.error('Error running code:', error);
            setIsRunning(false);
            setStatusBadge({ label: 'Error', color: 'bg-red-500' });
            setOutput(`Error: ${error.message}`);
            toast.error(`Error running code: ${error.message}`);
        }
    };

    const runTestCase = async (testCase, index) => {
        try {
            const result = await executeCode(testCase.input);

            // Compare output with expected output
            const normalizedActual = result.output.trim();
            const normalizedExpected = testCase.output.trim();
            const passed = normalizedActual === normalizedExpected;

            // Update test results
            setTestResults((prev) => {
                const newResults = [...prev];
                newResults[index] = {
                    passed,
                    input: testCase.input,
                    expected: testCase.output,
                    actual: result.output,
                    time: result.time,
                    memory: result.memory,
                    status: result.status,
                };
                return newResults;
            });

            return { passed, result };
        } catch (error) {
            console.error('Error running test case:', error);

            // Update test results with error
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
    };

    const runAllTests = async () => {
        setIsTestingAll(true);
        setTestResults([]);

        try {
            let allPassed = true;
            const visibleTestCases = selectedProblem.testCases.filter(
                (tc) => !tc.isHidden,
            );

            // Run visible test cases one by one
            for (let i = 0; i < visibleTestCases.length; i++) {
                const { passed } = await runTestCase(visibleTestCases[i], i);
                if (!passed) allPassed = false;
            }

            if (allPassed) {
                toast.success('All test cases passed!');
            } else {
                toast.error('Some test cases failed');
            }
        } catch (error) {
            console.error('Error running all tests:', error);
            toast.error('Error running all test cases');
        } finally {
            setIsTestingAll(false);
        }
    };

    const submitSolution = async () => {
        setIsTestingAll(true);
        setTestResults([]);

        try {
            let allPassed = true;

            // First run visible test cases
            const visibleTestCases = selectedProblem.testCases.filter(
                (tc) => !tc.isHidden,
            );
            for (let i = 0; i < visibleTestCases.length; i++) {
                const { passed } = await runTestCase(visibleTestCases[i], i);
                if (!passed) allPassed = false;
            }

            // If visible tests pass, run hidden test cases
            if (allPassed) {
                const hiddenTestCases = selectedProblem.testCases.filter(
                    (tc) => tc.isHidden,
                );
                let hiddenPassed = true;

                for (let i = 0; i < hiddenTestCases.length; i++) {
                    const { passed } = await runTestCase(
                        hiddenTestCases[i],
                        visibleTestCases.length + i,
                    );
                    if (!passed) hiddenPassed = false;
                }

                if (hiddenPassed) {
                    toast.success(
                        'All test cases passed! Solution submitted successfully.',
                    );
                } else {
                    toast.error('Some hidden test cases failed');
                }
            } else {
                toast.error('Some test cases failed');
            }
        } catch (error) {
            console.error('Error submitting solution:', error);
            toast.error('Error submitting solution');
        } finally {
            setIsTestingAll(false);
        }
    };

    return {
        output,
        isRunning,
        statusBadge,
        executionTime,
        memoryUsage,
        recentSubmissions,
        testResults,
        isTestingAll,
        stdin,
        setStdin,
        runCustomTest,
        runTestCase,
        runAllTests,
        submitSolution,
    };
};

export default useCodeExecution;