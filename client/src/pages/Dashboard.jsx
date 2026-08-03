import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: '',
    amount: '',
    category: 'General',
  });

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.log('Error fetching invoices:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/invoices', formData);
      setFormData({ vendorName: '', amount: '', category: 'General' });
      fetchInvoices();
    } catch (err) {
      console.log('Error adding invoice:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      console.log('Error deleting invoice:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  const categoryData = Object.values(
    invoices.reduce((acc, inv) => {
      if (!acc[inv.category]) {
        acc[inv.category] = { name: inv.category, value: 0 };
      }
      acc[inv.category].value += Number(inv.amount);
      return acc;
    }, {})
  );

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-1 text-emerald-400">SmartLedger</h1>
        <p className="text-slate-400 text-sm mb-8">Invoice & Billing</p>
        <nav className="space-y-2 flex-1">
          <div className="bg-slate-800 rounded-lg px-4 py-2 text-emerald-400 font-medium">
            Dashboard
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-white text-sm text-left"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Invoices</h2>
        <p className="text-slate-500 mb-8">Manage your billing records</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-emerald-600">₹{totalRevenue}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-slate-400 text-sm mb-1">Total Invoices</p>
            <p className="text-3xl font-bold text-slate-800">{invoices.length}</p>
          </div>
        </div>

        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-slate-800 mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Vendor Name"
            value={formData.vendorName}
            onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option>General</option>
            <option>Supplies</option>
            <option>Services</option>
            <option>Utilities</option>
          </select>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Add Invoice
          </button>
        </form>

        {/* Invoice List */}
        <div className="grid gap-4">
          {invoices.length === 0 && (
            <p className="text-slate-400 text-center py-8">No invoices yet. Add one above!</p>
          )}
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-slate-800">{invoice.vendorName}</h3>
                <p className="text-slate-400 text-sm">{invoice.category}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xl font-bold text-emerald-600">₹{invoice.amount}</span>
                <button
                  onClick={() => handleDelete(invoice._id)}
                  className="text-red-400 hover:text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;