import React, { useContext, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/authContextStore'



const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {login} = useContext(AuthContext);

  const toggleState = (newState) => {
    setCurrState(newState);
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setShowPassword(false);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src="/logo.png" alt="" className='w-[min(30vw,250px)] rounded-md'/>
      {/* right */}
      <form onSubmit={onSubmitHandler} autoComplete="off" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img
            onClick={() => toggleState(currState === "Sign up" ? "Login" : "Sign up")}
            src={assets.arrow_icon}
            alt=""
            className='w-5 cursor-pointer'/>}
          {!isDataSubmitted && <img
            onClick={() => toggleState(currState === "Sign up" ? "Login" : "Sign up")}
            src={assets.arrow_icon}
            alt=""
            className='w-5 cursor-pointer'/>}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <>
            <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" name="new-fullname" autoComplete="off" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Full Name" required/>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="new-email" autoComplete="off" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Email Address" required/>
            <div className='relative flex items-center w-full'>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} name="new-password" autoComplete="new-password" className='p-2 w-full border border-gray-500 rounded-md focus:outline-none' placeholder="Password" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-3 text-gray-400 hover:text-gray-200 transition-colors'>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </>
        )}

        {currState === "Login" && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" autoComplete="email" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Email Address" required/>
            <div className='relative flex items-center w-full'>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" className='p-2 w-full border border-gray-500 rounded-md focus:outline-none' placeholder="Password" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-3 text-gray-400 hover:text-gray-200 transition-colors'>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a short bio...'
            required>
          </textarea>
        )}

        <button type='submit' className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='text-sm text-gray-500 text-center'>
          {currState === "Sign up" ? (
            <p>Already have an account?
              <span
                onClick={() => toggleState("Login")}
                className='text-violet-400 cursor-pointer underline ml-1'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-400'>Create an account?
              <span
                onClick={() => toggleState("Sign up")}
                className='text-violet-400 cursor-pointer underline ml-1'>
                Click here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage