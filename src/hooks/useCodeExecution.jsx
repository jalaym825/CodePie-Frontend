import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';

const useCodeExecution = ({ code, language, selectedProblem }) => {
    const BASE_URL = 'http://172.16.103.141:2358';
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

    const executeCode = async (input) => {
        try {
            // Create submission
            const createResponse = await axios.post(`${BASE_URL}/submissions`, {
                source_code: code,
                language_id: language,
                stdin: input,
                wait: false,
            });

            const token = createResponse.data.token;

            // Poll for results
            let status;
            let pollResponse;
            let attempts = 0;
            const maxAttempts = 10;

            return new Promise((resolve, reject) => {
                const interval = setInterval(async () => {
                    attempts++;

                    try {
                        pollResponse = await axios.get(`${BASE_URL}/submissions/${token}`);
                        status = pollResponse.data.status;

                        // Check if the code has finished executing
                        if (status.id >= 3) {
                            clearInterval(interval);

                            // Format output
                            let resultOutput = '';
                            if (pollResponse.data.stdout) {
                                resultOutput += pollResponse.data.stdout;
                            }
                            if (pollResponse.data.stderr) {
                                resultOutput += pollResponse.data.stderr;
                            }
                            if (pollResponse.data.compile_output) {
                                resultOutput += pollResponse.data.compile_output;
                            }
                            if (pollResponse.data.message) {
                                resultOutput += pollResponse.data.message;
                            }

                            resultOutput = resultOutput || 'No output';

                            resolve({
                                status: status,
                                output: resultOutput,
                                time: pollResponse.data.time,
                                memory: pollResponse.data.memory
                                    ? (pollResponse.data.memory / 1024).toFixed(2)
                                    : null,
                            });
                        }
                    } catch (error) {
                        console.error('Error polling submission:', error);
                        clearInterval(interval);
                        reject(new Error('Error checking submission status'));
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error('Execution timed out'));
                    }
                }, 1000);
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

        const startTime = performance.now();

        try {
            const result = await executeCode(stdin);

            const endTime = performance.now();
            const clientExecutionTime = ((endTime - startTime) / 1000).toFixed(2);

            setIsRunning(false);

            // Set status badge
            let statusColor = 'bg-gray-500';
            let statusMessage = result.status.description;

            if (result.status.id === 3) {
                statusColor = 'bg-green-500';
                statusMessage = 'Success';
                toast.success('Code executed successfully');
            } else if (result.status.id === 4) {
                statusColor = 'bg-yellow-500';
                statusMessage = 'Wrong Answer';
                toast.warning('Wrong answer');
            } else if (result.status.id === 5) {
                statusColor = 'bg-red-500';
                statusMessage = 'Time Limit';
                toast.error('Time limit exceeded');
            } else if (result.status.id === 6) {
                statusColor = 'bg-red-500';
                statusMessage = 'Compilation Error';
                toast.error('Compilation error');
            } else {
                toast.info(result.status.description);
            }

            setStatusBadge({ label: statusMessage, color: statusColor });
            setOutput(result.output);

            // Get execution time and memory usage if available
            if (result.time) {
                setExecutionTime(result.time);
            } else {
                setExecutionTime(clientExecutionTime);
            }

            if (result.memory) {
                setMemoryUsage(result.memory);
            }

            // Add to recent submissions
            const newSubmission = {
                id: Date.now(),
                language: language,
                timestamp: new Date().toLocaleTimeString(),
                status: statusMessage,
                time: result.time || clientExecutionTime,
            };

            setRecentSubmissions((prev) => [newSubmission, ...prev].slice(0, 5));
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