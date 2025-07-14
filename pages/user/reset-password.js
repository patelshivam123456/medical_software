import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import LoadingBtn from '@/components/Buttons/LoadingBtn';

const ResetPassword = () => {
  const [form, setForm] = useState({ mobile: '', petName: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [loading,setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    fetchTabDetails();
  }, []);

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/clientauth/reset-with-question");
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/clientauth/verify-pet', { mobile: form.mobile, petName: form.petName });
      setStep(2);
      toast.success("Verification successful. Please enter new password.");
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleReset = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/clientauth/reset-with-question', form);
      toast.success('Password reset successful');
      router.push("/user/login");
      setLoading(false)
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      toast.error(msg);
      setLoading(false)
    }
  };

  return (
    <>
    <div className="flex justify-center mt-4">
        <img src="/sriji.png" alt="logo" className="w-24" />
      </div>
    <div className="flex justify-center items-center  px-4">
      <form
        onSubmit={step === 1 ? handleVerify : handleReset}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-green-900">Reset Password</h2>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            placeholder="Enter 10-digit mobile number"
            value={form.mobile}
            onChange={handleChange}
            disabled={step === 2}
            minLength={10}
            maxLength={10}
            pattern="\d{10}"
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              step === 2 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-blue-500'
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="petName">Pet Name</label>
          <input
            type="text"
            name="petName"
            id="petName"
            placeholder="What is your pet's name?"
            value={form.petName}
            onChange={handleChange}
            disabled={step === 2}
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              step === 2 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-blue-500'
            }`}
          />
        </div>

        {step === 2 && (
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 italic">{error}</p>}
        {success && <p className="text-sm text-green-600 italic">{success}</p>}

       {loading?<LoadingBtn width={"true"}/> 
       :<button
          type="submit"
          className="cursor-pointer w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          {step === 1 ? 'Verify Pet Name' : 'Reset Password'}
        </button>}
      </form>
    </div>
    </>
  );
};

export async function getServerSideProps(context) {
  if (context.req.cookies.userLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/' },
    }
  }

  return { props: {} }
}

export default ResetPassword;
