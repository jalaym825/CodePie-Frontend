import React, { useContext } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Trophy, ArrowRight, Plus, Filter, PlusIcon } from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

const ContestDashboard = () => {
  const [contests, setContests] = React.useState([]);
  const { getAllContests } = useContext(UserContext);
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  async function handleGetAllContest() {
    const res = await getAllContests();
    console.log(res.data);
    if (res.status === 200) {
      setContests(res.data.data);
    } else {
      toast.error(res.data.message);
    }
  }

  useEffect(() => {
    handleGetAllContest();
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getContestStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return { status: "Upcoming", variant: "outline" };
    } else if (now >= start && now <= end) {
      return { status: "Live", variant: "success" };
    } else {
      return { status: "Ended", variant: "secondary" };
    }
  };

  return (
    <div className=" mt-20 bg-gray-50">
      <div className="flex flex-col justify-between items-center mb-8">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Contest Dashboard</h1>
        </div>

        <div className="flex justify-between w-[90%] items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contests</h2>
          <Button onClick={() => navigate('/contests/create')}
            className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
            <PlusIcon className="w-4 h-4 mr-2" />Create Contest
          </Button>
        </div>

        <div className="grid w-[90%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const contestStatus = getContestStatus(contest.startTime, contest.endTime);
            return (
              <Card key={contest.id} className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">{contest.title}</h2>
                    <p className="text-gray-500 text-xs">{formatDate(contest.createdAt)}</p>
                  </div>
                  <Badge variant={contestStatus.variant}>{contestStatus.status}</Badge>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contest.description}</p>

                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Calendar className="w-3 h-3 mr-1 text-blue-500" />
                    <span>{formatDate(contest.startTime)}</span>
                    <Clock className="w-3 h-3 ml-2 mr-1 text-blue-500" />
                    <span>{formatTime(contest.startTime)} - {formatTime(contest.endTime)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-purple-50 px-2 py-1 rounded">
                      <FileText className="w-3 h-3 mr-1 text-purple-500" />
                      <span className="text-xs font-medium text-purple-700">{contest._count.problems} Problems</span>
                    </div>

                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Users className="w-3 h-3 mr-1 text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">{contest._count.participations} Participants</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Link to={`/contests/${contest.id}`}>
                    <Button
                      className="border-[0.5px] cursor-pointer font-semibold font-manrope p-4 w-34 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                      Add Problem
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContestDashboard;