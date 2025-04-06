import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Code, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { Link, Outlet, useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { UserContext } from '../../context/UserContext'


const MainHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const naviagte = useNavigate();
    const { userInfo, logoutUser } = useContext(UserContext)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        const res = await logoutUser();
        if (res) {
            naviagte('/');
        }
    }

    return (
        <div>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4 px-5">
                        <div className="flex justify-start items-center gap-2">
                            <Code className="text-blue-600" size={28} />
                            <span className="font-bold text-xl text-slate-900">CodePi</span>
                        </div>

                        <nav className="hidden md:flex font-semibold items-center gap-6">
                            <Link to="/" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Home</Link>
                            <Link to="/problems" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Problems</Link>
                            <Link to="/contests" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Contest</Link>
                            <Link to="/discussion" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Discussion</Link>
                        </nav>

                        <div>
                            {
                                userInfo.id ? (
                                    <div className='flex-1 flex justify-end items-center gap-4'>
                                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" className="rounded-full hover:shadow-md transition-shadow">
                                                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                                                        <AvatarImage src="https://freesvg.org/img/abstract-user-flat-4.png" />
                                                        <AvatarFallback
                                                            className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                                                            {userInfo.name}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 font-manrope border shadow-lg p-1">
                                                <div>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/contests"
                                                            className="flex h-10 w-full items-center px-2 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md cursor-pointer"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            Dashboard
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/profile"
                                                            className="flex h-10 w-full items-center justify-between px-2 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md cursor-pointer"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            <span>My Profile</span>
                                                            <AiOutlineUser className="text-blue-600" size={18} />
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </div>

                                                <DropdownMenuSeparator className="my-1" />

                                                <div>
                                                    <DropdownMenuItem asChild>
                                                        <button
                                                            onClick={() => {
                                                                setIsDropdownOpen(false);
                                                                handleLogout();
                                                            }}
                                                            className="flex w-full h-10 items-center justify-between px-2 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md cursor-pointer"
                                                        >
                                                            <span>Log Out</span>
                                                            <FiLogOut className="text-blue-600" size={18} />
                                                        </button>
                                                    </DropdownMenuItem>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (

                                    <div className="hidden md:flex items-center gap-4">
                                        <Link to="/account/login">
                                            <Button variant="ghost" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100">Log in</Button>
                                        </Link>
                                        <Link to="/account/login">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up free</Button>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-900"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200 py-4">
                        <div className="container mx-auto px-4 flex flex-col gap-4">
                            <Link to="/" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Home</Link>
                            <Link to="/problems" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Problems</Link>
                            <Link to="/contest" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Contest</Link>
                            <Link to="/discussion" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Discussion</Link>
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                                <Button variant="ghost" className="text-slate-700">Log in</Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up free</Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default MainHeader
