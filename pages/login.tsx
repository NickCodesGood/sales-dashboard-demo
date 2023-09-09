import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../src/app/globals.css'
import { useRouter } from 'next/navigation';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter()

  const handleLogin = async () => {    
    try {
        const response = await axios.post('http://127.0.0.1:8000/login/', {
            username,
            password
        });
        const token = response.data.token;
        window.sessionStorage.setItem('token', token); // Store the token in local storage
        if(token)
            router.push('/leads')
    } catch (error) {
        setMessage("Invalid credentials.")
    }
    
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="mb-6 text-xl text-center font-semibold text-gray-700">Login</h2>        
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <button onClick={()=>handleLogin()} className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Login
          </button>        
          <div className="mb-4">
          <p className='block mb-2 text-sm font-medium text-red-600'>
            {message}
          </p>
          </div>
      </div>
    </div>
  );
}

export default Login;
