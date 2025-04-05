// components/Result/TestResultDialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock, Server, Code } from "lucide-react";
import { useState } from "react";

export default function TestResultDialog({ open, onOpenChange, testCases, testResults }) {
    const [selectedCase, setSelectedCase] = useState(null);
    
    const getStatusForCase = (id) => testResults.find((res) => res.testCaseId === id);
    
    // Calculate overall submission result
    const totalTests = testCases.length;
    const completedTests = testResults.length;
    const passedTests = testResults.filter(res => res.status?.description === "Accepted").length;
    
    const isSubmissionComplete = completedTests === totalTests && totalTests > 0;
    const isSubmissionSuccessful = passedTests === totalTests && totalTests > 0;
    
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-100";
        switch (status.description) {
            case "Accepted": return "bg-green-100 border-green-300";
            case "Wrong Answer": return "bg-red-100 border-red-300";
            case "Time Limit Exceeded": return "bg-yellow-100 border-yellow-300";
            case "Compilation Error": return "bg-orange-100 border-orange-300";
            case "Runtime Error": return "bg-pink-100 border-pink-300";
            default: return "bg-gray-100 border-gray-300";
        }
    };
    
    const getStatusIcon = (status) => {
        if (!status) return <Loader2 className="animate-spin text-gray-400" size={18} />;
        
        switch (status.description) {
            case "Accepted":
                return <CheckCircle className="text-green-600" size={18} />;
            case "Wrong Answer":
                return <XCircle className="text-red-600" size={18} />;
            case "Time Limit Exceeded":
                return <Clock className="text-yellow-600" size={18} />;
            case "Compilation Error":
                return <Code className="text-orange-600" size={18} />;
            case "Runtime Error":
                return <AlertCircle className="text-pink-600" size={18} />;
            default:
                return <AlertCircle className="text-gray-600" size={18} />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-[50vw] p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Test Results
                        {isSubmissionComplete && (
                            <span className={`ml-3 text-sm py-1 px-3 rounded-full ${isSubmissionSuccessful ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {isSubmissionSuccessful ? "All Tests Passed" : "Some Tests Failed"}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>
                
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <h3 className="font-semibold text-blue-800 mb-2">Submission Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className={`font-medium ${isSubmissionSuccessful ? "text-green-600" : "text-red-600"}`}>
                                {isSubmissionComplete ? (isSubmissionSuccessful ? "Accepted" : "Failed") : "Running..."}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Passed</span>
                            <span className="font-medium text-blue-700">{passedTests}/{totalTests} tests</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Progress</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div 
                                    className={`h-2.5 rounded-full ${isSubmissionSuccessful ? "bg-green-600" : "bg-blue-600"}`} 
                                    style={{ width: `${(completedTests / totalTests) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Test Cases Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 p-[4px]">
                    {testCases.map((testCase, index) => {
                        const result = getStatusForCase(testCase.id);
                        return (
                            <div
                                key={testCase.id}
                                className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all hover:shadow-md 
                                ${getStatusColor(result?.status)} ${selectedCase === testCase.id ? "ring-2 ring-blue-400" : ""}`}
                                onClick={() => setSelectedCase(testCase.id === selectedCase ? null : testCase.id)}
                            >
                                <div className="flex justify-between">
                                    <div className="font-medium">Test Case {index + 1}</div>
                                    <div className="flex items-center">
                                        {testCase.isHidden && 
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mr-1">
                                                Hidden
                                            </span>
                                        }
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(result?.status)}
                                    <span className="text-sm text-gray-700 truncate">
                                        {result ? result.status.description : "Pending"}
                                    </span>
                                </div>
                                
                                {result && (
                                    <div className="text-xs flex flex-wrap items-center gap-2 mt-2 text-gray-500">
                                        <div className="flex items-center whitespace-nowrap">
                                            <Clock size={14} className="mr-1 flex-shrink-0" />
                                            {result.time}s
                                        </div>
                                        {result.memory && (
                                            <div className="flex items-center whitespace-nowrap">
                                                <Server size={14} className="mr-1 flex-shrink-0" />
                                                {(result.memory/1024).toFixed(1)} MB
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Detail Section */}
                {selectedCase && (
                    <div className="border-t pt-3">
                        <h3 className="font-medium text-gray-700 mb-2">Test Case Details</h3>
                        
                        {(() => {
                            const testCase = testCases.find(tc => tc.id === selectedCase);
                            const result = getStatusForCase(selectedCase);
                            
                            if (!testCase) return <div>Test case not found</div>;
                            
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="border rounded-lg p-3 bg-gray-50">
                                        <h4 className="text-sm font-medium text-gray-600 mb-1">Input</h4>
                                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                            {testCase.input || "No input"}
                                        </pre>
                                    </div>
                                    <div className="border rounded-lg p-3 bg-gray-50">
                                        <h4 className="text-sm font-medium text-gray-600 mb-1">Expected Output</h4>
                                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                            {testCase.output || "No output"}
                                        </pre>
                                    </div>
                                    {result && (
                                        <div className="border rounded-lg p-3 bg-gray-50 md:col-span-2">
                                            <h4 className="text-sm font-medium text-gray-600 mb-1">Your Output</h4>
                                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                {result.stdout || result.stderr || "No output"}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}
                
                <DialogFooter className="">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    {isSubmissionComplete && isSubmissionSuccessful && (
                        <Button 
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Next Problem
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}