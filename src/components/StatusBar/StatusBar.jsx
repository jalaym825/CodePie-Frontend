// components/StatusBar/StatusBar.jsx
import React from 'react';
import { Database, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StatusBar = () => {
    return (
        <div className="flex items-center justify-center px-4 py-2 bg-gray-100 border-t text-xs">
            {/* <div className="flex items-center space-x-4">
                {executionTime && (
                    <Badge variant="outline" className="flex items-center bg-white">
                        <Clock className="mr-1 h-3 w-3" />
                        {executionTime}s
                    </Badge>
                )}
                {memoryUsage && (
                    <Badge variant="outline" className="flex items-center bg-white">
                        <Database className="mr-1 h-3 w-3" />
                        {memoryUsage}MB
                    </Badge>
                )}
            </div> */}
            <div className="text-gray-500">
                Connected to Judge0 API
            </div>
        </div>
    );
};

export default StatusBar;