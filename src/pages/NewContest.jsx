import React, { useState, useEffect, useContext } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Clock, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { toast } from 'sonner'

const NewContestPage = () => {
    const navigate = useNavigate()
    const { createContest } = useContext(UserContext)
    const [loading, setLoading] = useState(false);
    const [newContest, setNewContest] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        isVisible: true
    })

    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!newContest.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!newContest.description.trim()) {
            newErrors.description = "Description is required"
        }

        if (!newContest.startTime) {
            newErrors.startTime = "Start time is required"
        }

        if (!newContest.endTime) {
            newErrors.endTime = "End time is required"
        }

        if (newContest.startTime && newContest.endTime &&
            new Date(newContest.startTime) >= new Date(newContest.endTime)) {
            newErrors.time = "End time must be after start time"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreateContest = async () => {
        if (!validateForm()) {
            return
        }
        setLoading(true);
        const res = await createContest(newContest);
        console.log(res)
        if (res?.status === 201) {
            toast.success(res.message);
            setLoading(false);
            navigate('/contests')
        } else {
            toast.error(res.data.message);
            setLoading(false);
        }

    }

    const handleCancel = () => {
        navigate('/contests')
    }

    return (
        <div className="min-h-screen bg-blue-50 relative overflow-hidden flex flex-col items-center justify-center py-12">
            {/* Patterned background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px"
                }}></div>
            </div>

            {/* Page title */}
            <div className="text-center mt-20 mb-8 z-10">
                <h1 className="text-3xl font-bold text-gray-800">Create New Contest</h1>
                <p className="text-gray-600 mt-2">Set up your coding contest details</p>
            </div>

            {/* Main content */}
            <div className="w-full max-w-4xl mx-auto z-10 px-4">
                <Card className="border shadow-lg p-0 gap-0 overflow-hidden">
                    <CardHeader className="bg-gray-50 p-6 border-b">
                        <CardTitle>Contest Details</CardTitle>
                        <CardDescription>Fill in all the required information below</CardDescription>
                    </CardHeader>

                    <CardContent className="py-6">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="contest-title">Contest Title</Label>
                                <Input
                                    id="contest-title"
                                    placeholder="Enter contest title"
                                    value={newContest.title}
                                    onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
                                    className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="contest-description">Description</Label>
                                <Textarea
                                    id="contest-description"
                                    placeholder="Enter contest description"
                                    value={newContest.description}
                                    onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
                                    className={`mt-1 min-h-24 ${errors.description ? 'border-red-500' : ''}`}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="start-time">Start Time</Label>
                                    <div className="flex mt-1 items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        <input
                                            id="start-time"
                                            type="datetime-local"
                                            value={newContest.startTime}
                                            onChange={(e) => setNewContest({ ...newContest, startTime: e.target.value })}
                                            className={`mt-1 ${errors.startTime ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="end-time">End Time</Label>
                                    <div className="flex mt-1 items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        <input
                                            id="end-time"
                                            type="datetime-local"
                                            value={newContest.endTime}
                                            onChange={(e) => setNewContest({ ...newContest, endTime: e.target.value })}
                                            className={`mt-1 ${errors.endTime ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                                </div>
                                {errors.time && <p className="text-red-500 text-sm mt-1 col-span-2">{errors.time}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="contest-visibility"
                                    checked={newContest.isVisible}
                                    onCheckedChange={(checked) => setNewContest({ ...newContest, isVisible: checked })}
                                />
                                <Label htmlFor="contest-visibility">Visible to students</Label>
                            </div>

                            {errors.submit && <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="border-t-1 bg-gray-50 px-4 py-4">
                        <div className="flex justify-end space-x-4 w-full">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will delete your
                                            contest data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancel}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button
                                onClick={handleCreateContest}
                                className="border-[0.5px] cursor-pointer font-semibold font-manrope p-1 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                                <Save className="h-4 w-4" /> Save Contest
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default NewContestPage