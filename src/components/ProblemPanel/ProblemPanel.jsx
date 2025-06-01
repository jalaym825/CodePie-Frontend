import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlignLeft, Book, Loader2, Save, TestTube } from 'lucide-react';
import { useContext } from 'react';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import ProblemDescription from './ProblemDescription';
import ProblemTestCases from './ProblemTestCases';
import { History } from 'lucide-react';
import HistoryPanel from '../IOPanel/HistoryPanel';

const ProblemPanel = ({ className }) => {
    const {
        selectedProblem,
        // testResults,
        isTestingAll,
        // runTestCase,
        // runAllTests,
        submitSolution,
        recentSubmissions
    } = useContext(CodeExecutionContext);

    return (
        <div className={`${className} rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full`}>
            <Card className="flex flex-col bg-white dark:bg-gray-800 border-0 text-gray-800 dark:text-gray-100 h-full rounded-none p-0 gap-0">
                <CardHeader className="py-2 px-3 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-sm font-medium">
                            <Book className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                            <div>
                                <div className="flex items-center gap-1 text-md font-bold">
                                    {selectedProblem.title}
                                    <Badge className="ml-1 bg-blue-600 dark:bg-blue-700 dark:text-white text-xs">
                                        {selectedProblem.difficultyLevel}
                                    </Badge>
                                </div>
                                <CardDescription className="text-gray-500 dark:text-gray-400 text-xs mt-0">
                                    Time: {selectedProblem.timeLimit}s | Mem: {selectedProblem.memoryLimit}MB
                                </CardDescription>
                            </div>
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow overflow-hidden p-0 min-h-0 h-full">
                    <Tabs defaultValue="description" className="h-full flex flex-col">
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 border-b border-t border-gray-200 dark:border-gray-700 flex-shrink-0'>
                            <TabsList className="bg-gray-50 dark:bg-gray-900 w-full justify-start rounded-none">
                                <TabsTrigger value="description" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                                    <AlignLeft className="mr-1 h-4 w-4" />
                                    Description
                                </TabsTrigger>
                                <TabsTrigger value="tests" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                                    <TestTube className="mr-1 h-4 w-4" />
                                    Test Cases
                                </TabsTrigger>
                               <TabsTrigger 
                            value="history" 
                         className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                        >
                            <History className="mr-1 h-3 w-3" />
                            Submissions
                        </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="overflow-auto flex-1 flex flex-col h-full min-h-0 dark:bg-gray-800">
                            <TabsContent value="description" className="mt-0 h-full overflow-auto flex-1 min-h-0">
                                <ProblemDescription />
                            </TabsContent>
                            <TabsContent value="tests" className="mt-0 h-full overflow-auto flex-1 min-h-0">
                                <ProblemTestCases />
                            </TabsContent>
                              <TabsContent value="history" className="h-full m-0 p-0">
                        <HistoryPanel recentSubmissions={recentSubmissions} />
                    </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>

                <CardFooter className="justify-end py-2 px-3 bg-gray-50 dark:bg-gray-900 border-t-1 border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <Button
                        onClick={submitSolution}
                        disabled={isTestingAll}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 h-8 text-xs"
                    >
                        {isTestingAll ? (
                            <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Save className="mr-1 h-3 w-3" />
                                Submit
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProblemPanel;