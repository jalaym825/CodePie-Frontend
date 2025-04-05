import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';

const AuthInitializer = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const { getUserProfile } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            try {
                const user = await getUserProfile();
                console.log(user)
                setLoading(false);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    if (loading) {
        return (
            <div className='w-full h-[100vh] flex justify-center items-center'>
                Loading...
            </div>
        )
    }

    return (
        <div>{children}</div>
    )
}
export default AuthInitializer
