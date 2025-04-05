import React, { useContext } from 'react';
import { Terminal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';

const OutputPanel = () => {
    const { output } = useContext(CodeExecutionContext);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-full p-2 font-mono text-sm overflow-auto">
            {output ? (
                <div className='!font-geist-mono'>
                    <pre className="whitespace-pre-wrap break-words !font-geist-mono">{output}</pre>
                </div>
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
