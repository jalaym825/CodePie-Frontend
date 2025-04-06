import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Calendar, Clock, Save } from 'lucide-react'
import DateRangePickerOnly from '../../components/ui/DateandTimePicker'

const NewContest = ({ newContest, setNewContest, setIsAddingContest, handleCreateContest}) => {

    return (
        <Card className="border-2 py-0 h-[90vh] overflow-auto border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 p-5 rounded-t-xl">
                <CardTitle>Create New Contest</CardTitle>
                <CardDescription>Fill in the details to create a new coding contest</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="contest-title">Contest Title</Label>
                        <Input
                            id="contest-title"
                            placeholder="Enter contest title"
                            value={newContest.title}
                            onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="contest-description">Description</Label>
                        <Textarea
                            id="contest-description"
                            placeholder="Enter contest description"
                            value={newContest.description}
                            onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
                            className="mt-1 min-h-24"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="start-time">Start Time</Label>
                            <input
                                type="datetime-local"
                                name="start-time"
                                value={newContest.startTime}
                                onChange={(e) => setNewContest({ ...newContest, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end-time">End Time</Label>
                            <div className="flex mt-1 items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <input
                                    type="datetime-local"
                                    name="end-time"
                                    value={newContest.endTime}
                                    onChange={(e) => setNewContest({ ...newContest, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="contest-visibility"
                            checked={newContest.isVisible}
                            onCheckedChange={(checked) => setNewContest({ ...newContest, isVisible: checked })}
                        />
                        <Label htmlFor="contest-visibility">Visible to students</Label>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t rounded-b-xl bg-gray-50 px-6 py-4">
                <div className="flex justify-end space-x-4 w-full">
                    <Button onClick={() => setIsAddingContest(false)}
                        className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#d6dbe032] hover:bg-[#caccce] bg-[#e8ecf02a] text-[#4a516d]">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateContest}
                        className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                        <Save className="mr-2 h-4 w-4" /> Save Contest
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default NewContest
