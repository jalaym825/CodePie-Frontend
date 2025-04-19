import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Users, FileText, Trophy, ArrowRight, Loader, ChevronRight, BarChart2, List, MessageSquare, CheckCircle, PlusIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate, useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Assume a LeaderboardComponent is imported
import LeaderboardComponent from '../Contest/ContestLeaderBoard';
import ContestOverview from './ContestOverview';
import ContestProblems from './ContestProblems';

const ContestDetails = () => {
    const { contestId } = useParams();
    const { getContest, joinContest, userInfo, getAccurateTime } = useContext(UserContext);
    const { contest, fetchContest } = useContext(CodeExecutionContext);
    const [timeStatus, setTimeStatus] = useState('not-started');
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [contestData, setContestData] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'problems', or 'leaderboard'

    async function handleGetContest() {
        try {
            const userId = userInfo?.id;
            const res = await getContest(contestId, userId);

            if (res.status === 200) {
                setContestData(res.data.data);
                setLoading(false);

                // Also fetch problems
                handleFetchContest();
            } else {
                toast.error(res.data.message || "Failed to load contest");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error loading contest details");
            setLoading(false);
        }
    }

    async function handleFetchContest() {
        if (!contestId) return;
        try {
            const res = await fetchContest(contestId);
            if (res.status !== 200) {
                toast.error("Failed to fetch contest problems");
            }
        } catch (error) {
            toast.error("Error loading contest problems");
        }
    }

    useEffect(() => {
        handleGetContest();
    }, [contestId]);

    async function handleJoinContest() {
        try {
            const now = getAccurateTime();
            const endTime = new Date(contestData.endTime);
            const isEnded = now > endTime;

            if (isEnded) {
                toast.error("Contest has ended. You cannot join now.");
                return;
            }

            setJoining(true);
            const res = await joinContest(contestId);

            if (res.status === 201) {
                toast.success(res.message || "Successfully joined the contest");
                // Refresh contest data after joining
                handleGetContest();
            } else {
                toast.error(res.data?.message || "Failed to join contest");
            }
        } catch (error) {
            toast.error("Error joining contest");
        } finally {
            setJoining(false);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        const updateTime = () => {
            if (!contestData) return;

            const now = getAccurateTime();
            const startTime = new Date(contestData.startTime);
            const endTime = new Date(contestData.endTime);

            let targetTime;
            if (now < startTime) {
                setTimeStatus('not-started');
                targetTime = startTime;
            } else if (now >= startTime && now < endTime) {
                setTimeStatus('in-progress');
                targetTime = endTime;
            } else {
                setTimeStatus('completed');
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const timeDiff = targetTime - now;

            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            setTimeRemaining({ days, hours, minutes, seconds });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [contestData?.startTime, contestData?.endTime]);

    const getGradientClass = () => {
        if (timeStatus === 'not-started') return 'from-blue-500 to-indigo-600';
        if (timeStatus === 'in-progress') return 'from-green-500 to-emerald-600';
        return 'from-slate-600 to-gray-700'; // More professional look for completed contests
    };

    const getStatusBadgeColor = () => {
        if (timeStatus === 'not-started') return 'bg-blue-100 text-blue-800';
        if (timeStatus === 'in-progress') return 'bg-green-100 text-green-800';
        return 'bg-slate-100 text-slate-800'; // More professional for completed
    };

    const getStatusText = () => {
        if (timeStatus === 'not-started') return 'Starting in';
        if (timeStatus === 'in-progress') return 'Ending in';
        return 'Contest Ended';
    };

    // Shared Contest Info Sidebar that appears in all tabs
    const ContestSidebar = () => (
        <div className="space-y-4">
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info size={18} className="text-blue-500" />
                        Contest Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                                Start Time
                            </span>
                            <span className="text-gray-800 font-medium">{formatDate(contestData?.startTime)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                                End Time
                            </span>
                            <span className="text-gray-800 font-medium">{formatDate(contestData?.endTime)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center">
                                <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                                Status
                            </span>
                            <Badge className={getStatusBadgeColor()}>
                                {timeStatus === 'not-started' && 'Not Started'}
                                {timeStatus === 'in-progress' && 'In Progress'}
                                {timeStatus === 'completed' && 'Completed'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center">
                                <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                                Participation
                            </span>
                            <Badge variant="outline" className={contestData?.isJoined ? "border-green-500 text-green-700" : "border-gray-300 text-gray-700"}>
                                {contestData?.isJoined ? "Joined" : "Not Joined"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-gray-600">Loading contest details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 pb-12 bg-gray-50">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center text-sm">
                <Link to="/contests" className="text-gray-500 hover:text-blue-600">
                    All Contests
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="text-gray-700 font-medium">{contestData?.title}</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header Card with Gradient */}
                <Card className="overflow-hidden border-none shadow-xl p-0 gap-0">
                    {/* Header with non-rounded gradient */}
                    <div className={`bg-gradient-to-r ${getGradientClass()} p-8 text-white`} style={{ borderRadius: 0 }}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <Badge className={`mr-3 ${getStatusBadgeColor()} bg-white/20 text-white border-none backdrop-blur-sm`}>
                                        {timeStatus === 'not-started' && 'Upcoming'}
                                        {timeStatus === 'in-progress' && 'Active'}
                                        {timeStatus === 'completed' && 'Completed'}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight">{contestData?.title}</h1>
                                <p className="opacity-90 max-w-3xl font-light">{contestData?.description}</p>
                            </div>

                            {/* Join Contest Button in Header */}
                            {['in-progress', 'not-started'].includes(timeStatus) && !contestData?.isJoined && (
                                <div className="shrink-0">
                                    <Button
                                        onClick={handleJoinContest}
                                        className="bg-white/90 text-blue-700 hover:bg-white shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
                                        size="lg"
                                        disabled={joining}
                                    >
                                        {joining ? (
                                            <>
                                                <Loader className="animate-spin mr-2 h-4 w-4" />
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                Join Contest
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {(['in-progress', 'not-started'].includes(timeStatus) && contestData?.isJoined || timeStatus === 'completed') && (
                                <div className="shrink-0">
                                    <Button
                                        onClick={() => setActiveTab('problems')}
                                        className="bg-white/90 text-emerald-700 hover:bg-white shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
                                        size="lg"
                                    >
                                        View Problems
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer Section - Improved for futuristic feel */}
                    {timeStatus !== 'completed' && (
                        <div className="bg-slate-50 p-6 border-b border-gray-200">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <h3 className="text-center font-medium text-gray-700 mb-4">{getStatusText()}</h3>
                                    <div className="flex justify-center gap-6">
                                        <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg w-20 h-20 flex flex-col items-center justify-center shadow-md border border-gray-100">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.days}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Days</div>
                                        </div>
                                        <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg w-20 h-20 flex flex-col items-center justify-center shadow-md border border-gray-100">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.hours}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Hours</div>
                                        </div>
                                        <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg w-20 h-20 flex flex-col items-center justify-center shadow-md border border-gray-100">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.minutes}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Minutes</div>
                                        </div>
                                        <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg w-20 h-20 flex flex-col items-center justify-center shadow-md border border-gray-100">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.seconds}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Seconds</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replace manual tabs with shadcn Tabs component */}
                    <div className="bg-white p-4">
                        <Tabs 
                            defaultValue="overview" 
                            value={activeTab} 
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="w-full gap-3 p-0 bg-background justify-start rounded-none">
                                <TabsTrigger value="overview" className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                                    <FileText className="h-4 w-4" />
                                    <span>Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="problems" className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Problems</span>
                                </TabsTrigger>
                                <TabsTrigger value="leaderboard" className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                                    <Trophy className="h-4 w-4" />
                                    <span>Leaderboard</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </Card>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Main Content - 3/4 width */}
                    <div className="md:col-span-3">
                        <Tabs value={activeTab} className="w-full">
                            {/* Overview Tab */}
                            <TabsContent value="overview">
                                <ContestOverview 
                                    contestData={contestData} 
                                    timeStatus={timeStatus} 
                                    setActiveTab={setActiveTab} 
                                    handleJoinContest={handleJoinContest} 
                                    joining={joining} 
                                    formatDate={formatDate} 
                                />
                            </TabsContent>

                            {/* Problems Tab */}
                            <TabsContent value="problems">
                                {contest && contest.problems && (
                                    <ContestProblems 
                                        timeStatus={timeStatus} 
                                        contestData={contestData} 
                                        handleJoinContest={handleJoinContest} 
                                        joining={joining} 
                                        contest={contest} 
                                        contestId={contestId} 
                                    />
                                )}
                            </TabsContent>

                            {/* Leaderboard Tab */}
                            <TabsContent value="leaderboard">
                                <Card className="shadow-sm border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center">
                                            <Trophy className="text-blue-500 mr-2" size={20} />
                                            Contest Leaderboard
                                        </CardTitle>
                                        <CardDescription>
                                            See how participants are ranking in this contest
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <LeaderboardComponent contestId={contestId} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - 1/4 width */}
                    <div className="md:col-span-1">
                        <ContestSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestDetails;