import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, ChevronRight, Info } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ContestProblems = ({ timeStatus, contestData, contest, contestId }) => {
  const navigate = useNavigate();
  return (
    <div>
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
                  className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-0"
                >
                  <div className="flex items-center p-4">
                    <div className="mr-4 bg-blue-100 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-md font-medium text-gray-800">{problem.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-1 text-blue-500" /> {/* Changed from purple-500 */}
                          {problem.difficultyLevel === 'EASY' && <span className="text-green-600">Easy</span>}
                          {problem.difficultyLevel === 'MEDIUM' && <span className="text-amber-600">Medium</span>}
                          {problem.difficultyLevel === 'HARD' && <span className="text-red-600">Hard</span>}
                          {problem.difficultyLevel !== 'EASY' &&
                            problem.difficultyLevel !== 'MEDIUM' &&
                            problem.difficultyLevel !== 'HARD' &&
                            <span>{problem.difficultyLevel}</span>}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border ${contestData?.isJoined
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
                        {contestData?.isJoined && timeStatus === 'in-progress' ? (
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