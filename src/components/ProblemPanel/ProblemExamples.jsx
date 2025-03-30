import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProblemExamples = ({ selectedProblem }) => {
    return (
        <div className="space-y-6 p-2">
            {selectedProblem.examples.map((example, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Example {index + 1}
                    </h3>

                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">
                            Input:
                        </h4>
                        <Card className="bg-gray-50 p-0">
                            <CardContent className="p-3">
                                <pre className="whitespace-pre-wrap">{example.input}</pre>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">
                            Output:
                        </h4>
                        <Card className="bg-gray-50 p-0">
                            <CardContent className="p-3">
                                <pre className="whitespace-pre-wrap">{example.output}</pre>
                            </CardContent>
                        </Card>
                    </div>

                    {example.explanation && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
                                Explanation:
                            </h4>
                            <div className="text-sm bg-gray-50 p-3 rounded-md">
                                {example.explanation}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProblemExamples;