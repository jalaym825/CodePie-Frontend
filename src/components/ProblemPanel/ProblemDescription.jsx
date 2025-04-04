import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CodeExecutionContext } from '../../context/CodeExecutionContext';

const ProblemDescription = () => {
    const { selectedProblem } = useContext(CodeExecutionContext);

    return (
        <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 p-2">
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
                    p: ({ ...props }) => (
                        <p className="mb-2" {...props} />
                    ),
                    ul: ({ ...props }) => (
                        <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
                    ),
                    li: ({ ...props }) => (
                        <li className="mb-1" {...props} />
                    ),
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');

                        if (inline) {
                            return (
                                <code className="!font-geist-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm dark:text-gray-200" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <div className="mb-4 rounded-lg overflow-hidden !font-geist-mono code-block">
                                <SyntaxHighlighter
                                    language={match?.[1] || 'text'}
                                    style={{}}
                                    customStyle={{
                                        fontSize: '0.85rem',
                                        fontFamily: '"Geist Mono", monospace',
                                        backgroundColor: 'rgb(243 244 246)',
                                        padding: '1rem',
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
                                        }
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
                        </div>
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
                }}
            >
                {selectedProblem.description}
            </ReactMarkdown>

            {selectedProblem.constraints && (
                <div className="mt-6">
                    <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100">Constraints</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {selectedProblem.constraints.map((constraint, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">{constraint}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProblemDescription;