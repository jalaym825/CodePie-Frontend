import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    FileCode,
    FileText,
    Terminal,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

const SubmissionDialog = ({ submissionId, isOpen, onClose, getStatusDisplay, getBadgeClass }) => {
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTestCases, setExpandedTestCases] = useState({});

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:3000/submissions/${submissionId}`, { withCredentials: true });
                setSubmission(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch submission details:", err);
                setError("Failed to load submission details. Please try again.");
                setLoading(false);
            }
        };

        if (isOpen && submissionId) {
            fetchSubmissionDetails();
        }
    }, [submissionId, isOpen]);

    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const toggleTestCase = (testCaseId) => {
        setExpandedTestCases(prev => ({
            ...prev,
            [testCaseId]: !prev[testCaseId]
        }));
    };

    // Get correct language display name
    const getLanguageName = (languageId) => {
        const languageMap = {
            71: 'Python 3',
            62: 'Java',
            63: 'JavaScript (Node.js)',
            54: 'C++',
            50: 'C'
            // Add more language mappings as needed
        };
        return languageMap[languageId] || `Language ID: ${languageId}`;
    };

    // Calculate percentage of test cases passed
    const calculatePassPercentage = (testCases) => {
        if (!testCases || testCases.length === 0) return '0%';
        const passedCount = testCases.filter(tc => tc.passed).length;
        return `${Math.round((passedCount / testCases.length) * 100)}%`;
    };

    const getTestCaseStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'WRONG_ANSWER':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'TIME_LIMIT_EXCEEDED':
                return <Clock className="h-4 w-4 text-orange-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="!max-w-3xl max-h-[95vh] flex flex-col p-6">    
                        <DialogHeader className="flex flex-row items-center justify-between pb-4">
                    <DialogTitle className="text-xl font-bold">Submission Details</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center flex-1">
                        <Clock className="h-6 w-6 mr-2 animate-spin" />
                        <p>Loading submission details...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center flex-1 text-red-500">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        <p>{error}</p>
                    </div>
                ) : submission ? (
                    // Main content area with fixed height and scrollable
                    <div className="flex flex-col overflow-y-auto flex-1 ">
                        {/* Submission Overview */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            {/* Top row with problem, difficulty, status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Problem</h3>
                                    <p className="font-medium">{submission.problem?.title || 'Unknown Problem'}</p>
                                </div>

                                {submission.problem?.difficultyLevel && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</h3>
                                        <p className="font-medium">{submission.problem?.contest?.difficultyLevel || 'Easy'}</p>
                                    </div>
                                )}
                                {submission.problem?.contest && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contest</h3>
                                        <p className="font-medium">{submission.problem?.contest?.title || 'Unknown Contest'}</p>
                                    </div>
                                )}

                            </div>

                            {/* Middle row with points, language, contest */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                                    <Badge className={`mt-1 ${getBadgeClass(submission.status)}`}>
                                        <div className="flex items-center">
                                            {submission.status === 'ACCEPTED' ? (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            ) : submission.status === 'WRONG_ANSWER' ? (
                                                <XCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <Clock className="h-3 w-3 mr-1" />
                                            )}
                                            {getStatusDisplay(submission.status)}
                                        </div>
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</h3>
                                    <Badge variant="outline" className="mt-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                                        {getLanguageName(submission.languageId)}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Score</h3>
                                    <p className="font-medium">{submission.score} / {submission.problem?.points || '?'}</p>
                                </div>


                            </div>

                            {/* Bottom row with score, submitted at, test cases */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted At</h3>
                                    <p className="text-sm">{formatDateTime(submission.submittedAt)}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Test Cases Passed</h3>
                                    <p className="font-medium">
                                        {submission.testCaseResults?.filter(tc => tc.passed).length || 0} / {submission.testCaseResults?.length || 0}
                                        ({calculatePassPercentage(submission.testCaseResults)})
                                    </p>
                                </div>
                            </div>
                        </div>

                        
                        {/* Tabs for code, output, test cases */}
                        <Tabs defaultValue="code" className="flex-1 flex flex-col">
                            <TabsList className="w-full">
                                <TabsTrigger value="code" className="flex items-center">
                                    <FileCode className="h-4 w-4 mr-1" />
                                    Source Code
                                </TabsTrigger>
                                {submission.compilationOutput && (
                                    <TabsTrigger value="compilation" className="flex items-center">
                                        <Terminal className="h-4 w-4 mr-1" />
                                        Compilation Output
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="testcases" className="flex items-center">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Test Cases ({submission.testCaseResults?.length || 0})
                                </TabsTrigger>
                            </TabsList>

                            {/* SOURCE CODE TAB: Direct approach for handling code with scroll */}
                            <TabsContent value="code" className="mt-4">
                                <div className="border rounded-md bg-gray-50 dark:bg-gray-900 h-64 relative">
                                    <div className="absolute inset-0 overflow-auto p-4">
                                        <div style={{ minWidth: "max-content" }}>
                                            <pre className="font-mono text-sm whitespace-pre">{submission.sourceCode}</pre>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* COMPILATION OUTPUT: Using same direct approach */}
                            {submission.compilationOutput && (
                                <TabsContent value="compilation" className="mt-4">
                                    <div className="border rounded-md bg-gray-50 dark:bg-gray-900 h-64 relative">
                                        <div className="absolute inset-0 overflow-auto p-4">
                                            <div style={{ minWidth: "max-content" }}>
                                                <pre className="font-mono text-sm whitespace-pre">{submission.compilationOutput}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            )}

                            {/* TEST CASES TAB */}
                            <TabsContent value="testcases" className="mt-4">
                                <div className="border rounded-md h-64 overflow-auto">
                                    {submission.testCaseResults && submission.testCaseResults.length > 0 ? (
                                        <div className="space-y-2 p-2">
                                            {submission.testCaseResults.map((testCase, i) => (
                                                <div
                                                    key={testCase.id}
                                                    className="border rounded-md bg-gray-50 dark:bg-gray-800"
                                                >
                                                    <div
                                                        className="flex items-center justify-between p-3 cursor-pointer"
                                                        onClick={() => toggleTestCase(testCase.id)}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            {getTestCaseStatusIcon(testCase.status)}
                                                            <span className="font-medium">
                                                                Test Case {i + 1} {testCase.testCase.input === "Hidden" ? "(Hidden)" : ""}
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                                    {testCase.passed ? 'Passed' : 'Failed'}
                                                                    {testCase.testCase.points ? ` (${testCase.testCase.points} points)` : ''}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {expandedTestCases[testCase.id] ?
                                                                <ChevronDown className="h-4 w-4" /> :
                                                                <ChevronRight className="h-4 w-4" />
                                                            }
                                                        </div>
                                                    </div>

                                                    {expandedTestCases[testCase.id] && (
                                                        <div className="p-3 border-t">
                                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                                <div>
                                                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
                                                                    <Badge className={getBadgeClass(testCase.status)}>
                                                                        {getStatusDisplay(testCase.status)}
                                                                    </Badge>
                                                                </div>
                                                                {(testCase.executionTime !== null || testCase.memoryUsed !== null) && (
                                                                    <div>
                                                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Performance</h4>
                                                                        <div className="text-sm">
                                                                            {testCase.executionTime !== null ? `${testCase.executionTime} ms` : 'N/A'}
                                                                            {testCase.memoryUsed !== null ? ` / ${testCase.memoryUsed} KB` : ''}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {testCase.testCase.input !== "Hidden" && (
                                                                <>
                                                                    <div className="mb-2">
                                                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input</h4>
                                                                        <div className="bg-gray-100 dark:bg-gray-900 rounded max-h-20 relative">
                                                                            <div className="p-2">
                                                                                <div style={{ minWidth: "max-content" }}>
                                                                                    <pre className="font-mono text-xs whitespace-pre">{testCase.testCase.input}</pre>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Output</h4>
                                                                        <div className="bg-gray-100 dark:bg-gray-900 rounded max-h-20 relative">
                                                                            <div className="p-2">
                                                                                <div style={{ minWidth: "max-content" }}>
                                                                                    <pre className="font-mono text-xs whitespace-pre">{testCase.testCase.output}</pre>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {testCase.stdout && (
                                                                <div className="mb-1">
                                                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Your Output</h4>
                                                                    <div className="bg-gray-100 dark:bg-gray-900 rounded max-h-20 relative">
                                                                        <div className="p-2">
                                                                            <div style={{ minWidth: "max-content" }}>
                                                                                <pre className="font-mono text-xs whitespace-pre">{testCase.stdout}</pre>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {testCase.stderr && (
                                                                <div>
                                                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Error Output</h4>
                                                                    <div className="bg-gray-100 dark:bg-gray-900 rounded max-h-20 relative">
                                                                        <div className="p-2">
                                                                            <div style={{ minWidth: "max-content" }}>
                                                                                <pre className="font-mono text-xs whitespace-pre text-red-600 dark:text-red-400">{testCase.stderr}</pre>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {testCase.testCase.explanation && (
                                                                <div className="mt-2">
                                                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Explanation</h4>
                                                                    <div className="text-sm">{testCase.testCase.explanation}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
                                            <AlertTriangle className="h-8 w-8 mb-2" />
                                            <p>No test case results available</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Fixed position close button for better visibility */}
                        <div className="mt-6 flex justify-end">
                            <Button onClick={onClose} className="w-24">Close</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        <p>No submission data found</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDialog;