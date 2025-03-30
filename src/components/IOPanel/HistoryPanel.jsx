import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HistoryPanel = ({ recentSubmissions }) => {
    return (
        <div className="bg-gray-50 text-gray-800 h-full overflow-auto">
            {recentSubmissions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {recentSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="p-3 hover:bg-gray-100"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {submission.language}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {submission.timestamp}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <Badge
                                    className={
                                        submission.status === 'Success'
                                            ? 'bg-green-500'
                                            : submission.status === 'Compilation Error'
                                                ? 'bg-red-500'
                                                : 'bg-yellow-500'
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
                                <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {submission.time}s
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <History className="h-10 w-10 mb-2" />
                    <p>No recent submissions</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPanel;