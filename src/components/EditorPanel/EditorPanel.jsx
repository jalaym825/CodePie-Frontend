import React, { useRef, useEffect, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCode, Settings as SettingsIcon, Copy, Download, Play, Loader2 } from 'lucide-react';
import { Clock, Database } from 'lucide-react';
import EditorSettings from './EditorSettings';
import { ThemeContext } from '../../context/ThemeContext';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { EditorSettingsContext } from '../../context/EditorSettingsContext';

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
        selectedProblem
    } = useContext(CodeExecutionContext);

    const {
        language,
        editorFontSize,
        lineWrap,
        autoFormat,
        showSettings,
        toggleSettings,
        handleEditorDidMount,
        formatCode,
        copyCode,
        downloadCode
    } = useContext(EditorSettingsContext);

    const { theme } = useContext(ThemeContext);

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

    return (
        <div
            ref={containerRef}
            className="flex flex-col h-full flex-grow p-0 gap-0 overflow-hidden rounded-xl border dark:border-gray-700"
        >
            {showSettings && <EditorSettings />}

            <CardHeader className="py-2 px-2 flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800">
                <CardTitle className="flex items-center text-xs font-medium">
                    <FileCode className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                        {language.monacoLanguage.toUpperCase()}
                    </span>
                </CardTitle>
                <div className="flex space-x-1">
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
                        tabSize: 4,
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