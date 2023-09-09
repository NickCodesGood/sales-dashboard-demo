import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // corrected the import path
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import { AddCircleOutline, EditNote, EditNoteOutlined, ExitToApp, RemoveCircleOutline } from '@mui/icons-material';

const LeadsDashboard = () => {
  //  for type hinting
  interface Lead{
    id: string;
    name: string;
    email: string;
    status: string;
    estimatedSaleAmount: number;
    // estimatedCommission: number; // set via backend
  }
  const router = useRouter();
  const [data, setData] = useState([]);  //for holding leads data
  const [currentPage, setCurrentPage] = useState(1); // for pagination
  const [totalPages, setTotalPages] = useState(1);// for pagination
  const [pageSize, setPageSize] = useState(5); // for pagination
  const [addLead, setAddLead] = useState(false) // for pagination
  const [deleteLead, setDeleteLead] = useState(false) //signifies whether user wants to start a delete
  const [editLead, setEditLead] = useState(false)//signifies whether user wants to start an edit
  const[isValidEmail, setIsValidEmail] = useState(true) //signifies whether entered email is valid
 
  const[targetIndex, setTargetIndex]=useState(-1) //the index of a chosen data object
  const blankDelete:Lead ={ //blank Lead obj
    id:'',
    name: '',
    email: '',
    status: 'prospect',
    estimatedSaleAmount: 0,
    // estimatedCommission: 0,
  }
  const [newLeadData, setNewLeadData] = useState({ //modified Lead obj sans-id 
    name: '',
    email: '',
    status: 'prospect',
    estimatedSaleAmount: 0
  }); 
  const [deleteNewLeadData, setDeleteNewLeadData] = useState(blankDelete); //Lead obj for deletion (p.s. really only need id...but hey.)
  const [editNewLeadData, setEditNewLeadData] = useState(blankDelete); //Lead obj for edit

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize]);

// Gets new data from backend
function fetchData(){
  let url:string = (!pageSize) ? `http://127.0.0.1:8000/leads/?page=${currentPage}` : `http://127.0.0.1:8000/leads/?page=${currentPage}&page_size=${pageSize}`
  axios.get(url, {
    headers: {
      'Authorization': `Token ${window.sessionStorage.getItem('token')}`,
    },
  })
  .then(response => {
    setData(response.data.results);
    if(currentPage == 1)
    setTotalPages(Math.ceil(response.data.count / pageSize));
  })
  .catch(error => {
    if(error.response?.status === 401) 
      router.push('/login');
    console.error('There was an error fetching data', error);
  });
}
// Used by table pagination buttons to change table pages
const handlePageChange = (mod:number) => {
  setCurrentPage(currentPage+mod);  
}
// Used by Add Lead Button to create new lead
const handleAddNewLead = async () => {
  
  if(validateEmail(newLeadData.email))
  try {
    await axios.post('http://127.0.0.1:8000/leads/', newLeadData, {
      headers: {
        'Authorization': `Token ${window.sessionStorage.getItem('token')}`
      }
    });
    fetchData();  // Refresh data after adding    
    setNewLeadData({  // Reset the input fields
      name: '',
      email: '',
      status: 'prospect',
      estimatedSaleAmount: 0,
      estimatedCommission: 0,
    });
  } catch (error) {
    console.error('Error adding new lead', error);
  }
};
// Validates an email using Regex
function validateEmail(email :string): boolean{
  let validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  setIsValidEmail(validEmail)
  return validEmail
}
// Used by Edit Lead Button to Edit new lead
  const handleEditNewLead = async () => {

  if(validateEmail(editNewLeadData.email))
    try {    
      await axios.put(`http://127.0.0.1:8000/leads/${editNewLeadData.id}/`, editNewLeadData, {
        headers: {
          'Authorization': `Token ${window.sessionStorage.getItem('token')}`
        }
      });
      fetchData();  
      setEditNewLeadData({  
        id: '',
        name: '',
        email: '',
        status: 'prospect',
        estimatedSaleAmount: 0,
        // estimatedCommission: 0,
      });
    } catch (error) {
      console.error('Error adding new lead', error);
    }
};
// Collection of Elements needed for Adding New Lead
const addNewLeadElements = () => (
  <div className="my-4 flex flex-col lg:flex-row justify-between">
    <div className="flex flex-col mb-2 lg:w-1/4 ">
      <label htmlFor="name" className="text-sm font-medium text-gray-600">Name:</label>
      <input id="name" type="text" placeholder="Name" className="border p-2 rounded" value={newLeadData.name} onChange={e => setNewLeadData({...newLeadData, name: e.target.value})} />
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/4">
      <label htmlFor="email" className="text-sm font-medium text-gray-600">Email:</label>
      <input id="email" type="email" placeholder="Email" className="border p-2 rounded" value={newLeadData.email} onChange={e => setNewLeadData({...newLeadData, email: e.target.value})} />
      {!isValidEmail && <p className='text-red-600 pl-1'>Invalid Email</p>}
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/6">
      <label htmlFor="status" className="text-sm font-medium text-gray-600">Status:</label>
      <select id="status" className="border p-2 rounded" value={newLeadData.status} onChange={e => setNewLeadData({...newLeadData, status: e.target.value})}>
        <option value="active">Active</option>
        <option value="prospect">Prospect</option>
        <option value="unqualified">Unqualified</option>
      </select>
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/6">
      <label htmlFor="estimatedSaleAmount" className="text-sm font-medium text-gray-600">Estimated Sale Amount:</label>
      <input id="estimatedSaleAmount" type="number" placeholder="Estimated Sale Amount" className="border p-2 rounded" value={newLeadData.estimatedSaleAmount} onChange={e => setNewLeadData({...newLeadData, estimatedSaleAmount: parseFloat(e.target.value)})} />
    </div>

    <button onClick={handleAddNewLead} className="hover:cursor-pointer bg-violet-500 text-white rounded p-3 lg:w-24">Add Lead</button>
  </div>
);
// Collection of Elements needed for Editing Lead
const editNewLeadElements = () => (
  <div className="my-4 flex flex-col lg:flex-row justify-between">
    <div className="flex flex-col mb-2 lg:w-1/4 ">
      <label htmlFor="name" className="text-sm font-medium text-gray-600">Name:</label>
      <input id="name" type="text" placeholder="Name" className="border p-2 rounded" value={editNewLeadData.name} onChange={e => setEditNewLeadData({...editNewLeadData, name: e.target.value})} />
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/4">
      <label htmlFor="email" className="text-sm font-medium text-gray-600">Email:</label>
      <input id="email" type="email" placeholder="Email" className="border p-2 rounded" value={editNewLeadData.email} onChange={e => setEditNewLeadData({...editNewLeadData, email: e.target.value})} />
      {!isValidEmail && <p className='text-red-600 pl-1'>Invalid Email</p>}
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/6">
      <label htmlFor="status" className="text-sm font-medium text-gray-600">Status:</label>
      <select id="status" className="border p-2 rounded" value={editNewLeadData.status} onChange={e => setEditNewLeadData({...editNewLeadData, status: e.target.value})}>
        <option value="active">Active</option>
        <option value="prospect">Prospect</option>
        <option value="unqualified">Unqualified</option>
      </select>
    </div>
    
    <div className="flex flex-col mb-2 lg:w-1/6">
      <label htmlFor="estimatedSaleAmount" className="text-sm font-medium text-gray-600">Estimated Sale Amount:</label>
      <input id="estimatedSaleAmount" type="number" placeholder="Estimated Sale Amount" className="border p-2 rounded" value={Number(editNewLeadData.estimatedSaleAmount.toString().replace(/,/g, ""))} onChange={e => setEditNewLeadData({...editNewLeadData, estimatedSaleAmount: parseFloat(e.target.value)})} />
    </div>

    <button onClick={handleEditNewLead} className="hover:cursor-pointer bg-violet-500 text-white rounded p-3 lg:w-24">Edit Lead</button>
  </div>
);
// Collection of Elements needed for Deleting Lead
const deleteNewLeadElements = () => (
  <div className="my-4 flex flex-col lg:flex-row justify-around items-center">
    <div className="flex flex-col mb-2 lg:w-1/4 w-full">
      <label htmlFor="id" className="text-sm font-medium text-gray-600">Id:</label>
      <input id="id" type="text" placeholder="ID" className="border p-2 rounded" value={deleteNewLeadData.id} onChange={e => {
        let updateId:Lead = {...deleteNewLeadData, id: e.target.value}        
        let x:any = data.findIndex((v:Lead, i:number)=> v.id == updateId.id)
        if(x>-1){
          let real_email:Lead= data[x]
          setDeleteNewLeadData({...updateId, email: real_email.email})
          setTargetIndex(x)
        }else{
          setDeleteNewLeadData({...updateId, email: ""})          
          setTargetIndex(-1)
        }
      }} />
    </div>
      <p>OR</p>    
    <div className="flex flex-col mb-2 lg:w-1/3 w-full">
      <label htmlFor="email" className="text-sm font-medium text-gray-600">Email:</label>
      <input id="email" type="email" placeholder="Email" className="border p-2 rounded" value={deleteNewLeadData.email} onChange={e => {        
        let updateEmail:Lead = {...deleteNewLeadData, email: e.target.value}        
        let x:any = data.findIndex((v:any,i:number)=> v.email.toLowerCase() == updateEmail.email.toLowerCase())        
        if(x>-1){
          let real_id:Lead = data[x]
          setDeleteNewLeadData({...updateEmail, id: real_id.id})
          setTargetIndex(x)
        }else{
          setDeleteNewLeadData({...updateEmail, id: ""})
          setTargetIndex(-1)
        }
        

      }} />
    </div>


    <button onClick={()=>handleDeleteConfirmation(deleteNewLeadData.id)} className="hover:cursor-pointer bg-violet-500 text-white rounded p-3 lg:w-24 w-full">Delete Lead</button>
  </div>
);
// Confirm before deleting!
const handleDeleteConfirmation = (index:string) => {

  let obj:Lead = data[targetIndex]
  let isConfirmed;
  if(obj){
    isConfirmed = window.confirm(`Are you sure you want to delete the following lead?\n\nLead {Id=${obj.id}, Name=${obj.name}, Email= ${obj.email}, Status=${obj.status}, EstimatedSaleAmount=${obj.estimatedSaleAmount},  EstimatedComission=${obj.estimatedCommission}}`);    
    if (isConfirmed) {        
      axios.delete(`http://127.0.0.1:8000/leads/${obj.id}/`,
      {headers:{Authorization: `Token  ${window.sessionStorage.getItem("token")}`}})
       .then(response => {            
         setDeleteNewLeadData(blankDelete)
         setTargetIndex(-1)
         fetchData();
       })
       .catch(error => {
         console.error('Error deleting the item:', error);
       });
    }
  }
  else
    isConfirmed = window.alert(`Please enter valid ID or Email.\n\nLead {Id=${deleteNewLeadData.id}, Email= ${deleteNewLeadData.email}}`);      
};
// Limit page size input to between 1 and 100 inclusive
const handlePageSizeInput = (inputValue:number) => {  
  if (inputValue > 0 && inputValue <= 100) {
    setPageSize(inputValue);
  }
};

  return (
    <div className="flex flex-col p-4 bg-gray-100 ">
      {/* Table Label + ADDITION_ICON  */}
      <div className='flex flex-row items-center'>        
        <div className='flex flex-row items-center w-1/2'>
          <h2 className="text-2xl font-bold pb-1 pr-3">Leads</h2>
          <div className='flex flex-row lg:w-24 justify-between'>
            <div className='hover:cursor-pointer' onClick={(e)=>{
              setAddLead(!addLead)
              setDeleteLead(false)
              setEditLead(false)
              setIsValidEmail(true)
              }}>
              <AddCircleOutline/>
            </div>
            <div className='hover:cursor-pointer' onClick={(e)=>{
              setDeleteLead(!deleteLead)
              setAddLead(false)
              setEditLead(false)
              setIsValidEmail(true)
              }}>
              <RemoveCircleOutline/>
            </div>
            <div className='hover:cursor-pointer' onClick={(e)=>{
              setEditLead(!editLead)
              setAddLead(false)
              setDeleteLead(false)
              setIsValidEmail(true)
              }}>
              <EditNote/>
            </div>
          </div>
        </div>
        {/* Exit Icon Only -- until real logout button added*/}
        <div className='flex flex-row items-center w-1/2 justify-end hover:cursor-pointer' onClick={(e)=>{router.push('/logout')}}>
          <ExitToApp/>
        </div>
      </div>
      {/*  Add/Edit/Delete Inputs & Table Controls */}
      <div className='overflow-x-auto'>
      {addLead && addNewLeadElements()}      
      {deleteLead && deleteNewLeadElements()}      
      {editLead && editNewLeadElements()}      
      <div className={"flex lg:flex-row flex-col-reverse items-center"}>        
        <div className={"flex flex-row"}>        
        {currentPage > 1 && (
          <button 
            onClick={() => handlePageChange(-1)}
            className="hover:cursor-pointer bg-violet-500 text-white px-4 py-2 rounded shadow hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 mr-2"
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button 
            onClick={() => handlePageChange(1)}
            className="hover:cursor-pointer bg-violet-500 text-white px-4 py-2 rounded shadow hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 mr-2"
          >
            Next
          </button>
        )}
        </div>
        <div className={"flex lg:flex-row flex-col pb-2 lg:pb-0"}>        
          <label className={"m-1"} htmlFor="pageSizeInput">Page Size: </label>
          <input 
              id="pageSizeInput"
              type="number" 
              value={pageSize} 
              className={"p-1"}
              onChange={(e)=>handlePageSizeInput(Number(e.target.value))} 
          />
        </div>
      </div>
      <table className="min-w-full border-collapse border bg-white shadow-md rounded-lg overflow-hidden text-left mt-2">
        {/* Table Header */}
        <thead className="bg-gray-200">
          <tr>
            {['ID', 'Name', 'Email', 'Status', 'Estimated Sale Amount', 'Estimated Commission'].map(header => (
              <th key={header} className="p-3 border-b font-medium text-gray-600">{header}</th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className=''>
          {data.map((item: any) => (
            <tr key={item.id}  
            // className='hover:cursor-pointer'          
             onClick={(e:any)=>{
              if(!addLead){
                let parent:any = (e.target.parentElement.firstChild.innerText) ? e.target.parentElement : (Number(e.target.parentElement.parentElement.parentElement.firstChild.innerText)) ? e.target.parentElement.parentElement.parentElement : e.target.parentElement.parentElement.children[0]                            
                let [id, name, email, status, estSaleAmt, estCommission] = parent.children                
                if(id && email){
                  let lead_obj: Lead;
                  if(deleteLead){
                    lead_obj = {...deleteNewLeadData, id: id.innerText, email: email.innerText}
                    setDeleteNewLeadData(lead_obj)
                  }else if (editLead){
                    lead_obj = {id: id.innerText, email: email.innerText, name: name.innerText, status: status.innerText, estimatedSaleAmount: estSaleAmt.innerText.replace("$",""), estimatedCommission: estCommission.innerText.replace("$","")}
                    setEditNewLeadData(lead_obj)
                  }else{
                    return
                  }                  
                  let x:any = data.findIndex((v:any,i:number)=> v.email.toLowerCase() == lead_obj.email.toLowerCase())        
                  setTargetIndex(x)
                }
              }
            }}>
              <td className="p-3 border-b">{item.id}</td>
              <td className="p-3 border-b">{item.name}</td>
              <td className="p-3 border-b">{item.email}</td>
              <td className="p-3 border-b flex items-center">
                <span className="mr-2">
                  {item.status === 'active' ? <CheckCircleIcon/> : 
                   item.status === "prospect" ? <VisibilityIcon/> : 
                   <BlockIcon/>}
                </span>
                {item.status}
              </td>
              <td className="p-3 border-b">${Number(item.estimatedSaleAmount).toFixed(2).toLocaleString()}</td>
              <td className="p-3 border-b">${Number(item.estimatedCommission).toFixed(2).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default LeadsDashboard;
