import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingBtn from '@/components/Buttons/LoadingBtn';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Login = () => {
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
  const router= useRouter()

  useEffect(() => {
    fetchTabDetails();
  }, []);

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/clientauth/login");
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target;
    // Allow only digits for mobile
    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res =  await axios.post('/api/clientauth/login', form);
      if(res.data.message==="Login successful"){
      toast.success('Login successful');
      setError('');
      setLoading(false)
      Cookies.set("mobile",res.data.user.mobile)
      Cookies.set("userLoggedIn",true)
      router.push("/")
    }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
      setLoading(false)
    }
  };

  return (
    <>
    <div className="flex justify-center mt-3">
        <img src="/sriji.png" alt="logo" className="w-24" />
      </div>
    <div className="flex justify-center items-center  px-4">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-green-900">Login</h2>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            placeholder="Enter 10-digit mobile"
            value={form.mobile}
            onChange={handleChange}
            minLength={10}
            maxLength={10}
            pattern="\d{10}"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end -mt-4">
          <div onClick={()=>router.push("/user/reset-password")} className='text-red-600 text-sm font-semibold cursor-pointer'>Reset Password</div>
        </div>

        {error && (
          <p className="text-sm text-red-500 italic">{error}</p>
        )}

        {loading?<LoadingBtn width={"true"} />:<button
          type="submit"
          className="cursor-pointer w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Login
        </button>}
        <div className='flex justify-center'>
          <div>Don't have an account&nbsp;</div>
        <div onClick={()=>router.push("/user/register")} className='text-base text-green-900 font-semibold  cursor-pointer'>Register Now</div>
        </div>
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

export default Login;
