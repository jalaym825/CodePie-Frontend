import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Info, Loader, Trophy } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

const ContestOverview = ({ contestData, timeStatus, setActiveTab, handleJoinContest, joining, formatDate }) => {
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
          {/* Render the overview markdown content if available */}
          {contestData?.overview ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 pb-2" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="text-[1rem] font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-1" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="text-md font-medium mt-2 mb-2 text-gray-900 dark:text-gray-100" {...props} />
                ),
                p: ({ node, children, ...props }) => {
                  // Check if the paragraph contains only a block code (pre/code)
                  const isOnlyCodeBlock = node.children?.length === 1 && node.children[0].tagName === 'code';

                  // Avoid wrapping in <p> to prevent invalid nesting
                  return isOnlyCodeBlock ? <>{children}</> : <div className="mb-2" {...props}>{children}</div>;
                },
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="mb-1" {...props} />
                ),
                code({ className = '', children, ...props }) {
                  const isMultiline = String(children).includes('\n');
                  const hasLanguage = /language-\w+/.test(className);

                  // This is an inline code if it's short, single-line and doesn't have a language
                  const isInline = !isMultiline && !hasLanguage;

                  if (isInline) {
                    return (
                      <code
                        className="!font-geist-mono border-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.2 pb-[0.1rem] rounded text-sm dark:text-gray-200"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  const match = /language-(\w+)/.exec(className || '');
                  return (
                    <div className="my-4 !font-geist-mono">
                      <SyntaxHighlighter
                        language={match?.[1] || 'text'}
                        style={{}}
                        customStyle={{
                          fontSize: '0.85rem',
                          fontFamily: '"Geist Mono", monospace',
                          backgroundColor: 'rgb(243 244 246)',
                          padding: '.6rem',
                          borderRadius: '0.5rem',
                          margin: 0,
                          ...(document.documentElement.classList.contains('dark') ? {
                            backgroundColor: 'rgb(31 41 55)',
                            color: 'rgb(229 231 235)'
                          } : {})
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily: '"Geist Mono", monospace',
                            display: 'block',
                          },
                          className: 'code-block',
                        }}
                        pretagprops={{
                          style: {
                            margin: 0,
                            padding: 0,
                            backgroundColor: 'transparent',
                          }
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                table: ({ ...props }) => (
                  <div className="overflow-auto mb-4 border-1 dark:border-gray-700 rounded-xl">
                    <table className="min-w-full border-collapse" {...props} />
                  </div >
                ),
                th: ({ ...props }) => (
                  <th className="px-4 py-2 text-left border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-medium" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4" {...props} />
                ),
                pre: ({ children }) => (
                  <div className="my-4 !font-geist-mono">
                    {children}
                  </div>
                ),
              }}
            >
              {contestData.overview}
            </ReactMarkdown >
          ) : (
            <>
              <h3>About This Contest</h3>
              <p>{contestData?.description || "Join this coding contest to test your programming skills and compete with other developers."}</p>
            </>
          )}
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