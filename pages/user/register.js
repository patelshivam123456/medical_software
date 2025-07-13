import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', mobile: '', password: '', petName: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(()=>{
    fetchTabDetails()
  },[])

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/clientauth/register");
      console.log(res.data);
      
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/clientauth/register', form);
      alert('Registered successfully');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input name="name" placeholder="Name" className="input" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile" className="input" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="input" onChange={handleChange} />
        <input name="petName" placeholder="What is your pet name?" className="input" onChange={handleChange} />
        <button type="submit" className="btn">Register</button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </form>
    </div>
  );
}