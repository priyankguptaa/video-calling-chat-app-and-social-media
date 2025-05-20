import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { signin } from '../lib/api';
import { Link } from 'react-router';
import { Landmark, ShipWheelIcon } from 'lucide-react';

const LoginPage = () => {
  const [signinData,setSigninData]= useState({
    email:"",
    password:"",
  });

  const queryClient = useQueryClient();
  const {mutate:signinMutation, isPending,error}=useMutation({
    mutationFn:signin,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  });

  const handleSignin = (e)=>{
    e.preventDefault();
    signinMutation(signinData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">            
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
            <div className="mb-4 flex items-center justify-start gap-2">
              <Landmark className='size-16 text-primary' />
              <span className='text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                Elemental Edge Design Studio
              </span>
              
            </div>
            {error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response.data.message}</span>
              </div>
            )}
            <div className='w-full'>
              <form onSubmit={handleSignin}>
                <div className='space-y-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>Welcome Back</h2>
                      <p className='text-sm opacity-70'>
                        Sign in to your account to continue your language journey
                      </p>
                  </div>
                  <div className='space-y-3'>
                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'> Email</span>
                      </label>
                      <input
                        type="text"
                        placeholder='johndoe@mail.com'
                        className='input input-bordered w-full'
                        value={signinData.email}
                        onChange={(e)=>setSigninData({...signinData,email:e.target.value})}
                        required
                      />
                    </div>
                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder='******'
                        className='input input-bordered w-full'
                        value={signinData.password}
                        onChange={(e)=>setSigninData({...signinData,password:e.target.value})}
                        required
                      />
                    </div>
            
                  </div>
                <button className='btn btn-primary w-full' type='submit' disabled={isPending}>
                  {isPending?(
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Signing in....
                    </>
                  ):( "Sigin In") }
                </button>
                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
                </div>
              </form>
            </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Architect-amico.png" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>            
      </div>
    </div>
  )
}

export default LoginPage

