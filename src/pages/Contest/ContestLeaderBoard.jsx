import React, { useContext, useEffect, useState } from 'react';
import { Trophy, Medal, Award, User, Crown, CheckCircle, Clock, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const LeaderboardTable = () => {
    const { contestId } = useParams();
    const { contestleaderBoard } = useContext(UserContext);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'rank',
        direction: 'asc'
    });
    const [showDetails, setShowDetails] = useState(false);

    async function fetchLeaderboard() {
        if (!contestId) return;
        try {
            const res = await contestleaderBoard(contestId);
            if (res.status === 200) {
                setLeaderboardData(res.data.leaderboard || []);
                setProblems(res.data.problems || []);
            } else {
                toast.error(res.data.message || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to fetch leaderboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaderboard();
    }, [contestId]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        // in 12 hours format with am pm
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString([], options);
        const [time, modifier] = formattedTime.split(' ');
        const [hours, minutes, seconds] = time.split(':');
        const formattedHours = (parseInt(hours) % 12 || 12).toString().padStart(2, '0');
        return `${formattedHours}:${minutes}:${seconds} ${modifier}`;
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'text-green-500';
            case 'MEDIUM': return 'text-yellow-500';
            case 'HARD': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getDifficultyBg = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'bg-green-100';
            case 'MEDIUM': return 'bg-yellow-100';
            case 'HARD': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'text-green-600';
            case 'WRONG_ANSWER': return 'text-red-600';
            case 'TIME_LIMIT_EXCEEDED': return 'text-yellow-600';
            case 'COMPILATION_ERROR': return 'text-orange-600';
            case 'RUNTIME_ERROR': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100';
            case 'WRONG_ANSWER': return 'bg-red-100';
            case 'TIME_LIMIT_EXCEEDED': return 'bg-yellow-100';
            case 'COMPILATION_ERROR': return 'bg-orange-100';
            case 'RUNTIME_ERROR': return 'bg-purple-100';
            default: return 'bg-gray-100';
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="text-yellow-500" size={24} />;
            case 2: return <Medal className="text-gray-400" size={24} />;
            case 3: return <Award className="text-amber-600" size={24} />;
            default: return <User className="text-blue-500" size={20} />;
        }
    };

    const getRowClass = (rank) => {
        if (!rank) return "bg-white";
        return rank === 1 ? "bg-yellow-50"
            : rank === 2 ? "bg-gray-50"
                : rank === 3 ? "bg-amber-50"
                    : rank % 2 === 0 ? "bg-white"
                        : "bg-gray-50";
    };

    const getAvatarBg = (rank) => {
        return rank === 1 ? "bg-yellow-100"
            : rank === 2 ? "bg-gray-200"
                : rank === 3 ? "bg-amber-100"
                    : "bg-blue-50";
    };

    const getNameStyle = (rank) => {
        return rank === 1 ? "text-yellow-700"
            : rank === 2 ? "text-gray-700"
                : rank === 3 ? "text-amber-700"
                    : "text-gray-800";
    };

    const sortTable = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...leaderboardData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setLeaderboardData(sortedData);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    if (loading) {
        return (
            <div className="w-full h-64 flex justify-center items-center">
                <div className="animate-pulse text-gray-500">Loading leaderboard...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg p-6">
                <div className="flex items-center justify-between text-white">
                    <div className="flex-1" />

                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Trophy size={28} />
                        Contest Leaderboard
                    </h2>

                    <div className="flex-1 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center bg-white text-blue-700 hover:bg-blue-100 font-medium"
                        >
                            {showDetails ? 'Hide' : 'Show'} Problem Details
                            {showDetails ? (
                                <ChevronUp size={16} className="ml-1" />
                            ) : (
                                <ChevronDown size={16} className="ml-1" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-b-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => sortTable('rank')}>
                                Rank {getSortIcon('rank')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => sortTable('totalScore')}>
                                Score {getSortIcon('totalScore')}
                            </th>
                            {problems.map((problem, index) => (
                                showDetails && (
                                    <th key={problem.id} className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex flex-col items-center">
                                            <span className={`${getDifficultyColor(problem.difficulty)} font-bold`}>
                                                Q{index + 1}
                                            </span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {problem.points} pts
                                            </span>
                                        </div>
                                    </th>
                                )
                            ))}
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => sortTable('solvedCount')}>
                                Solved {getSortIcon('solvedCount')}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Finish Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leaderboardData.length > 0 ? (
                            leaderboardData.map((entry) => (
                                <tr
                                    key={entry.userId}
                                    className={`${getRowClass(entry.rank)} transition duration-200 hover:bg-blue-50`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-800 mr-3 w-5 text-center">
                                                {entry.rank}
                                            </span>
                                            {getRankIcon(entry.rank)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getAvatarBg(entry.rank)} flex items-center justify-center border-2 border-white shadow-sm`}>
                                                <User className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className={`text-sm font-semibold ${getNameStyle(entry.rank)}`}>
                                                    {entry.user?.name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {entry.totalScore || 0} points
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-lg font-bold text-blue-600">
                                            {entry.totalScore}
                                        </div>
                                    </td>
                                    {problems.map((problem) => (
                                        showDetails && (
                                            <td key={problem.id} className="px-2 py-4 whitespace-nowrap text-center">
                                                {entry.problemScores && entry.problemScores[problem.id] ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className={`text-sm font-medium px-2 py-1 rounded ${entry.problemScores[problem.id].status === 'ACCEPTED'
                                                            ? 'bg-green-100 text-green-600'
                                                            : entry.problemScores[problem.id].score > 0
                                                                ? 'bg-yellow-100 text-yellow-600'
                                                                : entry.problemScores[problem.id].attempts > 0
                                                                    ? 'bg-red-100 text-red-600'
                                                                    : 'text-gray-400'
                                                            }`}>
                                                            {entry.problemScores[problem.id].score}
                                                            {entry.problemScores[problem.id].attempts > 0 && (
                                                                <span className="text-xs ml-1">
                                                                    ({entry.problemScores[problem.id].attempts})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>) : (
                                                    <div className="text-gray-300">—</div>
                                                )}
                                            </td>
                                        )
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end">
                                            <CheckCircle size={16} className="text-green-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {entry.solvedCount}/{entry.totalProblems}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end text-sm text-gray-500">
                                            <Clock size={14} className="mr-1 text-gray-400" />
                                            {formatTime(entry.finishTime)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6 + (showDetails ? problems.length : 0)} className="text-center py-8 text-gray-500">
                                    No participants found in this contest.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Legend section */}
            {/* {showDetails && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Legend</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <span className="inline-block w-8 text-center font-medium text-green-600">AC</span>
                            <span className="ml-2 text-sm text-gray-600">Accepted</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-8 text-center font-medium text-red-600">WA</span>
                            <span className="ml-2 text-sm text-gray-600">Wrong Answer</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-8 text-center font-medium text-yellow-600">TLE</span>
                            <span className="ml-2 text-sm text-gray-600">Time Limit Exceeded</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-8 text-center font-medium text-orange-600">CE</span>
                            <span className="ml-2 text-sm text-gray-600">Compilation Error</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-8 text-center font-medium text-purple-600">RE</span>
                            <span className="ml-2 text-sm text-gray-600">Runtime Error</span>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default LeaderboardTable;