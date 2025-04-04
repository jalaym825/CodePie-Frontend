import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import ThemeToggle from '@/components/ui/ThemeToggle';

const EditorSettings = ({
    editorFontSize,
    setEditorFontSize,
    lineWrap,
    setLineWrap,
    autoFormat,
    setAutoFormat,
    showProblem,
    setShowProblem,
    setShowSettings
}) => {
    return (
        <Drawer open={true} direction="right" onOpenChange={(open) => !open && setShowSettings(false)}>
            <DrawerContent className="bg-white">
                <div className="mx-auto w-full max-w-4xl">
                    <DrawerHeader>
                        <div className="flex items-center">
                        <div className='flex flex-col space-x-2 flex-1'>
                            <DrawerTitle className="flex items-center text-gray-900 dark:text-gray-100">
                                <Settings className="mr-2 h-5 w-5" />
                                Editor Settings
                            </DrawerTitle>
                            <DrawerDescription className="text-gray-600 dark:text-gray-400">
                                Customize your editor experience
                            </DrawerDescription>
                        </div>
                        <ThemeToggle />
                        </div>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex flex-col gap-6">
                            {/* Font Size Control */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="font-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Font Size: {editorFontSize}px
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                                        onClick={() => {
                                            const newSize = Math.max(10, editorFontSize - 1);
                                            setEditorFontSize(newSize);
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                                        onClick={() => {
                                            const newSize = Math.min(24, editorFontSize + 1);
                                            setEditorFontSize(newSize);
                                        }}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Word Wrap Toggle */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="word-wrap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Word Wrap
                                </label>
                                <div>
                                    <Switch
                                        id="word-wrap"
                                        checked={lineWrap}
                                        onCheckedChange={setLineWrap}
                                        className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Auto Format Toggle */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="auto-format" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Auto Format On Run
                                </label>
                                <div>
                                    <Switch
                                        id="auto-format"
                                        checked={autoFormat}
                                        onCheckedChange={setAutoFormat}
                                        className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Problem Panel Toggle */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="show-problem" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Show Problem Panel
                                </label>
                                <div>
                                    <Switch
                                        id="show-problem"
                                        checked={showProblem}
                                        onCheckedChange={setShowProblem}
                                        className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Apply Changes
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default EditorSettings;