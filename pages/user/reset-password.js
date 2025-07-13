import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResetPassword() {
  const [form, setForm] = useState({ mobile: '', petName: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(()=>{
    fetchTabDetails()
  },[])

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/clientauth/reset-with-question");
      console.log(res.data);
      
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleVerify = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/clientauth/verify-pet', { mobile: form.mobile, petName: form.petName });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  const handleReset = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/clientauth/reset-with-question', form);
      setSuccess('Password reset successful');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={step === 1 ? handleVerify : handleReset} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input name="mobile" placeholder="Mobile" className="input" onChange={handleChange} disabled={step === 2} />
        <input name="petName" placeholder="What is your pet name?" className="input" onChange={handleChange} disabled={step === 2} />
        {step === 2 && (
          <input name="newPassword" type="password" placeholder="New Password" className="input" onChange={handleChange} />
        )}
        <button type="submit" className="btn">{step === 1 ? 'Verify' : 'Reset'}</button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}
      </form>
    </div>
  );
}