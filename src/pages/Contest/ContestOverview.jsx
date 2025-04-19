import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Info, Loader, Trophy } from 'lucide-react'
import React from 'react'

const ContestOverview = ({contestData, timeStatus, setActiveTab, handleJoinContest, joining, formatDate}) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl">Contest Overview</CardTitle>
        <CardDescription>
          Get to know more about this contest and how to participate
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <h3>About This Contest</h3>
          <p>{contestData?.description || "Join this coding contest to test your programming skills and compete with other developers."}</p>

          <h3>How to Participate</h3>
          <ol>
            <li>Join the contest by clicking the "Join Contest" button.</li>
            <li>Navigate to the Problems tab to view all available problems.</li>
            <li>Submit your solutions before the contest ends.</li>
            <li>Check the Leaderboard to see your ranking.</li>
          </ol>

          <h3>Rules & Guidelines</h3>
          <ul>
            <li>You must join the contest to submit solutions.</li>
            <li>Points are awarded based on the correctness of your solution and the time taken.</li>
            <li>Each problem has a different difficulty level and corresponding points.</li>
            <li>Submissions are evaluated in real-time.</li>
          </ul>
        </div>

        {timeStatus === 'not-started' && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center">
            <div className="text-blue-500 mr-4">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Contest starts soon!</h4>
              <p className="text-blue-700 text-sm">
                The contest will begin on {formatDate(contestData?.startTime)}. Come back then to participate!
              </p>
            </div>
          </div>
        )}

        {timeStatus === 'completed' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center">
            <div className="text-slate-600 mr-4">
              <Trophy size={24} />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Contest has ended</h4>
              <p className="text-slate-600 text-sm">
                This contest ended on {formatDate(contestData?.endTime)}. Check the leaderboard to see the results!
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {timeStatus === 'completed' && (
        <CardFooter>
          <Button
            onClick={() => setActiveTab('leaderboard')}
            className="bg-slate-600 hover:bg-slate-700"
          >
            View Leaderboard
            <Trophy className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default ContestOverview