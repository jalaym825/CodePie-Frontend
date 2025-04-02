import React from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent } from '@/components/ui/card';
import { FileInput } from 'lucide-react';

const InputPanel = ({
    stdin,
    setStdin,
    editorFontSize,
    theme
}) => {
    return (
        <div className="h-full">
            <Card className="h-full border-0 dark:border-0 p-0 gap-0">
                <CardContent className="p-0 h-full">
                    <div className="h-full flex flex-col">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex items-center">
                            <FileInput className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Custom Input</span>
                        </div>
                        <div className="flex-grow">
                            <Editor
                                height="100%"
                                language="plaintext"
                                value={stdin}
                                theme={theme}
                                onChange={setStdin}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: editorFontSize,
                                    lineNumbers: 'off',
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    scrollbar: {
                                        verticalScrollbarSize: 8,
                                        horizontalScrollbarSize: 8,
                                    },
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InputPanel;