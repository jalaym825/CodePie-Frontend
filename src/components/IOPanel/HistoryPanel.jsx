import React, { useContext, useEffect, useState } from 'react';
import { History, CheckCircle, XCircle, Clock, Cpu, HardDrive, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserContext } from '@/context/UserContext';
import { useParams } from 'react-router';
import SubmissionDialog from './SubmissionDialog';
import { useSubmission } from '@/context/SubmissionContext';
import { AiTwotoneDatabase } from 'react-icons/ai';
export const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If less than 24 hours ago
    if (diffInDays < 1) {
        if (diffInMins < 1) {
            return 'Just now';
        } else if (diffInMins < 60) {
            return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        }
    }
    
    // If more than 24 hours ago, show full date-time
    return date.toLocaleString();
};

const HistoryPanel = () => {
    const { getProblemSubmissions } = useContext(UserContext);
    const { problemId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { handleViewSubmission, SetNewSubmission, newSubmission } = useSubmission();
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const res = await getProblemSubmissions(problemId);
                setSubmissions(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [problemId, getProblemSubmissions]);

    // Map API status to display format
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'Accepted';
            case 'WRONG_ANSWER':
                return 'Wrong Answer';
            case 'TIME_LIMIT_EXCEEDED':
                return 'Time Limit Exceeded';
            case 'RUNTIME_ERROR':
                return 'Runtime Error';
            case 'COMPILATION_ERROR':
                return 'Compilation Error';
            case 'PROCESSING':
                return 'Processing'
            default:
                return status;
        }
    };

    // Get badge color based on status
    const getBadgeClass = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'bg-green-500 dark:bg-green-600';
            case 'WRONG_ANSWER':
                return 'bg-red-500 dark:bg-red-600';
            case 'TIME_LIMIT_EXCEEDED':
                return 'bg-orange-500 dark:bg-orange-600';
            case 'RUNTIME_ERROR':
                return 'bg-purple-500 dark:bg-purple-600';
            default:
                return 'bg-yellow-500 dark:bg-yellow-600';
        }
    };

    // Format timestamp nicely

    // Format memory usage
    const formatMemory = (memory) => {
        if (!memory) return 'N/A';
        return `${memory} KB`;
    };

    // Format execution time
    const formatTime = (time) => {
        if (!time && time !== 0) return 'N/A';
        return `${time} ms`;
    };

    const handleSubmissionClick = async(submissionId) => {
        // setSelectedSubmission(submissionId);
        
     
            handleViewSubmission(submissionId);
            SetNewSubmission(false);
        
        // setIsDialogOpen(true);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-full overflow-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    <p>Loading submissions...</p>
                </div>
            ) : submissions && submissions.length > 0 ? (
                <div className="w-full">
                    {/* Table Header */}
                    <div className="grid grid-cols-10 gap-2 p-3 font-semibold bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-center">
                        <div className="col-span-3 flex items-center justify-center">Status</div>
                        <div className="col-span-2 flex items-center justify-center">Language</div>
                        <div className="col-span-2 flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Time
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            Memory
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            Score
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="grid grid-cols-10 gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 items-center text-center cursor-pointer"
                                onClick={() => handleSubmissionClick(submission.id)}
                            >
                                <div className="col-span-3 flex flex-col gap-2 items-center justify-center">
                                    <Badge className={getBadgeClass(submission.status)}>
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
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDateTime(submission.submittedAt)}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center justify-center">
                                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                                        {submission.language}
                                    </Badge>
                                </div>
                                <div className="col-span-2 flex items-center justify-center">
                                    {formatTime(submission.executionTime)}
                                </div>
                                <div className="col-span-2 flex items-center justify-center">
                                    {formatMemory(submission.memoryUsed)}
                                </div>
                                <div className="col-span-1 flex items-center justify-center font-medium">
                                    {submission.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <History className="h-10 w-10 mb-2" />
                    <p>No recent submissions</p>
                </div>
            )}

            {selectedSubmission && (
                <SubmissionDialog
                    submissionId={selectedSubmission}
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    getStatusDisplay={getStatusDisplay}
                    getBadgeClass={getBadgeClass}
                />
            )}

        </div>
    );
};

export default HistoryPanel;