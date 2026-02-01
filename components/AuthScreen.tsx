import React, { useState } from 'react';
import { Button } from './Button';
import { SproutLogo } from './SproutLogo';



interface AuthScreenProps {
  onLogin: (username: string) => void;
}

// Reusable Logo Component
// const SproutLogo = () => (
//   <div className="flex items-center gap-2 select-none cursor-pointer">
//     <img src={logo} alt="Sprout Logo" className="h-10 w-auto" />
//   </div>
// );

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email.split('@')[0]);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname) onLogin(nickname);
  };

  const goHome = () => setView('landing');

  // --- LANDING PAGE VIEW ---
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-sprout-bg flex flex-col font-sans relative overflow-hidden">
        {/* Navbar */}
        <header className="w-full py-6 px-4 sm:px-8 flex justify-between items-center max-w-7xl mx-auto z-10">
<SproutLogo className="h-10" />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('login')}
              className="hidden sm:block px-6 py-2 rounded-full font-bold text-gray-700 border-2 border-transparent hover:bg-gray-200 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => setView('signup')}
              className="px-6 py-2 rounded-full font-bold text-white shadow-lg shadow-purple-200 bg-gradient-to-r from-[#1CB0F6] to-[#A570FF] hover:brightness-110 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 mt-8 md:mt-16 mb-20">
          <div className="md:w-1/2 space-y-8 z-10 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1]">
              Investing in the <br />
              Humans of <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#1CB0F6] to-[#A570FF] pr-2">Tomorrow</span>
            </h1>

            <div className="space-y-4 max-w-md mx-auto md:mx-0">
              {[
                "Learn financial basics through play",
                "Safe, simulated trading environment",
                "Earn XP and unlock real rewards"
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-sprout-green flex-shrink-0" />
                  <span className="text-xl font-bold text-gray-700">{point}</span>
                </div>
              ))}
            </div>
            
            <div className="md:hidden pt-4">
               <Button fullWidth onClick={() => setView('signup')} variant="gradient">Start Learning Now</Button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end relative mt-12 md:mt-0">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full opacity-50 blur-3xl -z-10"></div>
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
              <div className="w-full h-full flex items-center justify-center text-[15rem] md:text-[20rem] select-none">
                🐼
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- AUTH FORM VIEW (LOGIN / SIGNUP) ---
  const isLogin = view === 'login';

  // UPDATED STYLES: Thicker light-grey border (border-2 border-gray-300), more rounded (rounded-2xl)
  const inputClasses = "w-full p-4 rounded-2xl border-2 border-gray-300 placeholder:text-gray-500 placeholder:font-bold font-bold text-gray-700 focus:border-sprout-purple focus:ring-4 focus:ring-purple-100/50 outline-none transition-all bg-white";

  return (
    <div className="min-h-screen bg-sprout-bg flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* <div onClick={goHome}>
          <SproutLogo />
        </div> */}
        <SproutLogo className="h-10" onClick={goHome} />
      </header>

      <main className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full px-4 sm:px-8 pb-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Mascot */}
          <div className="hidden md:flex justify-center relative">
             <div className="relative w-[400px] h-[400px]">
                <div className="w-full h-full flex items-center justify-center text-[15rem] md:text-[20rem] filter drop-shadow-2xl select-none">
                  🐼
                </div>
             </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-center mb-8 text-gray-900">
              {isLogin ? 'Welcome back' : 'Sign up'}
            </h2>

            <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="flex flex-col gap-5">
              
              {!isLogin && (
                <div className="flex flex-col gap-1">
                   {/* Nickname input */}
                   <input 
                      type="text" 
                      placeholder="Nick name"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className={inputClasses}
                   />
                </div>
              )}

              <div className="flex flex-col gap-1">
                 <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                 />
                 {!isLogin && email && !email.includes('@') && (
                    <span className="text-red-600 text-sm font-bold flex items-center gap-2 mt-1">
                       <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">!</span>
                       Please use a valid email address.
                    </span>
                 )}
              </div>

              <div className="flex flex-col gap-1">
                 <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                 />
                 {!isLogin && <span className="text-gray-500 font-bold text-sm ml-1">Minimum 8 characters.</span>}
              </div>

              {!isLogin && (
                 <div className="flex flex-col gap-1">
                   <input 
                      type="password" 
                      placeholder="Repeat Password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className={inputClasses}
                   />
                </div>
              )}

              <div className="text-left mt-1">
                <button type="button" className="text-sm font-bold text-gray-800 hover:text-gray-900">
                  Forget password?
                </button>
              </div>

              <div className="mt-4">
                 <Button 
                    fullWidth 
                    type="submit" 
                    variant="gradient"
                    className="rounded-full py-4 text-lg" 
                 >
                    {isLogin ? 'Log in' : 'Get started! →'}
                 </Button>
              </div>

              <div className="text-center mt-4 text-sm font-bold text-gray-700">
                {isLogin ? (
                  <>Don't have an account? <button type="button" onClick={() => setView('signup')} className="underline text-gray-900 hover:text-sprout-purple ml-1">Sign up</button></>
                ) : (
                  <>Have an account? <button type="button" onClick={() => setView('login')} className="underline text-gray-900 hover:text-sprout-purple ml-1">Sign in</button></>
                )}
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};