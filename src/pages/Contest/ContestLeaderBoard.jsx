import React, { useContext, useEffect, useState } from 'react';
import { Trophy, Medal, Award, User, Crown } from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router';
import { toast } from 'sonner';

const LeaderboardTable = () => {
    const { contestId } = useParams();
    const { contestleaderBoard } = useContext(UserContext);
    const [leaderBoardData, setleaderBoardData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchLeaderboard() {
        if (!contestId) return;
        const res = await contestleaderBoard(contestId);
        console.log(res);
        if (res.status === 200) {
            setleaderBoardData(res.data);
        } else {
            toast.error(res.data.message || "Something went wrong.");
        }
        setLoading(false);
    }
    console.log(leaderBoardData);
    useEffect(() => {
        fetchLeaderboard();
    }, [contestId]);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="text-blue-500" size={24} />;
            case 2: return <Medal className="text-cyan-500" size={24} />;
            case 3: return <Award className="text-sky-500" size={24} />;
            default: return <User className="text-blue-400" size={20} />;
        }
    };

    const getRowClass = (rank) => {
        if (!rank) return "bg-white";
        return rank === 1 ? "bg-blue-50"
            : rank === 2 ? "bg-cyan-50"
                : rank === 3 ? "bg-sky-50"
                    : rank % 2 === 0 ? "bg-white"
                        : "bg-blue-50/30";
    };

    const getAvatarBg = (rank) => {
        return rank === 1 ? "bg-blue-100"
            : rank === 2 ? "bg-cyan-100"
                : rank === 3 ? "bg-sky-100"
                    : "bg-blue-50";
    };

    const getScoreColor = (rank) => {
        return rank === 1 ? "text-blue-600"
            : rank === 2 ? "text-cyan-600"
                : rank === 3 ? "text-sky-600"
                    : "text-blue-500";
    };

    if (loading) {
        return (
            <div className='w-full h-[100vh] flex justify-center items-center'>
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mt-20 mx-auto">
            <div className="bg-gradient-to-r from-blue-300 to-cyan-200 rounded-t-lg p-6">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-blue-600">
                    <Trophy size={28} />
                    Contest Leaderboard
                </h2>
            </div>

            <div className="overflow-hidden shadow-lg rounded-b-lg">
                <table className="min-w-full">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-blue-500 uppercase tracking-wider">Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                        {Array.isArray(leaderBoardData) && leaderBoardData.length > 0 ? (
                            leaderBoardData.map((entry) => (
                                <tr
                                    key={entry.userId}
                                    className={`${getRowClass(entry.rank)} transition duration-200 hover:bg-blue-100/30`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-800 mr-3 w-5 text-center">
                                                {entry.rank ?? '–'}
                                            </span>
                                            {getRankIcon(entry.rank)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 h-12 w-12 rounded-full ${getAvatarBg(entry.rank)} flex items-center justify-center border-2 border-white shadow-sm`}>
                                                {entry.user?.avatarUrl ? (
                                                    <img
                                                        className="h-12 w-12 rounded-full"
                                                        src={entry.user.avatarUrl}
                                                        alt={entry.user.name || 'User'}
                                                    />
                                                ) : (
                                                    <User className={`h-6 w-6 ${entry.rank === 1 ? 'text-blue-500' :
                                                        entry.rank === 2 ? 'text-cyan-500' :
                                                            entry.rank === 3 ? 'text-sky-500' :
                                                                'text-blue-400'
                                                        }`} />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-800">
                                                    {entry.user?.name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-blue-500">
                                                    @{entry.user?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className={`text-lg font-bold ${getScoreColor(entry.rank)}`}>
                                            {entry.totalScore}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500 text-sm">
                                    No student found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardTable;
