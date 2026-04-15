import React, { useEffect, useState } from "react";
import { FaPlus } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {auth, db} from '../../config/firebase';
import { getDocs, collection } from "firebase/firestore";

export default function Departments (){
    const navigate = useNavigate();
    const [departments, setDepartments]=useState([]);
    const [user, setUser]=useState('')
    const DepartmentsCollectionRef = collection(db,'departments');
    useEffect(()=>{
        const userEmail = auth.currentUser?.email;
        // const userEmail = auth.
        setUser(userEmail);
        console.log(userEmail)
        getDepartments();

    },[])

    const getDepartments = async ()=>{
        try{
            const data = await getDocs(DepartmentsCollectionRef);
            const filteredDept = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            setDepartments(filteredDept);

        }catch(err){
            console.log(err)
        }
    }
    const movingHandler =(id,e)=>{
        e.preventDefault()
        // navigate("/departments/products" ,{state:{deptId:id}});
        navigate('/departments/products',{state:{deptId:id}});
    }
    
    const addDepartmentHandler =()=>{
        navigate('/departments/add-dept')
    }
    const updateHandler =(e,id)=>{
        e.preventDefault()
        navigate("/departments/update-dept",{state:{deptId:id}});
    }
    // console.log(auth.currentUser?.email)
    return (
        <div className="w-full min-h-screen  bg-slate-800">
            {/* <NavBar /> */}
            <h1 className="text-4xl text-center text-fuchsia-500 pt-25 pb-10">Departments</h1>
            <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />
            <div className="p-3">
                <div className="flex flex-wrap justify-center max-h-[70vh] overflow-y-scroll ">
                    {departments.map((dept) => (
                        dept.managerEmail === user ? 
                            <div  key={dept.id} className="w-[250px]  bg-slate-600 border-fuchsia-500 border-2 rounded-xl m-3 text-center text-2xl text-white cursor-pointer">
                                <p onClick={(e)=>movingHandler(dept.id,e)} className="m-2">{dept.title}</p>
                                <p className="m-2 text-sm">{dept.description}</p>
                                <p className="m-2 text-md">{dept.address}</p>
                                <p className="m-2 ">{dept.numberOfEmployee}</p>
                                <form className="flex justify-center m-3">
                                    <button onClick={(e)=>updateHandler(e,dept.id)} className="bg-fuchsia-500 text-white px-3 py-1 rounded-lg m-2 hover:bg-fuchsia-600 cursor-pointer">
                                        <div className="text-white">Update </div>
                                    </button>
                                    <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded-lg m-2 hover:bg-red-600 cursor-pointer">Delete</button>
                                </form>
                            </div>:
                            null
                    ))}
                    <div onClick={addDepartmentHandler} className="border-fuchsia-500 border-2 rounded-xl w-[250px] flex flex-wrap justify-center items-center  bg-slate-800 m-5 text-center  text-white cursor-pointer hover:bg-slate-600" >
                        <FaPlus className="text-fuchsia-500 text-[80px] w-full text-center " />
                        <p className="text-fuchsia-500  ">Add new Department</p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}