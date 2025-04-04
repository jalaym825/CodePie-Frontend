import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HistoryPanel = ({ recentSubmissions }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-full overflow-auto">
            {recentSubmissions.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {submission.language}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {submission.timestamp}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <Badge
                                    className={
                                        submission.status === 'Success'
                                            ? 'bg-green-500 dark:bg-green-600'
                                            : submission.status === 'Compilation Error'
                                                ? 'bg-red-500 dark:bg-red-600'
                                                : 'bg-yellow-500 dark:bg-yellow-600'
                                    }
                                >
                                    <div className="flex items-center">
                                        {submission.status === 'Success' ? (
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {submission.status}
                                    </div>
                                </Badge>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {submission.time}s
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <History className="h-10 w-10 mb-2" />
                    <p>No recent submissions</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPanel;