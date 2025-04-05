/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy, BarChart2, List, MessageSquare, CheckCircle } from 'lucide-react';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { Link, useNavigate, useParams } from 'react-router';

const ContestInfo = () => {
    const { contestId } = useParams();

    const [loading, setLoading] = useState(true);

    const { contest, fetchContest } = useContext(CodeExecutionContext);

    const navigate = useNavigate();

    async function handleFetchContest() {
        if (!contestId) return;
        const res = await fetchContest(contestId);
        if (res.status === 200) {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchContest();
    }, []);

    if(loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 mt-[4.5rem]">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm mb-6">
                <Link to={`${window.location.origin}/contests`} className="text-gray-500 hover:text-blue-600">All Contests</Link>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="text-gray-700">{contest.title}</span>
            </div>

            {/* Main content with sidebar layout */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Main content area */}
                <div className="w-full md:w-3/4">
                    {/* Contest title section */}
                    <div className="border-b pb-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{contest.title}</h1>
                        <div className="mt-2 text-sm">
                            {contest.description}
                        </div>
                    </div>

                    {/* Challenges section */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Challenges</h2>

                        {contest.problems.map((problem, index) => (
                            <Card key={problem.id} className="mb-4 border border-gray-200 hover:border-blue-300 transition-colors py-1">
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4">
                                        <div className="mr-3 text-green-500">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-medium text-blue-600">{problem.title}</h3>
                                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                                <span className="mr-4">Success Rate: <span className="font-medium">{index === 0 ? '81.61%' : '90.00%'}</span></span>
                                                <span className="mr-4">Max Score: <span className="font-medium">{problem.points * 20}</span></span>
                                                <span>Difficulty: <span className="font-medium">{problem.difficultyLevel}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                <MessageSquare className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                <Trophy className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                <List className="h-5 w-5" />
                                            </button>
                                            <Button 
                                                variant="outline" 
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-600 border-2 border-blue-200"
                                                onClick={() => navigate(`/contests/${contestId}/problems/${problem.id}`)}
                                            >
                                                Solve
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="space-y-4">
                        {/* Current Rank */}
                        <Card className="border border-gray-200 p-0">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    {/* <div className="flex gap-2">
                                        <a href="#" className="text-gray-400 hover:text-blue-600">
                                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">f</div>
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-blue-600">
                                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">t</div>
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-blue-600">
                                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">in</div>
                                        </a>
                                    </div> */}
                                    <div className="text-gray-700">Current Rank: N/A</div>
                                </div>

                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                        <Trophy className="h-4 w-4 mr-2" />
                                        Current Leaderboard
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                        <BarChart2 className="h-4 w-4 mr-2" />
                                        Compare Progress
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                        <List className="h-4 w-4 mr-2" />
                                        Review Submissions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contest Info */}
                        <Card className="border border-gray-200 p-0">
                            <CardContent className="p-4">
                                <h3 className="text-gray-700 font-medium mb-2">Contest Info</h3>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Start:</span>
                                        <span className="text-gray-800">{new Date(contest.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">End:</span>
                                        <span className="text-gray-800">{new Date(contest.endTime).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge className="bg-green-500">Active</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestInfo;