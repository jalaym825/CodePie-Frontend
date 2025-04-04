import React from 'react';
import { Terminal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const OutputPanel = ({ output }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-full p-4 font-mono text-sm overflow-auto">
            {output ? (
                <Card className="bg-white dark:bg-gray-800 p-4 rounded-md">
                    <CardContent className="p-0">
                        <pre className="whitespace-pre-wrap break-words">{output}</pre>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <Terminal className="h-10 w-10 mb-2" />
                    <p>Run your code to see output here</p>
                </div>
            )}
        </div>
    );
};

export default OutputPanel;