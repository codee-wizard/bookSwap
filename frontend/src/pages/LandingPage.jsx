import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { Footer } from '../components/Footer';
import { Sparkles, BookOpen, Users, Repeat, Shield, Star } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#FFF8F0] font-[Inter] overflow-x-hidden">
            <LandingNavbar />

            {/* Floating Stars Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <Star
                        key={i}
                        className="absolute text-[#E8C4D4] fill-current animate-pulse"
                        style={{
                            width: Math.random() * 20 + 10 + "px",
                            height: Math.random() * 20 + 10 + "px",
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.4 + 0.1,
                            animationDelay: Math.random() * 5 + "s",
                            animationDuration: Math.random() * 5 + 3 + "s",
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EEF9] text-[#9B7EBD] font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>A Magical Book Exchange</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif text-[#3D3344] leading-tight mb-6">
                            Swap, Share, and Discover the Stories That Find You
                        </h1>

                        <p className="text-base sm:text-lg text-[#6B5B73] mb-8 sm:mb-10 leading-relaxed max-w-lg">
                            Step into an enchanted library where books find new homes and readers discover their next adventure. Join our magical community of storytellers and dreamers.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/auth"
                                state={{ isLogin: true }}
                                className="px-8 py-4 rounded-2xl bg-[#9B7EBD] text-white font-semibold hover:bg-[#8A6EA8] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Explore Books
                                <span className="text-xl">→</span>
                            </Link>
                            <Link
                                to="/auth"
                                state={{ isLogin: false }}
                                className="px-8 py-4 rounded-2xl bg-white border border-[#E8C4D4] text-[#6B5B73] font-semibold hover:bg-[#F5EEF9] transition-all shadow-sm hover:shadow-md"
                            >
                                Join the Community
                            </Link>
                        </div>

                        <div className="mt-8 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8">
                            <div>
                                <div className="text-xl sm:text-3xl font-bold text-[#9B7EBD] mb-1">10,000+</div>
                                <div className="text-[#6B5B73] text-xs sm:text-sm">Books Swapped</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-3xl font-bold text-[#9B7EBD] mb-1">5,000+</div>
                                <div className="text-[#6B5B73] text-xs sm:text-sm">Active Readers</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-3xl font-bold text-[#9B7EBD] mb-1">50+</div>
                                <div className="text-[#6B5B73] text-xs sm:text-sm">Communities</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 lg:h-[600px]">
                        <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl  border-white/20">
                            <img
                                src="/1.jpeg"
                                alt="Magical Library"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0"></div>

                            {/* Floating Cards */}
                            {/* <div className="absolute top-1/4 right-1/4 w-40 h-48 bg-[#C8B6D6]/90 backdrop-blur-md rounded-2xl shadow-xl transform rotate-6 animate-float"></div>
                            <div className="absolute bottom-1/3 left-1/4 w-40 h-48 bg-[#E8C4D4]/90 backdrop-blur-md rounded-2xl shadow-xl transform -rotate-3 animate-float" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-1/3 left-1/3 w-40 h-48 bg-[#9B7EBD]/90 backdrop-blur-md rounded-2xl shadow-xl transform rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute bottom-1/4 right-1/3 w-40 h-48 bg-[#D4A574]/90 backdrop-blur-md rounded-2xl shadow-xl transform -rotate-6 animate-float" style={{ animationDelay: '3s' }}></div> */}
                        </div>

                        {/* Decorative Elements */}
                        <Sparkles className="absolute -top-8 -right-8 w-12 h-12 text-[#D4A574] animate-pulse" />
                        <Star className="absolute -bottom-4 -left-4 w-8 h-8 text-[#9B7EBD] animate-bounce" />
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="py-24 bg-[#FFF8F0] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-[#6B5B73] font-medium mb-4">
                        <span className="text-[#D4A574]">✦</span>
                        How the Magic Works
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#3D3344] mb-8 sm:mb-16">
                        Share your beloved books and discover new worlds in just a few enchanted steps
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                        {[
                            { icon: BookOpen, title: "List Your Books", desc: "Add your treasured stories to the collection", color: "bg-[#E8C4D4]" },
                            { icon: Users, title: "Browse the Library", desc: "Explore books from kindred spirits nearby", color: "bg-[#9B7EBD]" },
                            { icon: Repeat, title: "Request Swaps", desc: "Send magical invitations to fellow readers", color: "bg-[#D4A574]" },
                            { icon: Shield, title: "Safe Exchange", desc: "Meet safely and share the magic", color: "bg-[#7B8FA3]" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full ${item.color}/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg`}>
                                        <item.icon className="w-5 sm:w-6 h-5 sm:h-6" />
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-[#3D3344] mb-2 sm:mb-3">{item.title}</h3>
                                <p className="text-sm sm:text-base text-[#6B5B73] leading-relaxed text-center">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-b from-[#FFF8F0] to-[#F5EEF9] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="mb-8 flex justify-center">
                        <Sparkles className="w-12 h-12 text-[#D4A574]" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3D3344] mb-4 sm:mb-6">
                        Ready to Begin Your Journey?
                    </h2>
                    <p className="text-lg sm:text-xl text-[#6B5B73] mb-8 sm:mb-10">
                        Join our enchanted community of book lovers. Your next adventure awaits.
                    </p>
                    <Link
                        to="/auth"
                        state={{ isLogin: false }}
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#9B7EBD] text-white font-semibold hover:bg-[#8A6EA8] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        Create Free Account
                        <span>→</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
