import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import LoadingBtn from '@/components/Buttons/LoadingBtn'

const Login=()=> {
  const router = useRouter()
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading,setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post('/api/login', { mobile, password })
      if (res.data.success) {
        Cookies.set('loggedIn', 'true')
        router.push('/')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Invalid mobile number or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className='flex justify-center mt-10 mb-4'><img src="/sriji.png" alt="logo" className='w-24'/></div>
      <div className='border p-6'>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Mobile Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
       {isLoading?
       <div className='flex justify-end'>
       <LoadingBtn/>
   </div>
       :<div className='flex justify-end'> <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Login
        </button></div>}
      </form>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  console.log(context.req.cookies.loggedIn,"context.req.cookies.loggedIn");
  
  if (context.req.cookies.loggedIn) {
    return {
      props: {},
      redirect: { destination: "/" },
    };
  }

  return {
    props: {},
  };
}

export default Login