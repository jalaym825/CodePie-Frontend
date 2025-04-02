import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from '@/components/ui/sonner';
import { Maximize2 } from "lucide-react";
import { useEffect, useState } from 'react';
import EditorPanel from '../components/EditorPanel/EditorPanel';
import Header from '../components/Header/Header';
import IOPanel from '../components/IOPanel/IOPanel';
import ProblemPanel from '../components/ProblemPanel/ProblemPanel';
import { problems } from "../helpers/editorData";
import useCodeExecution from '../hooks/useCodeExecution';
import useEditorSettings from '../hooks/useEditorSettings';

const CodeEditor = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('71');
    const [selectedProblem, setSelectedProblem] = useState(problems[0]);
    const [showProblem, setShowProblem] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

    const languages = [
        { id: '71', name: 'Python' },
        { id: '62', name: 'Java' },
        { id: '54', name: 'C++' },
        { id: '63', name: 'JavaScript' },
        // { id: '64', name: 'C#' },
        // { id: '70', name: 'Go' },
        // { id: '72', name: 'Ruby' },
        // { id: '73', name: 'PHP' },
        // { id: '74', name: 'Swift' },
        // { id: '75', name: 'Kotlin' },
    ]

    // Use custom hooks
    const {
        output,
        isRunning,
        statusBadge,
        executionTime,
        memoryUsage,
        recentSubmissions,
        testResults,
        isTestingAll,
        stdin,
        setStdin,
        runCustomTest,
        runTestCase,
        runAllTests,
        submitSolution,
        setTestResults
    } = useCodeExecution({ code, language, selectedProblem });

    const {
        monacoLanguage,
        editorFontSize,
        lineWrap,
        setLineWrap,
        autoFormat,
        theme,
        handleEditorDidMount,
        setEditorFontSize,
        formatCode,
        copyCode,
        downloadCode,
    } = useEditorSettings({ language, languages });

    // Show fullscreen prompt when component mounts
    useEffect(() => {
        // Short delay to ensure the component is fully rendered before showing the prompt
        const timer = setTimeout(() => {
            setShowFullscreenPrompt(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    const handleProblemChange = (problemId) => {
        const problem = problems.find((p) => p.id === problemId);
        if (problem) {
            setSelectedProblem(problem);
            setTestResults([]);
        }
    };

    const enableFullscreen = () => {
        setIsFullscreen(true);
        setShowFullscreenPrompt(false);
        
        // Request browser fullscreen if supported
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log("Error attempting to enable fullscreen:", err);
            });
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    };

    const closeFullscreenPrompt = () => {
        setShowFullscreenPrompt(false);
    };

    return (
        <>
            <Toaster position="bottom-right" richColors />
            <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col h-screen' : 'h-auto md:h-[100vh] flex flex-col'}`}>
                <Header
                    language={language}
                    setLanguage={setLanguage}
                    selectedProblem={selectedProblem}
                    handleProblemChange={handleProblemChange}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    showSettings={showSettings}
                    toggleSettings={() => setShowSettings(!showSettings)}
                    languages={languages}
                />

                <div className={`flex flex-col md:flex-row flex-1 gap-2 overflow-hidden p-2 ${isFullscreen ? 'h-[calc(100vh-96px)]' : ''}`}>
                    {showProblem && (
                        <ProblemPanel
                            selectedProblem={selectedProblem}
                            testResults={testResults}
                            isTestingAll={isTestingAll}
                            runTestCase={runTestCase}
                            runAllTests={runAllTests}
                            submitSolution={submitSolution}
                            className={isFullscreen ? "overflow-auto" : ""}
                        />
                    )}

                    <div className={`flex flex-col flex-1 gap-2 ${showProblem ? 'md:w-2/3' : 'w-full'} ${isFullscreen ? '' : ''}`}>
                        <EditorPanel
                            code={code}
                            setCode={setCode}
                            language={language}
                            statusBadge={statusBadge}
                            executionTime={executionTime}
                            memoryUsage={memoryUsage}
                            isRunning={isRunning}
                            runCustomTest={runCustomTest}
                            showSettings={showSettings}
                            setShowSettings={setShowSettings}
                            monacoLanguage={monacoLanguage}
                            editorFontSize={editorFontSize}
                            lineWrap={lineWrap}
                            setLineWrap={setLineWrap}
                            autoFormat={autoFormat}
                            theme={theme}
                            handleEditorDidMount={handleEditorDidMount}
                            formatCode={formatCode}
                            copyCode={copyCode}
                            downloadCode={downloadCode}
                            setEditorFontSize={setEditorFontSize}
                            showProblem={showProblem}
                            setShowProblem={setShowProblem}
                            className={isFullscreen ? "flex-1 min-h-0" : ""}
                        />

                        <IOPanel
                            output={output}
                            stdin={stdin}
                            setStdin={setStdin}
                            recentSubmissions={recentSubmissions}
                            editorFontSize={editorFontSize}
                            theme={theme}
                            className={isFullscreen ? "flex-1 min-h-0 max-h-[40vh]" : ""}
                        />
                    </div>
                </div>
            </div>

            {/* Fullscreen Prompt Dialog */}
            <Dialog open={showFullscreenPrompt} onOpenChange={setShowFullscreenPrompt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Maximize2 className="mr-2 h-5 w-5 text-blue-600" />
                            Switch to Fullscreen Mode
                        </DialogTitle>
                        <DialogDescription>
                            Would you like to switch to fullscreen mode for a better coding experience?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-between">
                        <Button variant="outline" onClick={closeFullscreenPrompt}>
                            Stay in Window Mode
                        </Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={enableFullscreen}
                        >
                            Enable Fullscreen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CodeEditor;