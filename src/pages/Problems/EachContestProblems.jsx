import { useParams } from 'react-router';
import { UserContext } from '../../context/UserContext'
import React, { use, useContext, useEffect, useState } from 'react'

const EachContestProblems = () => {
    const { getProblem } = useContext(UserContext)
    const { contestId } = useParams();
    const [problems, setProblems] = useState([]);

    async function handleGetAllProblems() {
        const res = await getProblem(contestId);
        console.log(res.data);
        if (res.status === 200) {
            setProblems(res.data.data);
            setLoading(false);
        } else {
            toast.error(res.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetAllProblems();
    }, [contestId]);

    return (
        <div className="min-h-screen bg-blue-50 relative overflow-hidden flex flex-col items-center justify-center py-12">
            <div className="absolute inset-0 z-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                    }}
                />
            </div>

            <div className="text-center mt-20 mb-8 z-10">
                <h1 className="text-3xl font-bold text-gray-800">Contest Problems</h1>
            </div>
        </div>
    )
}

export default EachContestProblems
