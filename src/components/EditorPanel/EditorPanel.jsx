import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCode, Settings as SettingsIcon, Copy, Download, Play, Loader2 } from 'lucide-react';
import { Clock, Database } from 'lucide-react';
import EditorSettings from './EditorSettings';
import { useTheme } from "../../context/ThemeContext";

const EditorPanel = ({
    code,
    setCode,
    statusBadge,
    executionTime,
    memoryUsage,
    isRunning,
    runCustomTest,
    showSettings,
    setShowSettings,
    monacoLanguage,
    editorFontSize,
    setEditorFontSize,
    lineWrap,
    setLineWrap,
    autoFormat,
    setAutoFormat,
    showProblem,
    setShowProblem,
    handleEditorDidMount,
    formatCode,
    copyCode,
    downloadCode
}) => {
    const editorRef = useRef(null);
    const containerRef = useRef(null);

    const { theme } = useTheme();

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        if (handleEditorDidMount) {
            handleEditorDidMount(editor, monaco);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-col flex-grow p-0 gap-0 overflow-hidden rounded-xl border dark:border-gray-700"
            style={{ height: '70%', minHeight: '300px' }}
        >
            {showSettings && (
                <EditorSettings
                    editorFontSize={editorFontSize}
                    setEditorFontSize={setEditorFontSize}
                    lineWrap={lineWrap}
                    setLineWrap={setLineWrap}
                    autoFormat={autoFormat}
                    setAutoFormat={setAutoFormat}
                    showProblem={showProblem}
                    setShowProblem={setShowProblem}
                    setShowSettings={setShowSettings}
                />
            )}

            <CardHeader className="py-2 px-2 flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800">
                <CardTitle className="flex items-center text-xs font-medium">
                    <FileCode className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                        {monacoLanguage.toUpperCase()}
                    </span>
                </CardTitle>
                <div className="flex space-x-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    <SettingsIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editor Settings</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={formatCode}
                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Format Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={copyCode}
                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={downloadCode}
                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 !geist-mono overflow-hidden bg-white dark:bg-gray-900">
                <Editor
                    language={monacoLanguage}
                    value={code}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                    onChange={setCode}
                    onMount={handleEditorMount}
                    className="h-full"
                    options={{
                        fontFamily: "'Geist Mono', monospace",
                        minimap: { enabled: false },
                        fontSize: editorFontSize,
                        fontLigatures: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        bracketPairColorization: { enabled: true },
                        scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                        },
                        wordWrap: lineWrap ? 'on' : 'off',
                    }}
                />
            </CardContent>

            <CardFooter className="justify-between py-2 px-2 bg-gray-100 dark:bg-gray-800 border-t-1 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <Badge className={`${statusBadge.color} text-white px-2 py-1 text-xs`}>
                        {statusBadge.label}
                    </Badge>
                    {executionTime && (
                        <Badge variant="outline" className="flex items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            {executionTime}s
                        </Badge>
                    )}
                    {memoryUsage && (
                        <Badge variant="outline" className="flex items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 text-xs">
                            <Database className="mr-1 h-3 w-3" />
                            {memoryUsage}MB
                        </Badge>
                    )}
                </div>
                <Button
                    onClick={() => {
                        if (autoFormat) {
                            formatCode();
                        }
                        runCustomTest();
                    }}
                    disabled={isRunning}
                    className={`bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs ${isRunning ? 'opacity-70' : ''}`}
                >
                    {isRunning ? (
                        <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play className="mr-1 h-3 w-3" />
                            Run
                        </>
                    )}
                </Button>
            </CardFooter>
        </div>
    );
};

export default EditorPanel;