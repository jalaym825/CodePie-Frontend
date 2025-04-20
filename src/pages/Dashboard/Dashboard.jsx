import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Trophy, ArrowRight, PlusIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { UserContext } from '../../context/UserContext';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ContestDashboard = () => {
  const [contests, setContests] = useState([]);
  const { getAllContests, userInfo, getAccurateTime } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

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
  }, []);

  if (loading) {
    return (
      <div className='w-full h-[100vh] flex justify-center items-center'>
        Loading...
      </div>
    );
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

  // Filter contests based on their status
  const liveContests = contests.filter(contest => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    return now >= start && now <= end;
  });

  const upcomingContests = contests.filter(contest => {
    const now = new Date();
    const start = new Date(contest.startTime);
    return now < start;
  });

  const endedContests = contests.filter(contest => {
    const now = new Date();
    const end = new Date(contest.endTime);
    return now > end;
  });

  // Function to render contest cards
  const renderContestCards = (contestsList) => {
    return contestsList.map((contest) => {
      const contestStatus = getContestStatus(contest.startTime, contest.endTime);
      return (
        <Card key={contest.id} className="overflow-hidden p-6 gap-2 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-2 px-0 flex flex-col items-center justify-between space-y-0">
            <div className='flex items-center justify-between gap-x-8 w-full'>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 truncate">{contest.title}</h2>
              </div>
              <div className='flex items-center gap-x-1'>
                <Badge variant={contestStatus.variant}>{contestStatus.status}</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Show details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {/* <p className="text-gray-500 flex justify-start w-full text-xs">{formatDate(contest.createdAt)}</p> */}
          </CardHeader>

          <CardContent className="px-0">
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

          <CardFooter className="px-0 mt-2">
            <div className='flex w-full justify-end'>
              <Link to={`/contests/${contest.id}`}>
                <Button
                  className="border-[0.5px] cursor-pointer font-semibold font-manrope p-4 w-38 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                  Show Details
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      );
    });
  };

  return (
    <div className="pt-25 h-screen bg-gray-50">
      <div className="flex flex-col justify-between items-center mb-8">
        <div className="flex items-center mb-8">
          <Trophy className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Contest Dashboard</h1>
        </div>

        <div className="flex justify-between w-[90%] items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contests</h2>
          {userInfo.role === "ADMIN" && (
            <Button onClick={() => navigate('/contests/create')}
              className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
              <PlusIcon className="w-4 h-4 mr-2" />Create Contest
            </Button>
          )}
        </div>

        <div className="w-[90%]">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full p-0 h-auto bg-transparent gap-1 mb-6 border-1 p-1">
              <TabsTrigger
                className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-medium"
                value="all">
                All ({contests.length})
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-medium"
                value="live">
                Live ({liveContests.length})
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-medium"
                value="upcoming">
                Upcoming ({upcomingContests.length})
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-medium"
                value="ended">
                Ended ({endedContests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderContestCards(contests)}
              </div>
            </TabsContent>

            <TabsContent value="live">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveContests.length > 0 ?
                  renderContestCards(liveContests) :
                  <div className="col-span-3 text-center py-12 text-gray-500">No live contests at the moment</div>
                }
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingContests.length > 0 ?
                  renderContestCards(upcomingContests) :
                  <div className="col-span-3 text-center py-12 text-gray-500">No upcoming contests</div>
                }
              </div>
            </TabsContent>

            <TabsContent value="ended">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {endedContests.length > 0 ?
                  renderContestCards(endedContests) :
                  <div className="col-span-3 text-center py-12 text-gray-500">No ended contests</div>
                }
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContestDashboard;