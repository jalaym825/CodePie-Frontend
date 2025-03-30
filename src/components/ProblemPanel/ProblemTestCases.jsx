import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Loader2, Play } from 'lucide-react';

const ProblemTestCases = ({
    selectedProblem,
    testResults,
    isTestingAll,
    runTestCase,
    runAllTests
}) => {
    return (
        <div className="space-y-4 p-2">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold">Test Cases</h3>
                <Button
                    onClick={runAllTests}
                    disabled={isTestingAll}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isTestingAll ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Run All Tests
                        </>
                    )}
                </Button>
            </div>

            <div className="text-xs text-gray-500 mb-1">
                Note: Hidden test cases are not displayed but will be checked on submission.
            </div>

            {selectedProblem.testCases
                .filter((tc) => !tc.isHidden)
                .map((testCase, index) => (
                    <Card
                        key={index}
                        className="bg-gray-50 border-gray-200 p-0 gap-0 overflow-hidden"
                    >
                        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between bg-gray-200">
                            <div className="font-medium">
                                Test Case {index + 1}
                            </div>
                            {testResults[index] && (
                                <Badge
                                    className={
                                        testResults[index].passed
                                            ? 'bg-green-600'
                                            : 'bg-red-600'
                                    }
                                >
                                    {testResults[index].passed
                                        ? 'Passed'
                                        : 'Failed'}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                <AccordionItem
                                    value="input"
                                    className="border-gray-200"
                                >
                                    <AccordionTrigger className="text-sm py-2">
                                        Input
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                            {testCase.input}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="expected"
                                    className="border-gray-200"
                                >
                                    <AccordionTrigger className="text-sm py-2">
                                        Expected Output
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                            {testCase.output}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                {testResults[index] && (
                                    <AccordionItem
                                        value="actual"
                                        className="border-gray-200"
                                    >
                                        <AccordionTrigger className="text-sm py-2">
                                            Your Output
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                                {testResults[index].actual}
                                            </pre>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                            </Accordion>

                            <div className="flex justify-end mt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs bg-white hover:bg-gray-50 border-gray-200"
                                    onClick={() => runTestCase(testCase, index)}
                                >
                                    Run Test
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
};

export default ProblemTestCases;