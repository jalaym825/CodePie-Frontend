import React from 'react';
import { Calendar, Plus, Edit, Trash2, Tag, Award, Check, X, PlusIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router';

const Dashboard = () => {
  const navigate = useNavigate();
  // State for contests list
  const contests = [
    {
      id: 1,
      title: 'Weekly Algorithm Challenge',
      description: 'Test your skills with algorithmic problems',
      startTime: '2025-04-05T10:00',
      endTime: '2025-04-05T12:00',
      isVisible: true,
      problems: [
        { id: 1, title: 'Balanced Parentheses', difficultyLevel: 'Medium' },
        { id: 2, title: 'Merge K Sorted Lists', difficultyLevel: 'Hard' }
      ]
    },
    {
      id: 2,
      title: 'Data Structures Marathon',
      description: 'Solve problems focusing on different data structures',
      startTime: '2025-04-10T14:00',
      endTime: '2025-04-10T17:00',
      isVisible: false,
      problems: [
        { id: 3, title: 'Binary Tree Traversal', difficultyLevel: 'Easy' }
      ]
    }
  ];

  return (
    <div className="mt-18 h-screen bg-gray-50">

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="contests" className="w-full">

          {/* Contests Tab */}
          <TabsContent value="contests">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contests</h2>
                  <Button onClick={() => navigate('/contests/create')}
                    className="border-[0.5px] cursor-pointer font-semibold font-manrope p-6 w-40 rounded-md border-[#c3deff] hover:bg-[#e5f1ff] bg-[#f6faff] text-[#4a516d]">
                    <PlusIcon className="w-4 h-4 mr-2" />Create Contest
                  </Button>
              </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <Link key={contest.id} to={`/contests/${contest.id}`}>
                  <Card key={contest.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <div className="flex">
                          <Edit className="h-4 w-4 mr-2 cursor-pointer text-gray-500 hover:text-blue-600" />
                          <Trash2 className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-600" />
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{contest.problems.length} Problems</span>
                        </div>
                        <div className="flex items-center">
                          {contest.isVisible ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Visible</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Hidden</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        // onClick={() => setSelectedContest(contest)}
                      >
                        Manage Problems
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;