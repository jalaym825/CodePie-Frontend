import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import { Check, ChevronsUpDown, Plus, Save, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { UserContext } from '../../context/UserContext';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import axios from 'axios';

// DSA topics for the multiselector
const dsaTopics = [
    { value: "arrays", label: "Arrays" },
    { value: "strings", label: "Strings" },
    { value: "linked_lists", label: "Linked Lists" },
    { value: "stacks", label: "Stacks" },
    { value: "queues", label: "Queues" },
    { value: "trees", label: "Trees" },
    { value: "graphs", label: "Graphs" },
    { value: "hash_tables", label: "Hash Tables" },
    { value: "heaps", label: "Heaps" },
    { value: "dynamic_programming", label: "Dynamic Programming" },
    { value: "greedy_algorithms", label: "Greedy Algorithms" },
    { value: "sorting", label: "Sorting" },
    { value: "searching", label: "Searching" },
    { value: "recursion", label: "Recursion" },
    { value: "backtracking", label: "Backtracking" },
    { value: "bit_manipulation", label: "Bit Manipulation" },
    { value: "divide_and_conquer", label: "Divide and Conquer" },
    { value: "sliding_window", label: "Sliding Window" },
    { value: "two_pointers", label: "Two Pointers" },
    { value: "math", label: "Mathematics" },
];

const AddProblemsPage = () => {
    const navigate = useNavigate();
    const { contestId } = useParams();
    const { createContestProblem } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);

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
            { input: '', output: '', explanation: '', isHidden: false, difficulty: '' },
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
                { input: '', output: '', explanation: '', isHidden: false, difficulty: newProblem.difficultyLevel || '' },
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

        // Validate test case difficulties
        newProblem.testCases.forEach((testCase, index) => {
            if (!testCase.difficulty) {
                if (!newErrors.testCases) newErrors.testCases = {};
                newErrors.testCases[index] = 'Test case difficulty is required';
            }
        });

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
            difficulty: test.difficulty,
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
            navigate(`/contests/${contestId}/problems`);
        } else {
            toast.error(res?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    // Update all test case difficulties when main difficulty changes
    const handleMainDifficultyChange = (value) => {
        const updatedTestCases = newProblem.testCases.map(testCase => ({
            ...testCase,
            difficulty: value
        }));

        setNewProblem({
            ...newProblem,
            difficultyLevel: value,
            testCases: updatedTestCases
        });
    };

    // Handle topic selection
    const toggleTopic = (topic) => {
        setSelectedTopics(current =>
            current.some(item => item.value === topic.value)
                ? current.filter(item => item.value !== topic.value)
                : [...current, topic]
        );
    };

    // Remove a selected topic
    const removeTopic = (topicValue) => {
        setSelectedTopics(current =>
            current.filter(topic => topic.value !== topicValue)
        );
    };

    // Generate problem from API
    const generateProblem = async () => {
        if (selectedTopics.length === 0) {
            toast.error("Please select at least one DSA topic");
            return;
        }

        setGenerating(true);
        try {
            const topics = selectedTopics.map(topic => topic.value);
            const response = await axios.post('http://localhost:3000/problems/generate', { topics, difficulty: newProblem.difficultyLevel }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });


            if (response && response.data) {
                const { data } = response.data;

                // Map test cases from the response format to our format
                const mappedTestCases = data.testCases.map(tc => ({
                    input: tc.input || '',
                    output: tc.output || '',
                    explanation: tc.explanation || '',
                    isHidden: tc.hidden || false,
                    difficulty: tc.difficulty || data.difficulty || '',
                }));

                // Update the form with the response data
                setNewProblem({
                    ...newProblem,
                    title: data.title || '',
                    description: data.md || data.description || '',
                    difficultyLevel: data.difficulty || '',
                    points: data.points || newProblem.points,
                    testCases: mappedTestCases.length > 0 ? mappedTestCases : newProblem.testCases,
                });

                toast.success("Problem generated successfully!");
            } else {
                toast.error("Invalid response format");
            }
        } catch (error) {
            console.error("Error generating problem:", error);
            toast.error("Failed to generate problem: " + error.message);
        } finally {
            setGenerating(false);
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
                        {/* DSA Topics Multiselector */}
                        <div className="space-y-2">
                            <Label htmlFor="dsa-topics">DSA Topics</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedTopics.map(topic => (
                                    <Badge
                                        key={topic.value}
                                        variant="secondary"
                                        className="pl-2 pr-1 py-1 flex items-center gap-1"
                                    >
                                        {topic.label}
                                        <button
                                            className="ml-1 rounded-full hover:bg-gray-200 p-1"
                                            onClick={() => removeTopic(topic.value)}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                    >
                                        {selectedTopics.length > 0
                                            ? `${selectedTopics.length} topics selected`
                                            : "Select DSA topics"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search topics..." />
                                        <CommandEmpty>No topic found.</CommandEmpty>
                                        <CommandGroup>
                                            {dsaTopics.map((topic) => (
                                                <CommandItem
                                                    key={topic.value}
                                                    onSelect={() => toggleTopic(topic)}
                                                    className="flex items-center"
                                                >
                                                    <div className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        selectedTopics.some(item => item.value === topic.value)
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50"
                                                    )}>
                                                        {selectedTopics.some(item => item.value === topic.value) && (
                                                            <Check className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                    {topic.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Select menu for problem difficulty */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="difficulty">Problem Difficulty</Label>
                            <Select
                                value={newProblem.difficultyLevel}
                                onValueChange={handleMainDifficultyChange}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EASY">Easy</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HARD">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Generate Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={generateProblem}
                                disabled={generating || selectedTopics.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {generating ? "Generating..." : "Generate Problem"}
                            </Button>
                        </div>

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
                                />
                            </div>

                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="difficulty">Problem Difficulty</Label>
                                <Select
                                    value={newProblem.difficultyLevel}
                                    onValueChange={handleMainDifficultyChange}
                                >
                                    <SelectTrigger className="mt-1 w-full">
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
                        </div>

                        {/* Test Cases */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Test Cases</Label>
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
                                                className="mt-1 font-geist-mono text-sm"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <Label>Expected Output</Label>
                                            <Textarea
                                                value={testCase.output}
                                                onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                                                className="mt-1 font-geist-mono text-sm"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Explanation</Label>
                                        <Textarea
                                            value={testCase.explanation}
                                            onChange={(e) => updateTestCase(index, 'explanation', e.target.value)}
                                            className="mt-1 font-geist-mono text-sm"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={testCase.isHidden}
                                                onCheckedChange={(value) => updateTestCase(index, 'isHidden', value)}
                                            />
                                            <Label>Hidden Test Case</Label>
                                        </div>
                                        <div className="w-48">
                                            <Label>Test Case Difficulty</Label>
                                            <Select
                                                value={testCase.difficulty}
                                                onValueChange={(value) => updateTestCase(index, 'difficulty', value)}
                                            >
                                                <SelectTrigger className="mt-1 w-full">
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="EASY">Easy</SelectItem>
                                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                                    <SelectItem value="HARD">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.testCases && errors.testCases[index] &&
                                                <p className="text-red-500 text-sm mt-1">{errors.testCases[index]}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end mt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleAddTestCase}
                                    className="text-sm"
                                    size={"sm"}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Test Case
                                </Button>
                            </div>

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