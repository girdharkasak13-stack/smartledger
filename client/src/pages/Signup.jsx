import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-600 mb-1">SmartLedger</h1>
        <p className="text-slate-500 mb-6">Create your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white w-full py-2 rounded-lg font-medium transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-slate-500 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;