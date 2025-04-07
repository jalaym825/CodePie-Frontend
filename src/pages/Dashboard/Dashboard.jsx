import React, { useContext, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Trophy, ArrowRight, PlusIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { UserContext } from '../../context/UserContext';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

const ContestDashboard = () => {
  const [contests, setContests] = useState([]);
  const { getAllContests, userInfo } = useContext(UserContext);
  console.log(userInfo);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const res = await getAllContests();
    console.log(res.data);
    if (res.status === 200) {
      setContests(res.data.data);
      setLoading(false);
    } else {
      toast.error(res.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetAllContest();
  }, [])

  if (loading) {
    return (
      <div className='w-full h-[100vh] flex justify-center items-center'>
        Loading...
      </div>
    )
  }

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
    <div className="pt-25 h-screen bg-gray-50">
      <div className="flex flex-col justify-between items-center mb-8">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Contest Dashboard</h1>
        </div>

        <div className="flex justify-between w-[90%] items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contests</h2>
          {
            userInfo.role === "ADMIN" && (
              <Button onClick={() => navigate('/contests/create')}
                className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                <PlusIcon className="w-4 h-4 mr-2" />Create Contest
              </Button>
            )
          }
        </div>

        <div className="grid w-[90%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const contestStatus = getContestStatus(contest.startTime, contest.endTime);
            return (
              <Card key={contest.id} className="overflow-hidden p-4 gap-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2 flex flex-col items-center  justify-between space-y-0 ">
                  <div className='flex items-center justify-between gap-x-8 w-full'>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 truncate">{contest.title}</h2>
                    </div>
                    <div className='flex items-center gap-x-1'>
                      <Badge variant={contestStatus.variant}>{contestStatus.status}</Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* <Link to={`/contests/${contest.id}/problems`}>
                              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Link> */}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">Show details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="text-gray-500 flex justify-start w-full text-xs">{formatDate(contest.createdAt)}</p>
                </CardHeader>

                <CardContent className="pt-2">
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

                <CardFooter className="p-0 ">
                  {userInfo.role === "ADMIN" ? (
                    <div className='flex justify-end px-2 w-full gap-x-2'>
                      {/* <Link to={`/contests/${contest.id}/problems`}>
                        <div className='flex items-center p-2 rounded-md hover:bg-[#e5f1ff]'>
                          <h1 className='text-[#4a516d] font-semibold text-sm'>Show Details</h1>
                          <EyeIcon className="ml-1 h-3 w-3" />
                        </div>
                      </Link> */}
                      <Link to={`/contests/${contest.id}/add-problems`}>
                        <Button
                          className="border-[0.5px] cursor-pointer font-semibold font-manrope p-4 w-38  rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                          Add Problem
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className='flex w-full justify-end'>
                      <Link to={`/contests/${contest.id}`}>
                        <Button
                          className="border-[0.5px] cursor-pointer font-semibold font-manrope p-4 w-38  rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                          Show Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  )}
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