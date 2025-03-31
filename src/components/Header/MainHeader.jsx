import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Code, Menu } from 'lucide-react'
import { Link, Outlet } from 'react-router'


const MainHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <div>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <Code className="text-blue-600" size={28} />
                            <span className="font-bold text-xl text-slate-900">CodePi</span>
                        </div>

                        <nav className="hidden md:flex font-semibold items-center gap-6">
                            <Link to="/" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Home</Link>
                            <Link to="/problems" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Problems</Link>
                            <Link to="/contest" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Contest</Link>
                            <Link to="/discussion" className="py-2 text-slate-700 hover:text-blue-600 transition-colors">Discussion</Link>
                        </nav>

                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/account/login">
                                <Button variant="ghost" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100">Log in</Button>
                            </Link>
                            <Link to="/account/login">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up free</Button>
                            </Link>
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
