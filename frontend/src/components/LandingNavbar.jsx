import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function LandingNavbar() {
    return (
        <nav className="bg-transparent absolute top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <BookOpen className="w-8 h-8 text-[#9B7EBD] group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold text-[#3D3344]">
                            BookSwap
                        </span>
                    </Link>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            to="/auth"
                            state={{ isLogin: true }}
                            className="text-[#6B5B73] hover:text-[#9B7EBD] font-medium transition-colors text-sm sm:text-base"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth"
                            state={{ isLogin: false }}
                            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#C8B6D6] text-white font-medium hover:bg-[#9B7EBD] transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
