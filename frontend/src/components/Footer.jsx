import { BookOpen, Mail, Heart, Star } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0] border-t border-[#E8C4D4]/30 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                            <BookOpen className="w-7 h-7 text-[#9B7EBD]" />
                            <span className="text-xl font-bold bg-gradient-to-r from-[#9B7EBD] to-[#D4A574] bg-clip-text text-transparent">
                                BookSwap
                            </span>
                        </div>
                        <p className="text-[#6B5B73] mb-4">
                            A magical space where stories find new homes and readers discover their next adventure. Join our enchanted community of book lovers.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <button className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors border border-[#E8C4D4]/30">
                                <Mail className="w-5 h-5 text-[#9B7EBD]" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors border border-[#E8C4D4]/30">
                                <Heart className="w-5 h-5 text-[#E8C4D4]" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors border border-[#E8C4D4]/30">
                                <Star className="w-5 h-5 text-[#D4A574]" />
                            </button>
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="text-center md:text-left">
                        <h3 className="text-[#3D3344] font-bold mb-4">Explore</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">About Our Story</a></li>
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">How It Works</a></li>
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">Community</a></li>
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="text-center md:text-left">
                        <h3 className="text-[#3D3344] font-bold mb-4">Connect</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">Privacy</a></li>
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">Terms</a></li>
                            <li><a href="#" className="text-[#6B5B73] hover:text-[#9B7EBD] transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-[#E8C4D4]/30 pt-8 text-center text-[#6B5B73] text-sm">
                    <p className="mb-2">Made with <Heart className="w-4 h-4 inline text-[#E8C4D4] fill-current" /> for book lovers everywhere</p>
                    <p>© 2025 BookSwap. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
