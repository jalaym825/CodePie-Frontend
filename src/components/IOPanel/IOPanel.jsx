import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardHeader, CardContent } from '@/components/ui/card';
import { Terminal, FileInput, History } from 'lucide-react';
import Editor from '@monaco-editor/react';
import OutputPanel from './OutputPanel';
import InputPanel from './InputPanel';
import HistoryPanel from './HistoryPanel';

const IOPanel = ({ output, stdin, setStdin, recentSubmissions, editorFontSize, theme, memoryUsage, executionTime }) => {
    return (
        <div className="flex-grow h-[30%] overflow-auto rounded-xl border">
            <Tabs defaultValue="output" className="h-full gap-0">
                <CardHeader className="p-2 m-0 bg-gray-50">
                    <TabsList className="bg-gray-100 gap-x-2">
                        <TabsTrigger value="output" className="text-xs h-7 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            <Terminal className="mr-1 h-3 w-3" />
                            Output
                        </TabsTrigger>
                        <TabsTrigger value="input" className="text-xs h-7 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            <FileInput className="mr-1 h-3 w-3" />
                            Input
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-xs h-7 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            <History className="mr-1 h-3 w-3" />
                            History
                        </TabsTrigger>
                    </TabsList>
                    {
                        output && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="mr-2">Memory: {memoryUsage}MB</span>
                                <span>Time: {executionTime}s</span>
                            </div>
                        )
                    }
                </CardHeader>

                <CardContent className="p-0 h-full">
                    <TabsContent value="output" className="h-full m-0">
                        <OutputPanel output={output} />
                    </TabsContent>

                    <TabsContent value="input" className="h-full m-0">
                        <InputPanel
                            stdin={stdin}
                            setStdin={setStdin}
                            editorFontSize={editorFontSize}
                            theme={theme}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="h-full m-0 p-0">
                        <HistoryPanel recentSubmissions={recentSubmissions} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </div>
    );
};

export default IOPanel;