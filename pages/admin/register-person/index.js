// pages/client-users.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import LoaderComp from '@/components/User/LoaderComp';

const ClientUsersPage=(props)=> {
  const [activeTab, setActiveTab] = useState('signup');
  const [signupUsers, setSignupUsers] = useState([]);
  const [loginUsers, setLoginUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedCheck,setIsLoggedCheck] = useState('')

  useEffect(() => {
    if(props.isLoggedStatus){
      setIsLoggedCheck(props.isLoggedStatus)
    }
   
  }, []);

  const fetchUsers = async (type) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        type === 'signup' ? '/api/clientauth/register' : '/api/clientauth/login'
      );
      if (type === 'signup') {
        setSignupUsers(res.data || []);
      } else {
        setLoginUsers(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers('signup');
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'signup' && signupUsers.length === 0) {
      fetchUsers('signup');
    } else if (tab === 'login' && loginUsers.length === 0) {
      fetchUsers('login');
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  const renderTable = (users) => (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 border">#</th>
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Mobile</th>
           {activeTab === 'signup'&& <th className="px-4 py-3 border">Pet Name</th>}
            {activeTab === 'signup'&&<th className="px-4 py-3 border">Created At</th>}
            {activeTab === 'signup'&&<th className="px-4 py-3 border">Updated At</th>}
            {activeTab === 'login'&&<th className="px-4 py-3 border">Last Login</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">{u.name || '-'}</td>
              <td className="px-4 py-2 border">{u.mobile || '-'}</td>
              {activeTab === 'signup'&&<td className="px-4 py-2 border">{u.petName || '-'}</td>}
              {activeTab === 'signup'&&<td className="px-4 py-2 border">{formatDate(u.createdAt)}</td>}
             { activeTab === 'signup'&&<td className="px-4 py-2 border">{formatDate(u.updatedAt)}</td>}
             { activeTab === 'login'&&<td className="px-4 py-2 border">{formatDate(u.lastLogin)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !loading && (
        <div className="text-center py-4 text-gray-500">No users found</div>
      )}
    </div>
  );

  return (
    <>
      <Header isLoggedStatus={isLoggedCheck}/>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Client Users</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleTabClick('signup')}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === 'signup' ? 'bg-blue-600 text-white ' : 'bg-gray-200 text-gray-700 cursor-pointer'
          }`}
        >
          Signup Users
        </button>
        <button
          onClick={() => handleTabClick('login')}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 cursor-pointer text-gray-700'
          }`}
        >
          Login Users
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {/* Loader or Table */}
      {loading ? (
        <div className='flex justify-center items-center mt-[15%]'><LoaderComp/></div>
      ) : activeTab === 'signup' ? (
        renderTable(signupUsers)
      ) : (
        renderTable(loginUsers)
      )}
    </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { loggedIn, loginType } = context.req.cookies;

  if (!loggedIn && !context.query.loggedIn) {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  // Only allow admin or sales
  if (loggedIn && loginType !== "admin") {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const isLoggedStatus= loggedIn

  return {
    props: {isLoggedStatus},
  };
}
export default ClientUsersPage