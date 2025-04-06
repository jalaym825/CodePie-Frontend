import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Users, FileText, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate, useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { toast } from 'sonner';

const JoinContest = () => {
    const { contestId } = useParams();
    const { getContest, joinContest, userInfo } = useContext(UserContext);
    const [timeStatus, setTimeStatus] = useState('not-started');
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [contestData, setContestData] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    async function handleGetContest() {
        const userId = userInfo.id;
        const res = await getContest(contestId, userId);
        console.log(res.data);
        if (res.status === 200) {
            setContestData(res.data.data);
            setLoading(false);
        } else {
            toast.error(res.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetContest();
    }, [contestId]);

    async function handleJoinContest() {
        console.log("okok")
        const res = await joinContest(contestId);
        console.log(res.data);
        if (res.status === 201) {
            toast.success(res.message);
            navigate(`/contests/${contestId}/`)
            setLoading(false);
        } else {
            toast.error(res.data.message);
            setLoading(false);
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

    const getContestDuration = () => {
        const start = new Date(contestData?.startTime);
        const end = new Date(contestData?.endTime);
        const durationMs = end - start;

        const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const startTime = new Date(contestData?.startTime);
            const endTime = new Date(contestData?.endTime);

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

    const contestDuration = getContestDuration();

    const getGradientClass = () => {
        if (timeStatus === 'not-started') return 'from-blue-500 to-indigo-600';
        if (timeStatus === 'in-progress') return 'from-green-500 to-emerald-600';
        return 'from-gray-500 to-slate-600';
    };

    // Get status text
    const getStatusText = () => {
        if (timeStatus === 'not-started') return 'Starting in';
        if (timeStatus === 'in-progress') return 'Ending in';
        return 'Contest Ended';
    };

    return (
        <div className="min-h-screen pt-22 pb-12 bg-gray-100 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                    }}
                />
            </div>

            <div className="z-10 w-full max-w-5xl px-4 space-y-8">
                {/* Header Card with Gradient */}
                <Card className="overflow-hidden border-none shadow-xl p-0">
                    <div className={`bg-gradient-to-r ${getGradientClass()} p-6 text-white`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{contestData?.title}</h1>
                                <p className="opacity-90">{contestData?.description}</p>
                            </div>
                            <Badge className="bg-white text-gray-800 text-sm px-3 py-1 rounded-full uppercase font-semibold">
                                {timeStatus === 'not-started' && 'Not Started'}
                                {timeStatus === 'in-progress' && 'In Progress'}
                                {timeStatus === 'completed' && 'Completed'}
                            </Badge>
                        </div>
                    </div>

                    {/* Timer Section */}
                    <div className="bg-white p-6">
                        <div className="flex flex-col space-y-6">
                            {/* Contest Duration */}
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3 sm:mb-0">
                                    <Clock className="text-blue-600" size={20} />
                                    <span className="font-semibold text-gray-700">Contest Duration:</span>
                                </div>
                                <div className="flex gap-3 text-center">
                                    <div className="bg-white px-3 py-2 h-18 w-18 flex flex-col justify-center rounded-md shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{contestDuration.days}</div>
                                        <div className="text-xs text-gray-500">DAYS</div>
                                    </div>
                                    <div className="bg-white px-3 py-2 h-18 w-18 flex flex-col justify-center rounded-md shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{contestDuration.hours}</div>
                                        <div className="text-xs text-gray-500">HOURS</div>
                                    </div>
                                    <div className="bg-white px-3 py-2 h-18 w-18 flex flex-col justify-center rounded-md shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{contestDuration.minutes}</div>
                                        <div className="text-xs text-gray-500">MIN</div>
                                    </div>
                                </div>
                            </div>

                            {timeStatus !== 'completed' && (
                                <div>
                                    <h3 className="text-center font-medium text-gray-500 mb-3">{getStatusText()}</h3>
                                    <div className="flex justify-center gap-4">
                                        <div className="bg-gray-100 rounded-lg w-20 h-20 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.days}</div>
                                            <div className="text-xs text-gray-500">DAYS</div>
                                        </div>
                                        <div className="bg-gray-100 rounded-lg w-20 h-20 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.hours}</div>
                                            <div className="text-xs text-gray-500">HOURS</div>
                                        </div>
                                        <div className="bg-gray-100 rounded-lg w-20 h-20 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.minutes}</div>
                                            <div className="text-xs text-gray-500">MIN</div>
                                        </div>
                                        <div className="bg-gray-100 rounded-lg w-20 h-20 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-gray-800">{timeRemaining.seconds}</div>
                                            <div className="text-xs text-gray-500">SEC</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Contest Information</CardTitle>
                            <CardDescription>ID: {contestData?.id.substring(0, 8)}...</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-blue-500" size={18} />
                                        <span className="font-medium">Start Time:</span>
                                        <span>{formatDate(contestData?.startTime)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-blue-500" size={18} />
                                        <span className="font-medium">End Time:</span>
                                        <span>{formatDate(contestData?.endTime)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Trophy className="text-yellow-500" size={20} />
                                Join the Challenge
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                {timeStatus === 'not-started' && "Get ready for the upcoming challenge! Be the first to tackle this exciting contest."}
                                {timeStatus === 'in-progress' && "The contest is live! Join now to test your skills and compete with others."}
                                {timeStatus === 'completed' && "This contest has ended. Check out the results and prepare for the next challenge!"}
                            </p>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3">
                            {
                                timeStatus === 'not-started' && (
                                    <Button disabled className="w-full bg-gray-600 hover:bg-gray-700">
                                        contest not started
                                    </Button>
                                )
                            }
                            {timeStatus === 'in-progress' && (
                                contestData?.isJoined ? (
                                    <Link to={`/contests/${contestData?.id}`}>
                                        <Button className={`w-full bg-green-600 cursor-pointer hover:bg-green-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            Enter Contest
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button onClick={handleJoinContest} className={`w-full bg-green-600 cursor-pointer hover:bg-green-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        Join Contest Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )
                            )}

                            {timeStatus === 'completed' && (
                                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                                    View Results
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JoinContest;