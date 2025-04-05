// import React from 'react'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { Textarea } from '../ui/textarea'
// import { Button } from '../ui/button'
// import { Plus, Save, Trash2 } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// import { Switch } from '../ui/switch'

// const AddProblem = ({ newProblem, setNewProblem, setIsAddingProblem, handleCreateProblem, handleAddTestCase, removeTestCase, updateTestCase }) => {
//     return (
//         <Card className="border-2 py-0  border-blue-200 shadow-md">
//             <CardHeader className="bg-blue-50 p-5 rounded-t-xl">
//                 <CardTitle>Create New Problem</CardTitle>
//                 <CardDescription>Create a new coding problem and add test cases</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//                 <div className="space-y-4">
//                     <div>
//                         <Label htmlFor="problem-title">Title</Label>
//                         <Input
//                             id="problem-title"
//                             placeholder="Enter problem title"
//                             value={newProblem.title}
//                             onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
//                             className="mt-1"
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="problem-description">Description</Label>
//                         <Textarea
//                             id="problem-description"
//                             placeholder="Enter problem description"
//                             value={newProblem.description}
//                             onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
//                             className="mt-1 min-h-32"
//                         />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <Label htmlFor="difficulty">Difficulty</Label>
//                             <Select
//                                 value={newProblem.difficultyLevel}
//                                 onValueChange={(value) => setNewProblem({ ...newProblem, difficultyLevel: value })}
//                             >
//                                 <SelectTrigger className="mt-1">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Easy">Easy</SelectItem>
//                                     <SelectItem value="Medium">Medium</SelectItem>
//                                     <SelectItem value="Hard">Hard</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         {/* <div>
//                             <Label htmlFor="time-limit">Time Limit (ms)</Label>
//                             <Input
//                                 id="time-limit"
//                                 type="number"
//                                 value={newProblem.timeLimit}
//                                 onChange={(e) => setNewProblem({ ...newProblem, timeLimit: parseInt(e.target.value) })}
//                                 className="mt-1"
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor="memory-limit">Memory Limit (MB)</Label>
//                             <Input
//                                 id="memory-limit"
//                                 type="number"
//                                 value={newProblem.memoryLimit}
//                                 onChange={(e) => setNewProblem({ ...newProblem, memoryLimit: parseInt(e.target.value) })}
//                                 className="mt-1"
//                             />
//                         </div> */}
//                         <div>
//                             <Label htmlFor="points">Points</Label>
//                             <Input
//                                 id="points"
//                                 type="number"
//                                 value={newProblem.points}
//                                 onChange={(e) => setNewProblem({ ...newProblem, points: parseInt(e.target.value) })}
//                                 className="mt-1"
//                             />
//                         </div>
//                         <div className="flex items-end space-x-2">
//                             <div className="pt-6">
//                                 <Switch
//                                     id="problem-visibility"
//                                     checked={newProblem.isVisible}
//                                     onCheckedChange={(checked) => setNewProblem({ ...newProblem, isVisible: checked })}
//                                 />
//                             </div>
//                             <Label htmlFor="problem-visibility" className="pb-2">Visible to students</Label>
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex justify-between items-center mb-2">
//                             <Label>Test Cases</Label>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={handleAddTestCase}
//                                 className="text-xs"
//                             >
//                                 <Plus className="h-3 w-3 mr-1" /> Add Test Case
//                             </Button>
//                         </div>

//                         {newProblem.testCases.map((testCase, index) => (
//                             <div key={index} className="p-4 border rounded-md mb-3 bg-gray-50">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <h4 className="font-medium">Test Case #{index + 1}</h4>
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => removeTestCase(index)}
//                                         className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     <div>
//                                         <Label htmlFor={`input-${index}`}>Input</Label>
//                                         <Textarea
//                                             id={`input-${index}`}
//                                             placeholder="Test case input"
//                                             value={testCase.input}
//                                             onChange={(e) => updateTestCase(index, 'input', e.target.value)}
//                                             className="mt-1 font-mono text-sm"
//                                             rows={3}
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label htmlFor={`output-${index}`}>Expected Output</Label>
//                                         <Textarea
//                                             id={`output-${index}`}
//                                             placeholder="Expected output"
//                                             value={testCase.output}
//                                             onChange={(e) => updateTestCase(index, 'output', e.target.value)}
//                                             className="mt-1 font-mono text-sm"
//                                             rows={3}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </CardContent>
//             <CardFooter className="border-t rounded-b-xl bg-gray-50 px-6 py-4">
//                 <div className="flex justify-end space-x-4 w-full">
//                     <Button onClick={() => setIsAddingProblem(false)}
//                         className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#d6dbe0] hover:bg-[#caccce] bg-[#e8ecf02a] text-[#4a516d]">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleCreateProblem}
//                         className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
//                         <Save className="mr-2 h-4 w-4" /> Save Problem
//                     </Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }

// export default AddProblem
