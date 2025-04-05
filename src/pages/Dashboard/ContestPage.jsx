import React, { useState } from 'react'
import AddProblem from '../../components/CreateContest/AddProblem'
import { Award, Check, Edit, Trash, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const ContestPage = () => {
    const [problems, setProblems] = useState([
        {
            id: 1,
            contestId: 1,
            title: 'Balanced Parentheses',
            description: 'Check if the input string has balanced parentheses',
            difficultyLevel: 'Medium',
            timeLimit: 1000,
            memoryLimit: 256,
            points: 100,
            isVisible: true,
            testCases: [
                { input: '(())', output: 'true' },
                { input: '(()))', output: 'false' }
            ]
        },
        {
            id: 2,
            contestId: 1,
            title: 'Merge K Sorted Lists',
            description: 'Merge k sorted linked lists and return it as one sorted list.',
            difficultyLevel: 'Hard',
            timeLimit: 2000,
            memoryLimit: 512,
            points: 200,
            isVisible: true,
            testCases: [
                { input: '[[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }
            ]
        },
        {
            id: 3,
            contestId: 2,
            title: 'Binary Tree Traversal',
            description: 'Implement in-order, pre-order and post-order traversals',
            difficultyLevel: 'Easy',
            timeLimit: 500,
            memoryLimit: 128,
            points: 50,
            isVisible: true,
            testCases: [
                { input: '[1,null,2,3]', output: '[1,3,2]' }
            ]
        }
    ]);
    const [isAddingProblem, setIsAddingProblem] = useState(false);
    const [newProblem, setNewProblem] = useState({
        contestId: '',
        title: '',
        description: '',
        difficultyLevel: 'Medium',
        timeLimit: 1000,
        memoryLimit: 256,
        points: 100,
        isVisible: true,
        testCases: [{ input: '', output: '' }]
    });
    const handleCreateProblem = () => {
        const id = problems.length + 1;
        const newProblemWithId = { ...newProblem, id };
        setProblems([...problems, newProblemWithId]);

        // Add problem reference to associated contest
        const updatedContests = contests.map(contest => {
            if (contest.id === parseInt(newProblem.contestId)) {
                return {
                    ...contest,
                    problems: [...contest.problems, {
                        id,
                        title: newProblem.title,
                        difficultyLevel: newProblem.difficultyLevel
                    }]
                };
            }
            return contest;
        });

        setContests(updatedContests);
        setNewProblem({
            contestId: '',
            title: '',
            description: '',
            difficultyLevel: 'Medium',
            timeLimit: 1000,
            memoryLimit: 256,
            points: 100,
            isVisible: true,
            testCases: [{ input: '', output: '' }]
        });
        setIsAddingProblem(false);
    };
    const handleAddTestCase = () => {
        setNewProblem({
            ...newProblem,
            testCases: [...newProblem.testCases, { input: '', output: '' }]
        });
    };

    const updateTestCase = (index, field, value) => {
        const updatedTestCases = [...newProblem.testCases];
        updatedTestCases[index][field] = value;
        setNewProblem({
            ...newProblem,
            testCases: updatedTestCases
        });
    };

    const removeTestCase = (index) => {
        const updatedTestCases = [...newProblem.testCases];
        updatedTestCases.splice(index, 1);
        setNewProblem({
            ...newProblem,
            testCases: updatedTestCases
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Hard': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="max-w-7xl mt-18 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Contest Details Section */}
            <div className=" bg-blue-400   rounded-xl shadow-lg mb-8 p-6 text-white">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{ "Contest Title"}</h1>
                        <p className="mb-4 text-blue-100">{ "Contest description goes here. This provides details about what participants can expect and the goals of the competition."}</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                                <div className="text-xs uppercase tracking-wide text-blue-100">Start Time</div>
                                <div className="font-semibold">{ "Apr 5, 2025 - 10:00 AM"}</div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                                <div className="text-xs uppercase tracking-wide text-blue-100">End Time</div>
                                <div className="font-semibold">{ "Apr 7, 2025 - 10:00 PM"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Problem Section */}
            <div className="mb-8">
                <AddProblem
                    newProblem={newProblem}
                    setNewProblem={setNewProblem}
                    handleCreateProblem={handleCreateProblem}
                    handleAddTestCase={handleAddTestCase}
                    setIsAddingProblem={setIsAddingProblem}
                    updateTestCase={updateTestCase}
                    removeTestCase={removeTestCase}
                />
            </div>

            {/* Problems Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Contest Problems</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {problems.length > 0 ? (
                                problems.map((problem) => (
                                    <tr key={problem.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{problem.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{problem.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags?.map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {tag}
                                                    </span>
                                                )) || (
                                                        <span className="text-gray-500 text-sm">No tags</span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getDifficultyColor(problem.difficultyLevel)}>
                                                {problem.difficultyLevel}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                                <span className="font-medium">{problem.points}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {problem.isVisible ? (
                                                <div className="flex items-center text-green-600">
                                                    <Check className="h-4 w-4 mr-1" />
                                                    <span>Visible</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-500">
                                                    <X className="h-4 w-4 mr-1" />
                                                    <span>Hidden</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50">
                                                    <Trash className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <FileX className="h-12 w-12 text-gray-400 mb-2" />
                                            <p className="text-lg font-medium">No problems added yet</p>
                                            <p className="text-sm">Create a new problem to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ContestPage
