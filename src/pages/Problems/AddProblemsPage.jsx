import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import MDEditor from '@uiw/react-md-editor';

const AddProblemsPage = () => {
    const navigate = useNavigate();
    const { contestId } = useParams();
    const { createContestProblem } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const [newProblem, setNewProblem] = useState({
        contestId: contestId,
        title: '',
        description: '',
        difficultyLevel: '',
        timeLimit: 1000,
        memoryLimit: 256,
        points: '',
        isVisible: true,
        testCases: [
            { input: '', output: '', explanation: '', isHidden: false },
        ],
        isPractice: false
    });
    const [errors, setErrors] = useState({});

    const updateTestCase = (index, field, value) => {
        const updatedTestCases = [...newProblem.testCases];
        updatedTestCases[index][field] = value;
        setNewProblem({ ...newProblem, testCases: updatedTestCases });
    };

    const handleAddTestCase = () => {
        setNewProblem({
            ...newProblem,
            testCases: [
                ...newProblem.testCases,
                { input: '', output: '', explanation: '', isHidden: false },
            ],
        });
    };

    const removeTestCase = (index) => {
        const updatedTestCases = [...newProblem.testCases];
        updatedTestCases.splice(index, 1);
        setNewProblem({ ...newProblem, testCases: updatedTestCases });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newProblem.title.trim()) newErrors.title = 'Title is required';
        if (!newProblem.description.trim()) newErrors.description = 'Description is required';
        if (!newProblem.difficultyLevel.trim()) newErrors.difficulty = 'Difficulty is required';
        if (!newProblem.points) newErrors.points = 'Points is required';
        if (!newProblem.testCases.length) newErrors.testCases = 'Test cases are required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateProblem = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const formattedTestCases = newProblem.testCases.map((test) => ({
            input: test.input || '',
            output: test.output || '',
            explanation: test.explanation || null,
            isHidden: test.isHidden || false,
            difficulty: newProblem.difficultyLevel,
            points: newProblem.points,
        }));

        const payload = {
            ...newProblem,
            testCases: formattedTestCases,
        };
        console.log(payload);
        const res = await createContestProblem(payload);

        if (res?.status === 201) {
            toast.success(res.message);
            setLoading(false);
            navigate('/contests');
        } else {
            toast.error(res?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleCancel = () => navigate('/contests');

    return (
        <div className="min-h-screen bg-blue-50 relative overflow-hidden flex flex-col items-center justify-center py-12">
            <div className="absolute inset-0 z-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                    }}
                />
            </div>

            <div className="text-center mt-20 mb-8 z-10">
                <h1 className="text-3xl font-bold text-gray-800">Create New Problem</h1>
                <p className="text-gray-600 mt-2">Set up your coding contest details</p>
            </div>

            <div className="w-full max-w-4xl mx-auto z-10 px-4">
                <Card className="border-2 py-0 border-blue-200 shadow-md">
                    <CardHeader className="bg-blue-50 p-5 rounded-t-xl">
                        <CardTitle>Create New Problem</CardTitle>
                        <CardDescription>Create a new coding problem and add test cases</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <Label htmlFor="problem-title">Title</Label>
                            <Input
                                id="problem-title"
                                placeholder="Enter problem title"
                                value={newProblem.title}
                                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                className="mt-1"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <Label htmlFor="problem-description">Description</Label>
                            <div data-color-mode="light">

                            <MDEditor
                                value={newProblem.description}
                                onChange={(value) => setNewProblem({ ...newProblem, description: value || '' })}
                                height={300}
                                theme='light'
                                className='mt-2'
                                // preview="edit"
                            />
                        </div>

                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select
                                    value={newProblem.difficultyLevel}
                                    onValueChange={(value) => setNewProblem({ ...newProblem, difficultyLevel: value })}
                                >
                                    <SelectTrigger className="mt-1 w-[200px]">
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EASY">Easy</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HARD">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    value={newProblem.points}
                                    onChange={(e) => setNewProblem({ ...newProblem, points: parseInt(e.target.value) })}
                                    className="mt-1"
                                />
                                {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
                            </div>
                            <div className="flex items-end space-x-2">
                                <div className="pt-6">
                                    <Switch
                                        id="problem-visibility"
                                        checked={newProblem.isVisible}
                                        onCheckedChange={(checked) => setNewProblem({ ...newProblem, isVisible: checked })}
                                    />
                                </div>
                                <Label htmlFor="problem-visibility" className="pb-2">Visible to students</Label>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Test Cases</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddTestCase}
                                    className="text-xs"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Add Test Case
                                </Button>
                            </div>

                            {newProblem.testCases.map((testCase, index) => (
                                <div key={index} className="p-4 border rounded-md mb-3 bg-gray-50 space-y-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-medium">Test Case #{index + 1}</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTestCase(index)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Input</Label>
                                            <Textarea
                                                value={testCase.input}
                                                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                                className="mt-1 font-mono text-sm"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <Label>Expected Output</Label>
                                            <Textarea
                                                value={testCase.output}
                                                onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                                                className="mt-1 font-mono text-sm"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Explanation</Label>
                                        <Textarea
                                            value={testCase.explanation}
                                            onChange={(e) => updateTestCase(index, 'explanation', e.target.value)}
                                            className="mt-1 font-mono text-sm"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={testCase.isHidden}
                                            onCheckedChange={(value) => updateTestCase(index, 'isHidden', value)}
                                        />
                                        <Label>Hidden Test Case</Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="border-t rounded-b-xl bg-gray-50 px-6 py-4">
                        <div className="flex justify-end space-x-4 w-full">
                            <Button
                                onClick={handleCancel}
                                className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#d6dbe0] hover:bg-[#caccce] bg-[#e8ecf02a] text-[#4a516d]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProblem}
                                disabled={loading}
                                className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Problem
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AddProblemsPage;
