import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import { Outlet } from 'react-router';

const AuthInitializer = () => {

    // const [loading, setLoading] = useState(true);
    const { getMe } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            try {
                const user = await getMe();
                console.log(user)
                // setLoading(false);
            } catch (error) {
                console.error(error);
            } finally {
                // setLoading(false);
            }
        })();
    }, [])

    return (
        <>
            <Outlet />
        </>
    )
}
export default AuthInitializer
