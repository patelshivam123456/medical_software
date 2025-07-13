import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(()=>{
    fetchTabDetails()
  },[])

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/clientauth/login");
      console.log(res.data);
      
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/clientauth/login', form);
      alert('Login successful');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input name="mobile" placeholder="Mobile" className="input" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="input" onChange={handleChange} />
        <button type="submit" className="btn">Login</button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </form>
    </div>
  );
}