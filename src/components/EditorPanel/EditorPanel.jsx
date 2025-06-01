import React, { useRef, useEffect, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCode, Settings as SettingsIcon, Copy, Download, Play, Loader2, Minus, Plus,History } from 'lucide-react';
import { Clock, Database } from 'lucide-react';
import EditorSettings from './EditorSettings';
import { ThemeContext } from '../../context/ThemeContext';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { EditorSettingsContext } from '../../context/EditorSettingsContext';
import ThemeToggle from '../ui/ThemeToggle';
import { useSubmission } from '@/context/SubmissionContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubmissionDetails from '../IOPanel/SubmissonDetails';

// Constants for localStorage
const SOLUTION_STORAGE_KEY_PREFIX = 'codeduel_solution_';
const SOLUTION_EXPIRY_HOURS = 24; // Solutions expire after 24 hours

// Helper to clear expired solutions
const clearExpiredSolutions = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(SOLUTION_STORAGE_KEY_PREFIX)) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.expiry && new Date().getTime() > data.expiry) {
                    localStorage.removeItem(key);
                }
            } catch (err) {
                // If data is corrupted, remove it
                localStorage.removeItem(key);
            }
        }
    }
};

const EditorPanel = () => {

    const {
        code,
        setCode,
        statusBadge,
        executionTime,
        memoryUsage,
        isRunning,
        runCustomTest,
        formatCode,
        selectedProblem,
        testResults
    } = useContext(CodeExecutionContext);

     const { 
        selectedSubmissionId,
        submissionData,
        activeTab,
        setActiveTab,
        clearSubmission,
        newSubmission
    } = useSubmission();
    const {
        language,
        editorFontSize,
        setEditorFontSize,
        lineWrap,
        autoFormat,
        showSettings,
        toggleSettings,
        handleEditorDidMount,
    } = useContext(EditorSettingsContext);

    const { theme } = useContext(ThemeContext);

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

    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const currentCodeRef = useRef(code);

    // Generate storage key specific to problem and language
    const getStorageKey = (problemId, languageId) => {
        if (!problemId) return null;
        return `${SOLUTION_STORAGE_KEY_PREFIX}${problemId}_${languageId}`;
    };

    // Save solution to localStorage with expiration
    const saveSolutionToStorage = (codeToSave) => {
        if (!selectedProblem?.id) return;

        const storageKey = getStorageKey(selectedProblem.id, language.id);
        if (!storageKey) return;

        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + SOLUTION_EXPIRY_HOURS);

        const solutionData = {
            code: codeToSave,
            expiry: expiryTime.getTime(),
            languageId: language.id,
            languageName: language.name, // Store language name for reference
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(storageKey, JSON.stringify(solutionData));
    };

    // Load solution from localStorage
    const loadSolutionFromStorage = (problemId, languageId) => {
        const storageKey = getStorageKey(problemId, languageId);
        if (!storageKey) return null;

        const storedData = localStorage.getItem(storageKey);
        if (!storedData) return null;

        try {
            const solutionData = JSON.parse(storedData);

            // Check if solution has expired
            if (solutionData.expiry && new Date().getTime() > solutionData.expiry) {
                localStorage.removeItem(storageKey); // Remove expired solution
                return null;
            }

            // Double-check that the language ID matches (defensive programming)
            if (solutionData.languageId !== languageId) {
                console.warn('Language mismatch in stored solution');
                return null;
            }

            return solutionData.code;
        } catch (error) {
            console.error('Error parsing stored solution:', error);
            localStorage.removeItem(storageKey); // Remove corrupted data
            return null;
        }
    };

    // Handle code changes
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        currentCodeRef.current = newCode; // Update ref with latest code
        saveSolutionToStorage(newCode);
    };

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        editor.focus();

        editor.onKeyDown((event) => {
            const { keyCode, ctrlKey, metaKey } = event;
            if ((keyCode === 33 || keyCode === 52) && (metaKey || ctrlKey)) {
                event.preventDefault();
            }
        });
        handleEditorDidMount(editor, monaco);
    };

    // Clear expired solutions on component mount
    useEffect(() => {
        clearExpiredSolutions();
    }, []);

    // Load saved solution when problem or language changes
    useEffect(() => {
        if (selectedProblem?.id) {
            const savedCode = loadSolutionFromStorage(selectedProblem.id, language.id);
            if (savedCode !== null) {
                setCode(savedCode);
                currentCodeRef.current = savedCode; // Update ref
            } else {
                setCode(''); // Clear editor if no saved solution exists for selected language
                currentCodeRef.current = '';
            }
        }
    }, [selectedProblem?.id, language.id]);

    // Save code on unmount and periodically
    useEffect(() => {
        // Periodic saving (every 3 seconds)
        const intervalId = setInterval(() => {
            if (currentCodeRef.current?.trim() && selectedProblem?.id) {
                saveSolutionToStorage(currentCodeRef.current);
            }
        }, 3000);

        // Save on unmount
        return () => {
            clearInterval(intervalId);
            if (currentCodeRef.current?.trim() && selectedProblem?.id) {
                saveSolutionToStorage(currentCodeRef.current);
            }
        };
    }, [selectedProblem?.id, language.id]);

    // Save code when losing focus (additional safety)
    useEffect(() => {
        const handleBlur = () => {
            if (currentCodeRef.current?.trim() && selectedProblem?.id) {
                saveSolutionToStorage(currentCodeRef.current);
            }
        };

        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [selectedProblem?.id, language.id]);

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

    console.log(activeTab)
    return (
        <div
            ref={containerRef}
            className="flex flex-col h-full flex-grow p-0 gap-0 overflow-hidden rounded-xl border dark:border-gray-700"
        >
            {showSettings && <EditorSettings />}

            <CardHeader className="py-2 px-2 flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="editor" className="flex items-center">
                                <FileCode className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {language.monacoLanguage.toUpperCase()}
                                </span>
                            </TabsTrigger>
                         { activeTab==='submission' &&  <TabsTrigger 
                                value="submission" 
                                className="flex items-center"
                                disabled={!selectedSubmissionId && !submissionData}
                            >
                                <History className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Submission Details
                                </span>
                            </TabsTrigger>}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex space-x-2">
                    <div className="scale-75 mt-[1px]">
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <label htmlFor="font-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Font Size:
                        </label> */}
                        <div className="flex items-center space-x-[8px] bg-gray-200 dark:bg-gray-700 rounded-lg">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 text-lg bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 shadow-none text-gray-800 dark:text-gray-200"
                                onClick={() => setEditorFontSize(Math.max(10, editorFontSize - 1))}
                            >
                                <Minus className='w-4 h-4' />
                            </Button>
                            <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                {editorFontSize}px
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 text-lg bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 shadow-none text-gray-800 dark:text-gray-200"
                                onClick={() => setEditorFontSize(Math.min(24, editorFontSize + 1))}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSettings}
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
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={formatCode}
                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                </Button> */}
                            </TooltipTrigger>
                            <TooltipContent>Format Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>

            {((activeTab === 'submission')  ) ? (
                <div className="flex-1 overflow-auto p-4">
                    <SubmissionDetails
                        submissionId={selectedSubmissionId}
                        submissionData={submissionData}
                        isNewSubmission={newSubmission}
                        onClose={clearSubmission}
                        getStatusDisplay={getStatusDisplay}
                        getBadgeClass={getBadgeClass}
                        problemDetails={selectedProblem}
                        testResultsData={testResults}
                        newSubmissionLanguageName={language.name}
                        sourceCode={code}
                    />
                    
                </div>
            ) : (
                <CardContent className="p-0 flex-1 !geist-mono overflow-hidden bg-white dark:bg-gray-900">
                    <Editor
                        language={language.monacoLanguage}
                        value={code}
                        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                        onChange={handleCodeChange}
                        onMount={handleEditorMount}
                        className="h-full"
                        options={{
                            fontFamily: "'Geist Mono', monospace",
                            minimap: { enabled: false },
                            fontSize: editorFontSize,
                            fontLigatures: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            suggestOnTriggerCharacters: true,
                            contextmenu: false,
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
            )}

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
                        if (autoFormat) formatCode();
                        // Force save current code before running the test
                        if (currentCodeRef.current?.trim() && selectedProblem?.id) {
                            saveSolutionToStorage(currentCodeRef.current);
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