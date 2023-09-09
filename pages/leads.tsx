'use client'
import '../src/app/globals.css'
import LeadsDashboard from "../src/app/Components/LeadsDashboard"




export default function Leads() {

  return (
    <div className="flex min-h-screen flex-col w-full p-24 bg-gray-100">      
        <LeadsDashboard/>              
    </div>
  )
}
