'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const logout = () => {

const router = useRouter()
useEffect(()=>{
    window.sessionStorage.clear()
    router.push('/login')
},[])
  return (
    <div>Logging out...</div>
  )
}

export default logout