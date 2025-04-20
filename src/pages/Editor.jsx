/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from '@/components/ui/sonner';
import { useContext, useEffect, useState } from 'react';
import EditorPanel from '../components/EditorPanel/EditorPanel';
import Header from '../components/Header/Header';
import IOPanel from '../components/IOPanel/IOPanel';
import ProblemPanel from '../components/ProblemPanel/ProblemPanel';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    // DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { EditorSettingsContext } from '../context/EditorSettingsContext';
import { Maximize2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { CodeExecutionContext } from '../context/CodeExecutionContext';
import TestResultDialog from '../components/Result/TestResultDialog';
import { toast } from 'sonner';
import LoadingScreen from '@/components/ui/LoadingScreen';
import NoCopyPasteComponent from '@/components/Utilities/NoCopyPasteComponent';
import { UserContext } from '@/context/UserContext';

const CodeEditor = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { fetchContest, fetchProblem, showResultDialog, setShowResultDialog, selectedProblem, testResults, loading, contest } = useContext(CodeExecutionContext);
    const { isFullscreen, showProblem, showFullscreenPrompt, closeFullscreenPrompt, enableFullscreen } = useContext(EditorSettingsContext);
    const {getAccurateTime} = useContext(UserContext);

    const { id, contestId, problemId } = useParams();
    const navigate = useNavigate();

    // Determine if this is a competition problem
    const isContest = Boolean(contestId);

    // Get the actual problem ID (either from standalone or competition route)
    const currentProblemId = id || problemId;

    async function handleFetchCompetition() {
        if (!isContest && !currentProblemId) return;
        const res = await fetchContest(contestId);
        if (res.status === 200) {
            const now = getAccurateTime();
            if (res.contest.endTime <= now && !res.isJoined) {
                toast.error("You have not joined this contest yet. Please join the contest to access the problem.");
                navigate(`/contests/${contestId}`);
            }
            return res;
        }
        return false;
    }

    async function handleFetchProblem() {
        // if (!isContest && !currentProblemId) return;

        if (isContest) {
            const res = await handleFetchCompetition();
            if (!res) {
                toast.error("Failed to fetch contest data. Please try again.");
                navigate('/contests');
                return;
            }
        }

        const res = await fetchProblem(currentProblemId);
        if (res.status === 200) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        handleFetchProblem();
    }, [])

    if (isLoading || loading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <>
            <NoCopyPasteComponent className='select-none' strictMode={contest?.strictMode}>
                <Toaster position="bottom-right" richColors />
                <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col h-screen' : 'h-screen md:h-[100vh] flex flex-col'}`}>
                    <Header />

                    <div className={`overflow-hidden p-2 flex-1 ${isFullscreen ? 'h-[calc(100vh-96px)]' : 'h-full'}`}>
                        <ResizablePanelGroup direction="horizontal" className="h-full">
                            {showProblem && (
                                <>
                                    <ResizablePanel defaultSize={33} minSize={25} className="p-1 h-full">
                                        <div className={`h-full ${isFullscreen ? "overflow-auto" : ""}`}>
                                            <ProblemPanel />
                                        </div>
                                    </ResizablePanel>
                                    <ResizableHandle withHandle />
                                </>
                            )}

                            <ResizablePanel className="h-full" defaultSize={showProblem ? 67 : 100} minSize={40}>
                                <ResizablePanelGroup direction="vertical">
                                    <ResizablePanel defaultSize={60} minSize={30} className="p-1">
                                        {/* <div className={`h-full ${isFullscreen ? "min-h-0" : ""}`}> */}
                                        <EditorPanel />
                                        {/* </div> */}
                                    </ResizablePanel>
                                    <ResizableHandle withHandle />
                                    <ResizablePanel defaultSize={40} className="p-1">
                                        {/* <div className={`h-full ${isFullscreen ? "min-h-0" : ""}`}> */}
                                        <IOPanel />
                                        {/* </div> */}
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>

                <FullscreenPrompt
                    open={showFullscreenPrompt}
                    onClose={closeFullscreenPrompt}
                    onConfirm={enableFullscreen}
                />
                <TestResultDialog
                    open={showResultDialog}
                    onOpenChange={setShowResultDialog}
                    testCases={selectedProblem?.testCases || []}
                    testResults={testResults}
                />
            </NoCopyPasteComponent>
        </>
    );
};

// Extracted FullscreenPrompt component for better organization
const FullscreenPrompt = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    <Maximize2 className="mr-2 h-5 w-5 text-blue-600" />
                    Switch to Fullscreen Mode
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-between">
                <Button variant="outline" onClick={onClose}>
                    Stay in Window Mode
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onConfirm}>
                    Enable Fullscreen
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default CodeEditor;