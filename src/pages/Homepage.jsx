import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Code, Trophy, Globe, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router';

const Homepage = () => {
    

    return (
        <div className="min-h-screen bg-white pb-5 text-slate-800">
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                        <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100" variant="secondary">
                            Launch Your Coding Journey
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                            Master DSA & Programming with CodePi
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                            The ultimate platform for students to practice Data Structures, Algorithms,
                            participate in coding contests, and test their programming skills.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link to="/">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Get Started Free <ArrowRight className="ml-2" size={18} />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-100">
                                Explore Challenges
                            </Button>
                        </div>

                        <div className="p-1 border border-slate-200 rounded-xl bg-white shadow-md w-full max-w-2xl overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded-t-lg flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-slate-500 ml-2">problem_solver.py</span>
                            </div>
                            <div className="bg-slate-50 p-4 text-left font-mono text-sm">
                                <p><span className="text-purple-600">def</span> <span className="text-blue-600">binary_search</span>(arr, target):</p>
                                <p className="ml-4"><span className="text-purple-600">left</span>, <span className="text-purple-600">right</span> = 0, len(arr) - 1</p>
                                <p className="ml-4 text-slate-500"># Efficient search algorithm</p>
                                <p className="ml-4"><span className="text-orange-600">while</span> left &lt;= right:</p>
                                <p className="ml-8"><span className="text-purple-600">mid</span> = (left + right) // 2</p>
                                <p className="ml-8"><span className="text-orange-600">if</span> arr[mid] == target:</p>
                                <p className="ml-12"><span className="text-orange-600">return</span> mid</p>
                                <p className="ml-8"><span className="text-orange-600">elif</span> arr[mid] &lt; target:</p>
                                <p className="ml-12">left = mid + 1</p>
                                <p className="ml-8"><span className="text-orange-600">else</span>:</p>
                                <p className="ml-12">right = mid - 1</p>
                                <p className="ml-4"><span className="text-orange-600">return</span> -1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-4 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <Code className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">100+ DSA Problems</h3>
                        <p className="text-slate-600">
                            Practice with our extensive library of data structures and algorithms problems,
                            categorized by difficulty and topic.
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Beginner to Advanced</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Detailed Solutions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Complexity Analysis</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                            <Trophy className="text-yellow-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Weekly Contests</h3>
                        <p className="text-slate-600">
                            Compete with peers in timed coding challenges and improve your problem-solving
                            skills under pressure.
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Live Leaderboards</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Prizes for Winners</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Real-world Scenarios</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                            <Globe className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Multiple Languages</h3>
                        <p className="text-slate-600">
                            Code in your preferred programming language with support for all major
                            languages and automated testing.
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Python, Java, C++</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">JavaScript, Go, Rust</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="text-sm text-slate-600">Language-specific Tips</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;