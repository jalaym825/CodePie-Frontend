import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    ChevronRight,
    Loader2,
    Server
} from 'lucide-react';
import { formatDateTime } from './HistoryPanel';
import { socket } from '@/lib/socket';

const SubmissionDetails = ({ submissionId, onClose, getStatusDisplay, getBadgeClass, isNewSubmission = false, submissionData = null , problemDetails = null, testResultsData = null, newSubmissionLanguageName = null, sourceCode = null }) => {
    const [submission, setSubmission] = useState(submissionData);
    const [loading, setLoading] = useState(!submissionData && !isNewSubmission && !!submissionId); // Loading if fetching old submission initially
    const [error, setError] = useState(null);
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    // For new submissions, determine processing state based on testResultsData
    const [isProcessingNew, setIsProcessingNew] = useState(isNewSubmission && (!testResultsData || testResultsData.some(tc => tc.status === 'IN_QUEUE' || tc.status === 'PROCESSING')));

    // Fetch full submission details for previous submissions
    useEffect(() => {
        if (!isNewSubmission && submissionId) {
            const fetchSubmissionDetails = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/${submissionId}`, { withCredentials: true });
                    setSubmission(response.data.data);
                    setLoading(false);
                    // Determine processing state for previous submissions based on fetched status
                    setIsProcessingNew(response.data.data.status === 'PROCESSING' || response.data.data.status === 'IN_QUEUE');
                } catch (err) {
                    console.error("Failed to fetch submission details:", err);
                    setError("Failed to load submission details. Please try again.");
                    setLoading(false);
                }
            };
            fetchSubmissionDetails();
        } else if (isNewSubmission && submissionData) {
             // If it's a new submission and we have initial submissionData, use it
            setSubmission(submissionData);
            setLoading(false);
        } else if (!submissionId && !isNewSubmission) {
             // Not a new submission and no submissionId provided - this shouldn't happen if navigating correctly
             setError('Invalid submission details provided.');
             setLoading(false);
        }
         // When isNewSubmission becomes false (e.g., switching tabs), clear new submission specific states if necessary
         if (!isNewSubmission && (problemDetails || testResultsData)) {
             // Optionally clear states related to new submissions if this component instance is reused
             // for a previous submission. Depending on component lifecycle, this might not be necessary.
             // console.log('Switching from new to previous submission view');
             // setSubmission(null); // This would trigger fetching the old submission
             // setIsProcessingNew(false);
         }
    }, [submissionId, submissionData, isNewSubmission]); // Removed testResultsData and problemDetails from dependency array to avoid unnecessary fetches

    // Socket effect for real-time updates (primarily for new submissions)
    useEffect(() => {
        // Only listen for new submissions and if submissionData (containing the ID) is available
        if (!isNewSubmission || !submissionData?.id) return;

        const handleTestCaseResult = (data) => {
             // Only process if the result belongs to the currently viewed new submission
            if (data.submissionId === submissionData.id) {
                // This component relies on the parent (CodeExecutionContextProvider) to update testResultsData.
                // This effect is mainly for debugging or potentially triggering a state update
                // if TestResultsData was managed locally. As testResultsData is a prop, we re-render when it changes.
                console.log('Socket event received for current new submission', data);
                 // Re-evaluate processing state based on the updated testResultsData prop (happens on re-render)
            }
        };

        socket.on('testCaseResult', handleTestCaseResult);

        return () => {
            socket.off('testCaseResult', handleTestCaseResult);
        };
    }, [isNewSubmission, submissionData?.id]);

    const getLanguageName = (languageId) => {
        const languageMap = {
            71: 'Python 3',
            62: 'Java',
            63: 'JavaScript (Node.js)',
            54: 'C++',
            50: 'C'
        };
        return languageMap[languageId] || `Language ID: ${languageId}`;
    };

    const calculatePassPercentage = (testCases) => {
        if (!testCases || testCases.length === 0) return '0%';
        // Use testCaseResults for calculation
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
            case 'PROCESSING':
            case 'IN_QUEUE':
                 return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
            case 'RUNTIME_ERROR':
                 return <AlertTriangle className="h-4 w-4 text-purple-500" />;
            case 'COMPILATION_ERROR':
                 return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

     // --- Loading, Error, No Data States ---
     if (loading) {
         return (
             <div className="flex items-center justify-center h-full">
                 <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                 <p>Loading submission details...</p>
             </div>
         );
     }

     if (error) {
         return (
             <div className="flex items-center justify-center h-full text-red-500">
                 <AlertTriangle className="h-6 w-6 mr-2" />
                 <p>{error}</p>
             </div>
         );
     }

     // If it's a new submission, we need problemDetails and testResultsData
     if (isNewSubmission && (!problemDetails || testResultsData === null)) {
          return (
              <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                  <p>Waiting for submission results...</p>
              </div>
          );
      }

     // If it's an old submission, we need the fetched submission object
     if (!isNewSubmission && !submission) {
         return (
             <div className="flex items-center justify-center h-full">
                 <AlertTriangle className="h-6 w-6 mr-2" />
                 <p>No submission data found for this ID.</p>
             </div>
         );
     }


    // --- Render Logic ---

    // Render logic for New Submissions (using props)
    if (isNewSubmission && problemDetails && testResultsData !== null) { // Ensure we have the necessary data

        // Derive status and progress directly from testResultsData for new submissions
        const totalTests = problemDetails.testCases.filter(tc => tc.isHidden).length;
        const completedTests = testResultsData.length; // Number of results received so far
        const passedTests = testResultsData.filter(res => res?.status === "ACCEPTED").length;

        const isSubmissionComplete = completedTests === totalTests && totalTests > 0; // Check if all expected results are in

        const isSubmissionSuccessful = isSubmissionComplete && passedTests === totalTests;

         // Determine overall status for the new submission view based on current testResultsData
         let overallStatus = 'PROCESSING'; // Default to processing
         if (isSubmissionComplete) {
             if (isSubmissionSuccessful) {
                 overallStatus = 'ACCEPTED';
             } else if (testResultsData.some(tc => tc.status === 'COMPILATION_ERROR')) {
                 overallStatus = 'COMPILATION_ERROR';
             } else if (testResultsData.some(tc => tc.status === 'RUNTIME_ERROR')) {
                  overallStatus = 'RUNTIME_ERROR';
             } else if (testResultsData.some(tc => tc.status === 'TIME_LIMIT_EXCEEDED')) {
                  overallStatus = 'TIME_LIMIT_EXCEEDED';
             } else {
                 overallStatus = 'WRONG_ANSWER';
             }
         } else if (testResultsData.some(tc => tc.status === 'COMPILATION_ERROR')) {
              overallStatus = 'COMPILATION_ERROR'; // Show compilation error immediately if any test case has it
         } else if (testResultsData.some(tc => tc.status === 'RUNTIME_ERROR')) {
              overallStatus = 'RUNTIME_ERROR'; // Show runtime error immediately if any test case has it
         } else if (testResultsData.some(tc => tc.status === 'TIME_LIMIT_EXCEEDED')) {
             overallStatus = 'TIME_LIMIT_EXCEEDED'; // Show time limit exceeded immediately if any test case has it
         } else if (testResultsData.length > 0) {
              overallStatus = 'PROCESSING'; // If some results are in but not all, and no errors, it's still processing
         }

        const getStatusColor = (status) => {
             if (!status) return "bg-gray-100";
             switch (status) {
                 case "ACCEPTED" : return "bg-green-100 border-green-300";
                 case "WRONG_ANSWER": return "bg-red-100 border-red-300";
                 case "TIME_LIMIT_EXCEEDED": return "bg-yellow-100 border-yellow-300";
                 case "COMPILATION_ERROR": return "bg-orange-100 border-orange-300";
                 case "RUNTIME_ERROR": return "bg-pink-100 border-pink-300";
                 default: return "bg-gray-100 border-gray-300";
             }
         };

         const getIconForOverallStatus = (status) => {
              switch (status) {
                 case "ACCEPTED": return <CheckCircle className="text-green-600 mr-2" size={18} />;
                 case "WRONG_ANSWER": return <XCircle className="text-red-600 mr-2" size={18} />;
                 case "TIME_LIMIT_EXCEEDED": return <Clock className="text-yellow-600 mr-2" size={18} />;
                 case "COMPILATION_ERROR": return <AlertTriangle className="text-orange-600 mr-2" size={18} />;
                 case "RUNTIME_ERROR": return <AlertTriangle className="text-pink-600 mr-2" size={18} />;
                 case "PROCESSING":
                 case "IN_QUEUE": return <Loader2 className="animate-spin text-blue-400 mr-2" size={18} />;
                 default: return <AlertTriangle className="text-gray-600 mr-2" size={18} />;
             }
         }

        return (
            <div className="h-full flex flex-col p-2 sm:p-4">
                {/* New Submission Summary Card (like TestResultDialog) */}
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm mb-4">
                     <h3 className="font-semibold text-blue-800 mb-2">Submission Summary</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="flex flex-col">
                             <span className="text-sm text-gray-500">Problem</span>
                             <span className="font-medium text-blue-700 truncate">{problemDetails.title || 'Unknown Problem'}</span>
                         </div>
                          <div className="flex flex-col">
                             <span className="text-sm text-gray-500">Language</span>
                             <span className="font-medium text-blue-700">{newSubmissionLanguageName || 'Unknown'}</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-sm text-gray-500">Status</span>
                              <span className={`font-medium flex items-center ${overallStatus === 'ACCEPTED' ? "text-green-600" : overallStatus.includes('ERROR') || overallStatus === 'WRONG_ANSWER' || overallStatus === 'TIME_LIMIT_EXCEEDED' ? "text-red-600" : "text-blue-600"}`}>
                                 {getIconForOverallStatus(overallStatus)}
                                 {getStatusDisplay(overallStatus)}
                             </span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-sm text-gray-500">Passed Tests</span>
                             <span className="font-medium text-blue-700">{passedTests}/{totalTests} Hidden tests</span>
                         </div>
                         <div className="flex flex-col col-span-2">
                             <span className="text-sm text-gray-500">Progress</span>
                             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                 <div 
                                     className={`h-2.5 rounded-full ${isSubmissionComplete ? (isSubmissionSuccessful ? "bg-green-600" : "bg-red-600") : "bg-blue-600"}`} 
                                     style={{ width: `${(completedTests / totalTests) * 100}%` }} // Use completedTests here
                                 ></div>
                             </div>
                         </div>
                          {/* Display overall time and memory for new submissions if available */}
                          {(isSubmissionComplete || testResultsData.length > 0) && ( // Show metrics if complete or at least one result is in
                               <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                   <div className="flex flex-col">
                                       <span className="text-sm text-gray-500">Execution Time</span>
                                       <span className="text-sm sm:text-base font-medium">{Math.max(...testResultsData.map(r => r.time || 0))} ms</span>
                                   </div>
                                    <div className="flex flex-col">
                                       <span className="text-sm text-gray-500">Memory Usage</span>
                                       <span className="text-sm sm:text-base font-medium">{(Math.max(...testResultsData.map(r => r.memoryUsed || 0))/1024).toFixed(1)} MB</span>
                                   </div>
                                </div>
                           )}
                     </div>
                 </div>

                {/* New Submission Test Cases Grid (like TestResultDialog) */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] pr-2 p-[4px] mb-4">
                     {/* Render test cases from testResultsData for new submissions */}
                     {problemDetails.testCases.filter(tc => tc.isHidden).map((testCaseDefinition, index) => {
                         const result = testResultsData.find((res) => res.testCaseId === testCaseDefinition.id);
                         return (
                             <div
                                 key={testCaseDefinition.id}
                                 className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all hover:shadow-md 
                                 ${getStatusColor(result?.status)} ${selectedTestCase === testCaseDefinition.id ? "ring-2 ring-blue-400" : ""}`}
                                 onClick={() => {
                                     // Only allow selecting if result is available and not processing/queued
                                     if (result && result.status !== 'PROCESSING' && result.status !== 'IN_QUEUE') {
                                          setSelectedTestCase(testCaseDefinition.id === selectedTestCase ? null : testCaseDefinition.id);
                                     }
                                 }}
                             >
                                 <div className="flex justify-between">
                                     <div className="font-medium">Test Case {index + 1}</div>
                                 </div>
                                 
                                 <div className="flex items-center gap-2 mt-2">
                                     {getTestCaseStatusIcon(result?.status)}
                                     <span className="text-sm text-gray-700 truncate">
                                         {result ? getStatusDisplay(result.status) : "Pending"}
                                     </span>
                                 </div>
                                 
                                 {result && result.status !== 'PROCESSING' && result.status !== 'IN_QUEUE' && (
                                     <div className="text-xs flex flex-wrap items-center gap-2 mt-2 text-gray-500">
                                         <Clock size={14} className="mr-1 flex-shrink-0" />
                                         {result.time}s
                                     </div>
                                 )}
                                  {result && result.status !== 'PROCESSING' && result.status !== 'IN_QUEUE' && result.memory && (
                                      <div className="text-xs flex flex-wrap items-center gap-2 mt-2 text-gray-500">
                                          <Server size={14} className="mr-1 flex-shrink-0" />
                                          {(result.memory/1024).toFixed(1)} MB
                                      </div>
                                  )}
                             </div>
                         );
                     })}
                 </div>

                {/* New Submission Detail Section (like TestResultDialog) */}
                 {selectedTestCase && problemDetails && testResultsData && (
                    <div className="border-t pt-3">
                        <h3 className="font-medium text-gray-700 mb-2">Test Case Details</h3>
                        
                        {(() => {
                             const testCaseDefinition = problemDetails.testCases.find(tc => tc.id === selectedTestCase);
                            const result = testResultsData.find(res => res.testCaseId === selectedTestCase);
                            
                            if (!testCaseDefinition || !result) return <div>Details not found</div>;
                            
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {testCaseDefinition.input !== "Hidden" && (
                                        <>
                                            <div className="border rounded-lg p-3 bg-gray-50">
                                                <h4 className="text-sm font-medium text-gray-600 mb-1">Input</h4>
                                                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                    {testCaseDefinition.input || "No input"}
                                                </pre>
                                            </div>
                                            <div className="border rounded-lg p-3 bg-gray-50">
                                                <h4 className="text-sm font-medium text-gray-600 mb-1">Expected Output</h4>
                                                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                    {testCaseDefinition.output || "No output"}
                                                </pre>
                                            </div>
                                        </>
                                    )}
                                    {result.stdout && (
                                        <div className="border rounded-lg p-3 bg-gray-50 md:col-span-2">
                                            <h4 className="text-sm font-medium text-gray-600 mb-1">Your Output</h4>
                                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                {result.stdout}
                                            </pre>
                                        </div>
                                    )}
                                     {result.stderr && (
                                         <div className="border rounded-lg p-3 bg-gray-50 md:col-span-2">
                                             <h4 className="text-sm font-medium text-red-500 mb-1">Error Output</h4>
                                             <pre className="text-xs bg-white p-2 rounded border overflow-x-auto text-red-500">
                                                 {result.stderr}
                                             </pre>
                                         </div>
                                     )}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Source Code */}
                  <div className="flex-1">
                      <div className="border rounded-lg p-3 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Source Code</h4>
                          <ScrollArea className="h-[200px]">
                              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto font-mono">
                                  {sourceCode || 'Source code not available'}
                              </pre>
                          </ScrollArea>
                      </div>
                  </div>
            </div>
        );
    }

    // Render logic for Previous Submissions (using fetched data)
    if (submission) {
        return (
            <div className="h-full flex flex-col p-2 sm:p-4">
                {/* Submission Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Submission Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-2 sm:p-3 rounded-md transition-colors hover:bg-white dark:hover:bg-gray-700">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Problem</h3>
                            <p className="text-sm sm:text-base font-medium truncate">{submission.problem?.title || 'Unknown Problem'}</p>
                        </div>
                        <div className="p-2 sm:p-3 rounded-md transition-colors hover:bg-white dark:hover:bg-gray-700">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                            <Badge className={`mt-1 ${getBadgeClass(submission.status)}`}>
                                <div className="flex items-center">
                                    {/* Use isProcessingNew for loading state in previous submissions if needed, or derive from status */}
                                    {submission.status === 'PROCESSING' || submission.status === 'IN_QUEUE' ? (
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : submission.status === 'ACCEPTED' ? (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : submission.status === 'WRONG_ANSWER' ? (
                                        <XCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                        <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    <span className="text-xs sm:text-sm">{getStatusDisplay(submission.status)}</span>
                                </div>
                            </Badge>
                             {submission.submittedAt && (
                                 <div className="text-xs text-gray-500 dark:text-gray-400">
                                     {formatDateTime(submission.submittedAt)}
                                 </div>
                             )}
                        </div>
                        <div className="p-2 sm:p-3 rounded-md transition-colors hover:bg-white dark:hover:bg-gray-700">
                             <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Language</h3>
                             <Badge variant="outline" className="mt-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                                 <span className="text-xs sm:text-sm">{getLanguageName(submission.languageId)}</span>
                             </Badge>
                         </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-2 sm:p-3 rounded-md transition-colors hover:bg-white dark:hover:bg-gray-700">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Execution Time</h3>
                            <p className="text-sm sm:text-base font-medium">{submission.executionTime ? `${submission.executionTime} ms` : 'N/A'}</p>
                        </div>
                        <div className="p-2 sm:p-3 rounded-md transition-colors hover:bg-white dark:hover:bg-gray-700">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</h3>
                            <p className="text-sm sm:text-base font-medium">{submission.memoryUsed ? `${submission.memoryUsed} KB` : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Test Cases Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] pr-2 p-[4px] mb-4">
                    {/* Render test cases from fetched submission data for previous submissions */}
                    {submission.testCaseResults?.map((testCaseResult, index) => (
                        <div
                            key={testCaseResult.id}
                            className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all hover:shadow-md 
                            ${testCaseResult.status === 'ACCEPTED' ? 'bg-green-100 border-green-300' : 
                              testCaseResult.status === 'PROCESSING' || testCaseResult.status === 'IN_QUEUE' ? 'bg-blue-100 border-blue-300' :
                              'bg-red-100 border-red-300'} 
                            ${selectedTestCase === testCaseResult.id ? 'ring-2 ring-blue-400' : ''}`}
                            onClick={() => setSelectedTestCase(testCaseResult.id === selectedTestCase ? null : testCaseResult.id)}
                        >
                            <div className="flex justify-between">
                                <div className="font-medium">Test Case {index + 1}</div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                {getTestCaseStatusIcon(testCaseResult.status)}
                                <span className="text-sm text-gray-700 truncate">
                                    {getStatusDisplay(testCaseResult.status)}
                                </span>
                            </div>
                            
                             {testCaseResult.status !== 'PROCESSING' && testCaseResult.status !== 'IN_QUEUE' && (
                                 <div className="text-xs flex flex-wrap items-center gap-2 mt-2 text-gray-500">
                                     <Clock size={14} className="mr-1 flex-shrink-0" />
                                     {testCaseResult.executionTime}ms
                                 </div>
                             )}
                              {testCaseResult.status !== 'PROCESSING' && testCaseResult.status !== 'IN_QUEUE' && testCaseResult.memoryUsed && (
                                  <div className="text-xs flex flex-wrap items-center gap-2 mt-2 text-gray-500">
                                      <Server size={14} className="mr-1 flex-shrink-0" />
                                      {(testCaseResult.memoryUsed/1024).toFixed(1)} MB
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>

                {/* Selected Test Case Details */}
                {selectedTestCase && submission.testCaseResults && (
                    <div className="border rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-gray-700 mb-2">Test Case Details</h3>
                        {(() => {
                            const testCaseResult = submission.testCaseResults.find(tc => tc.id === selectedTestCase);
                            
                            if (!testCaseResult || !testCaseResult.testCase) return <div>Test case details not found</div>; // Ensure testCase exists

                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                     {testCaseResult.testCase.input !== "Hidden" && (
                                         <>
                                             <div className="border rounded-lg p-3 bg-gray-50">
                                                 <h4 className="text-sm font-medium text-gray-600 mb-1">Input</h4>
                                                 <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                     {testCaseResult.testCase.input || "No input"}
                                                 </pre>
                                             </div>
                                             <div className="border rounded-lg p-3 bg-gray-50">
                                                 <h4 className="text-sm font-medium text-gray-600 mb-1">Expected Output</h4>
                                                 <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                     {testCaseResult.testCase.output || "No output"}
                                                 </pre>
                                             </div>
                                         </>
                                     )}
                                    {testCaseResult.stdout && (
                                        <div className="border rounded-lg p-3 bg-gray-50 md:col-span-2">
                                            <h4 className="text-sm font-medium text-gray-600 mb-1">Your Output</h4>
                                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                {testCaseResult.stdout}
                                            </pre>
                                        </div>
                                    )}
                                     {testCaseResult.stderr && (
                                         <div className="border rounded-lg p-3 bg-gray-50 md:col-span-2">
                                             <h4 className="text-sm font-medium text-red-500 mb-1">Error Output</h4>
                                             <pre className="text-xs bg-white p-2 rounded border overflow-x-auto text-red-500">
                                                 {testCaseResult.stderr}
                                             </pre>
                                         </div>
                                     )}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Source Code */}
                <div className="flex-1">
                    <div className="border rounded-lg p-3 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Source Code</h4>
                        <ScrollArea className="h-[200px]">
                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto font-mono">
                                {submission.sourceCode || 'Loading source code...'}
                            </pre>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback or initial state if none of the above conditions are met
    return (
        <div className="flex items-center justify-center h-full">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <p>Select a submission to view details.</p>
        </div>
    );
};

export default SubmissionDetails;