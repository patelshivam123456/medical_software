import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('/api/clientauth/send-otp', { mobile });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('/api/clientauth/verify-otp', { mobile, otp, newPassword });
      alert('Password reset successful');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {step === 1 ? (
          <>
            <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Mobile" className="input" />
            <button onClick={sendOtp} className="btn">Send OTP</button>
          </>
        ) : (
          <>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" className="input" />
            <input value={newPassword} type="password" onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="input" />
            <button onClick={resetPassword} className="btn">Reset Password</button>
          </>
        )}
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
}