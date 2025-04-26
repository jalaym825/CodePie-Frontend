import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, CheckCircle, ChevronRight, Edit, Info, PlusIcon, Star } from 'lucide-react';
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { UserContext } from '@/context/UserContext';

const ContestProblems = ({ timeStatus, contestData, contest, contestId }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  return (
    <div>
      {userInfo.role === "ADMIN" && (
        <div className='flex justify-end w-full mb-4'>
          <Link to={`/contests/${contestId}/add-problems`}>
            <Button
              className="border-none cursor-pointer font-semibold font-manrope p-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
              Add Problem
              <PlusIcon className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}
      {
        timeStatus === 'not-started' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start">
            <div className="text-blue-500 mr-3 mt-0.5">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Contest starts soon!</h4>
              <p className="text-blue-700 text-sm">
                The contest will begin on {new Date(contestData?.startTime).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}. Come back then to participate!
              </p>
            </div>
          </div>
        ) : (
          contest.problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">No Problems Available</h3>
              <p className="text-sm text-gray-500 mt-1">There are currently no problems in this contest. Please check back later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contest.problems.map((problem, index) => (
                <Card
                  key={problem.id}
                  className={`border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-0`}
                >
                  <div className="flex items-center p-4">
                    <div className={`mr-4 ${problem.isSolved ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} h-10 w-10 rounded-full flex items-center justify-center font-medium`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium text-gray-800">{problem.title}</h3>
                        {problem.isSolved && (
                          <div className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Solved
                          </div>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-1 text-blue-500" />
                          {problem.difficultyLevel === 'EASY' && <span className="text-green-600">Easy</span>}
                          {problem.difficultyLevel === 'MEDIUM' && <span className="text-amber-600">Medium</span>}
                          {problem.difficultyLevel === 'HARD' && <span className="text-red-600">Hard</span>}
                          {problem.difficultyLevel !== 'EASY' &&
                            problem.difficultyLevel !== 'MEDIUM' &&
                            problem.difficultyLevel !== 'HARD' &&
                            <span>{problem.difficultyLevel}</span>}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-blue-500" />
                          <span className="text-gray-500">{problem.points} Points</span>
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
                          <span className="text-gray-500">{problem.acceptanceRate}% Acceptance</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {userInfo.role === "ADMIN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700"
                          onClick={() => navigate(`/contests/${contestId}/edit-problem/${problem.id}`)}
                        >
                          <Edit className="mr-1 h-4 w-4" /> Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border ${problem.isSolved 
                          ? "border-green-200 bg-green-50 hover:bg-green-100 text-green-700" 
                          : contestData?.isJoined
                            ? "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        onClick={() => {
                          if (!contestData?.isJoined && timeStatus === 'in-progress') {
                            toast.warning("You need to join the contest first to submit solutions");
                            return;
                          }
                          navigate(`/contests/${contestId}/problems/${problem.id}`);
                        }}
                      >
                        {problem.isSolved ? (
                          <>View Solution<CheckCircle className="ml-1 h-4 w-4" /></>
                        ) : contestData?.isJoined && timeStatus === 'in-progress' ? (
                          <>Solve Problem<ArrowRight className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>View Problem<ChevronRight className="ml-1 h-4 w-4" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        )
      }
    </div>
  )
}

export default ContestProblems