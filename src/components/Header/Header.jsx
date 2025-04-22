import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Code2, Link as LinkIcon, Maximize, Minimize } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { EditorSettingsContext } from '../../context/EditorSettingsContext';
import { languages } from '../../helpers/editorData';

const Header = () => {
    const { selectedProblem, setSelectedProblem, contest } = useContext(CodeExecutionContext);
    const {
        isFullscreen,
        toggleFullscreen,
        language,
        setLanguage,
    } = useContext(EditorSettingsContext);

    const navigate = useNavigate();
    const { contestId } = useParams();

    const handleProblemChange = (problemId) => {
        const problem = contest.problems.find((p) => p.id === problemId);
        if (problem) {
            setSelectedProblem(problem.id);
            navigate(`/contests/${contestId}/problems/${problem.id}`);
        }
    };

    const goToContest = () => {
        navigate(`/contests/${contestId}/problems`);
    };

    return (
        <div className="flex justify-between items-center p-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>

                <div className="flex items-center space-x-2">

                    <div className="font-bold text-sm text-gray-700 dark:text-gray-300">
                        {contest.title || "Contest"}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToContest}
                        className="flex items-center text-xs h-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    >
                        <LinkIcon className="h-3 w-3" />
                    </Button>
                </div>
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