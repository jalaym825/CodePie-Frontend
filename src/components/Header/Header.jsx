import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Maximize, Minimize, Code2 } from 'lucide-react';
import { problems } from '../../helpers/editorData';

const Header = ({
    language,
    setLanguage,
    selectedProblem,
    handleProblemChange,
    isFullscreen,
    toggleFullscreen,
    // showSettings,
    // toggleSettings,
    languages
}) => {
    return (
        <div className="flex justify-between items-center p-2 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-1">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-bold text-blue-600">CodePie</h1>
            </div>

            <div className="flex space-x-2 items-center">
                {/* <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSettings}
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}

                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-800 h-8 text-xs">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-800">
                        {languages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id.toString()} className="text-xs">
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedProblem.id}
                    onValueChange={handleProblemChange}
                >
                    <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-800 h-8 text-xs">
                        <SelectValue placeholder="Problem" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-800">
                        {problems.map((problem) => (
                            <SelectItem key={problem.id} value={problem.id} className="text-xs">
                                {problem.title} ({problem.difficulty})
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
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
                            >
                                {isFullscreen ? (
                                    <Minimize className="h-4 w-4" />
                                ) : (
                                    <Maximize className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default Header;