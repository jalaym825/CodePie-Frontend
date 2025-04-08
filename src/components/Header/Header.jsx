import React, { useContext } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Maximize, Minimize, Code2 } from 'lucide-react';
import { languages } from '../../helpers/editorData';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { EditorSettingsContext } from '../../context/EditorSettingsContext';
import { useNavigate, useParams } from 'react-router';

const Header = () => {
    const { selectedProblem, setSelectedProblem, contest } = useContext(CodeExecutionContext);
    const {
        isFullscreen,
        toggleFullscreen,
        // showSettings,
        // toggleSettings,
        language,
        setLanguage,
    } = useContext(EditorSettingsContext);

    // const navigate = useNavigate();
    // const { contestId } = useParams();
    
    const handleProblemChange = (problemId) => {
        const problem = contest.problems.find((p) => p.id === problemId);
        if (problem) {
            setSelectedProblem(problem.id);
            // navigate(`/contests/${contestId}/problems/${problem.id}`);
        }
    };

    return (
        <div className="flex justify-between items-center p-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-1">
                <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">CodePie</h1>
            </div>

            <div className="flex space-x-2 items-center">
                <Select value={language.name} onValueChange={e => setLanguage(e)}>
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 h-8 text-xs">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                        {Object.entries(languages).map(([lang, info]) => (
                            <SelectItem key={info.id} value={lang} className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedProblem.id}
                    onValueChange={handleProblemChange}
                >
                    <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 h-8 text-xs">
                        <SelectValue placeholder="Problem" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                        {contest.problems.map((problem) => (
                            <SelectItem key={problem.id} value={problem.id} className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
                                {problem.title} ({problem.difficultyLevel})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullscreen}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8"
                            >
                                {isFullscreen ? (
                                    <Minimize className="h-4 w-4" />
                                ) : (
                                    <Maximize className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100">
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default Header;