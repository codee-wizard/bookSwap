// src/pages/AuthPage.jsx
import { useState } from "react";
import { BookOpen, Sparkles, Star, Feather } from "lucide-react";
import { useAuth } from "../context/authContext";

// Independent reusable components
function Button({ type = "button", className = "", children, ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ id, type = "text", value, onChange, placeholder, required, className = "" }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-4 py-3 border rounded-xl text-[#3D3344] placeholder-[#A795AD] bg-white/60 focus:outline-none focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#C8B6D6]/20 ${className}`}
    />
  );
}

function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`block mb-2 font-medium ${className}`}>
      {children}
    </label>
  );
}

// Main Auth component
export function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });
        alert("Login successful!");
        console.log("Login response:", res);
      } else {
        const res = await register({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
        alert("Account created successfully!");
        console.log("Register response:", res);
        setIsLogin(true); // switch to login page after successful signup
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden font-[Inter] bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0]">
      {/* Floating Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-[#D4A574] fill-current animate-float"
            style={{
              width: Math.random() * 15 + 5 + "px",
              height: Math.random() * 15 + 5 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 10 + 10 + "s",
            }}
          />
        ))}
      </div>

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6D6]/30 via-[#E8C4D4]/20 to-[#D4A574]/30"></div>
        <div className="max-w-md text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center relative animate-pulse shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #9B7EBD 0%, #C8B6D6 50%, #E8C4D4 100%)",
              }}
            >
              <BookOpen className="w-20 h-20 text-white relative z-10" />
              <Sparkles className="absolute top-4 right-4 w-8 h-8 text-[#FFF8F0]" />
              <Feather className="absolute bottom-6 left-6 w-6 h-6 text-[#FFF8F0]" />
            </div>
          </div>

          <h2 className="text-[#3D3344] mb-4 text-2xl font-semibold">
            Welcome to BookSwap
          </h2>
          <p className="text-[#6B5B73] leading-relaxed mb-8">
            Step into a world where stories find new homes and readers discover
            their next magical adventure. Join thousands of book lovers sharing
            their treasured tales.
          </p>

          {/* Stats */}
          <div className="space-y-4">
            {[
              { icon: <BookOpen className="text-white w-5 h-5" />, label: "10,000+", desc: "Magical Books Shared", gradient: "from-[#9B7EBD] to-[#C8B6D6]" },
              { icon: <Sparkles className="text-white w-5 h-5" />, label: "5,000+", desc: "Story Exchanges", gradient: "from-[#E8C4D4] to-[#D4A574]" },
              { icon: <Star className="text-white w-5 h-5 fill-current" />, label: "4.9/5", desc: "Community Rating", gradient: "from-[#7B8FA3] to-[#9B7EBD]" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-left shadow-lg border border-[#C8B6D6]/30 transform hover:scale-105 transition-transform duration-300 bg-white/70 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${item.gradient}`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-[#3D3344] font-semibold">
                    {item.label}
                  </div>
                </div>
                <div className="text-[#6B5B73]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-3 text-[#6B5B73] mb-8 group cursor-pointer">
            <BookOpen className="w-7 h-7 text-[#9B7EBD]" />
            <span
              className="text-[#3D3344] text-xl font-semibold group-hover:text-[#9B7EBD] transition-colors"
            >
              BookSwap
            </span>
          </div>

          <div className="bg-[#FFF9F5]/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#C8B6D6]/40 relative overflow-hidden">
            <div className="mb-8">
              <h1 className="text-[#3D3344] mb-2 text-2xl font-semibold">
                {isLogin ? "Welcome Back" : "Begin Your Journey"}
              </h1>
              <p className="text-[#6B5B73]">
                {isLogin
                  ? "Continue your magical reading adventure"
                  : "Join our enchanted community of readers"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="text-[#3D3344]">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-[#3D3344]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[#3D3344]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#9B7EBD] to-[#C8B6D6] hover:from-[#C8B6D6] hover:to-[#D4A574] text-white shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Login" : "Create Account"}
                  <Sparkles className="w-4 h-4 opacity-80" />
                </span>
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#9B7EBD] hover:text-[#D4A574] transition-colors duration-300 relative"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
                  <span className="block w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-[#9B7EBD] to-[#D4A574] transition-all duration-300"></span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-[#6B5B73] text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#9B7EBD] hover:text-[#D4A574]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#9B7EBD] hover:text-[#D4A574]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
