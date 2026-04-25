import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, GraduationCap, Pencil, Sparkles, Star, ShieldCheck, UserCircle, Users } from 'lucide-react';
import api from '../api';
import AcademicBackground from '../components/AcademicBackground';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState(null); // 'ADMIN', 'TEACHER', 'PARENT' or null
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      const role = response.data.user.role;
      
      // Basic validation to ensure they are logging into the right portal
      if (loginType && role !== loginType) {
        setError(`This is the ${loginType.toLowerCase()} portal!`);
        return;
      }

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'TEACHER') navigate('/teacher');
      else if (role === 'PARENT') navigate('/parent');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const renderLoginButtons = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setLoginType('ADMIN')}
        className="w-full btn-cartoon-primary bg-accent-black text-accent-gold flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <ShieldCheck size={32} />
          <span className="text-2xl text-3d">Admin Hub</span>
        </div>
        <span className="text-xs font-black opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-accent-gold">Full Access</span>
      </button>

      <button 
        onClick={() => setLoginType('TEACHER')}
        className="w-full btn-cartoon-primary bg-accent-gold text-accent-black flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <UserCircle size={32} />
          <span className="text-2xl text-3d">Teacher Portal</span>
        </div>
        <span className="text-xs font-black opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-accent-black">Records & Students</span>
      </button>

      <button 
        onClick={() => setLoginType('PARENT')}
        className="w-full btn-cartoon-primary bg-accent-red text-white flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <Users size={32} />
          <span className="text-2xl text-3d">Parent Zone</span>
        </div>
        <span className="text-xs font-black opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-white">View Results</span>
      </button>
    </div>
  );

  const renderLoginForm = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => {
          setLoginType(null);
          setError('');
          setUsername('');
          setPassword('');
        }}
        className="mb-6 text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
      >
        ← Go Back
      </button>

      <div className={`p-4 mb-8 border-4 border-black rounded-2xl shadow-cartoon-sm flex items-center gap-4 ${
        loginType === 'ADMIN' ? 'bg-accent-black text-accent-gold' : 
        loginType === 'TEACHER' ? 'bg-accent-gold text-accent-black' : 'bg-accent-red text-white'
      }`}>
        {loginType === 'ADMIN' ? <ShieldCheck size={32} /> : 
         loginType === 'TEACHER' ? <UserCircle size={32} /> : <Users size={32} />}
        <div>
          <h3 className="text-2xl font-black uppercase italic text-3d">{loginType} LOGIN</h3>
          <p className={`text-xs font-bold uppercase tracking-widest ${loginType === 'PARENT' ? 'text-white/60' : 'text-black/60'}`}>Please enter your credentials</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-accent-red/10 border-4 border-accent-red text-accent-red font-black rounded-2xl">
          Oops! {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative group">
          <label className="block text-lg font-black text-black mb-2 uppercase tracking-tight text-3d">Username</label>
          <input 
            type="text" 
            className="input-cartoon focus:border-accent-gold"
            placeholder={loginType === 'PARENT' ? "e.g. parent_12345" : "Your username..."}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <label className="block text-lg font-black text-black mb-2 uppercase tracking-tight text-3d">Password</label>
          <input 
            type="password" 
            className="input-cartoon focus:border-accent-gold"
            placeholder="Secret code..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full btn-cartoon-primary text-xl mt-4 bg-accent-gold text-accent-black hover:bg-accent-black hover:text-accent-gold"
        >
          Unlock Portal! 🔑
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fffbeb] relative overflow-hidden">
      <AcademicBackground />

      <div className="p-10 cartoon-card w-full max-w-md relative z-10 bg-white">
        <div className="mb-10 text-center relative">
          <div className="w-20 h-20 bg-accent-gold border-4 border-black rounded-3xl flex items-center justify-center text-black mx-auto mb-6 shadow-cartoon transform -rotate-6 hover:rotate-0 transition-all duration-300">
            <GraduationCap size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic text-3d-lg">
            School <span className="text-accent-red underline decoration-4 decoration-accent-gold underline-offset-4">Portal</span>
          </h2>
          <p className="text-gray-600 mt-4 font-black text-lg italic uppercase">Select your role to start! 🎒</p>
        </div>

        {!loginType ? renderLoginButtons() : renderLoginForm()}
        
        <div className="mt-12 text-center">
          <p className="text-black font-black text-xs uppercase tracking-widest opacity-30">School Result System v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
