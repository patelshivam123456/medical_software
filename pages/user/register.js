import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingBtn from '@/components/Buttons/LoadingBtn';
import { useRouter } from 'next/router';

const Register=()=> {
  const [form, setForm] = useState({ name: '', mobile: '', password: '', petName: '' });
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
  const router=useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("")
  };

  useEffect(() => {
    fetchTabDetails();
  }, []);

  const fetchTabDetails = async () => {

    try {
      const res = await axios.get("/api/clientauth/register");
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      await axios.post('/api/clientauth/register', form);
      toast.success('Registered successfully');
      setLoading(false)
      router.push("/user/login")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong")
      setLoading(false)
    }
  };

  return (
    <>
     <div className="flex justify-center ">
        <img src="/sriji.png" alt="logo" className="w-24" />
      </div>
    <div className="flex justify-center items-center  px-4">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-green-900">Register</h2>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
  <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="mobile">Mobile</label>
  <input
    type="tel"
    name="mobile"
    id="mobile"
    placeholder="Enter 10-digit mobile number"
    value={form.mobile}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only digits
      if (/^\d*$/.test(value)) {
        setForm({ ...form, mobile: value });
      }
    }}
    pattern="[0-9]{10}"
    minLength={10}
    maxLength={10}
    required
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="petName">Pet Name</label>
          <input
            type="text"
            name="petName"
            id="petName"
            placeholder="What is your pet's name?"
            value={form.petName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 italic">{error}</p>
        )}

        {loading?<div className='flex justify-center'><LoadingBtn width={"true"}/></div>:<button
          type="submit"
          className="cursor-pointer w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Register
        </button>}
        <div className='flex justify-center'>
          <div>Already have an account&nbsp;</div>
        <div onClick={()=>router.push("/user/login")} className='text-base text-green-900 font-semibold  cursor-pointer'>Login</div>
        </div>
      </form>
    </div>
    </>
  );
}

export async function getServerSideProps(context) {
  if (context.req.cookies.userLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/' },
    }
  }

  return { props: {} }
}

export default Register