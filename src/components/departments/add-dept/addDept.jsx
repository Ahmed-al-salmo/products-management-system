import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AddDept() {
    const deptCollectionRef = collection(db,'departments');
    const navigate = useNavigate()
    useEffect(()=>{
        
    },[]);
    
    const [deptData, setDeptData] = useState({
        title: "",
        description: "",
        address: "",
        managerEmail:auth.currentUser?.email,
        numberOfEmployee:0,
    })
    const saveHandler =async ()=>{
        try{
            await addDoc(deptCollectionRef,deptData);
            navigate(-1)
        }catch(err){
            console.log(err)
        }
    }
    const cancelHandler =()=>{
        setDeptData({
            title: "",
            description: "",
            address: "",
            managerEmail:auth.currentUser?.email,
            numberOfEmployee:0,
        })
        navigate(-1)
    }
    return (
        <div className="min-h-screen bg-slate-800 ">
            <h1 className="text-4xl text-center text-fuchsia-500 pt-35 pb-10">Add Department</h1>
            <div className="flex justify-center"> 
                <form className=" w-[500px] bg-slate-500 p-5  text-bold text-white rounded-2xl ">
                    <div className="p-2 ">
                        <label >title</label> <br/>
                        <input type="text" onChange={(e)=>setDeptData({...deptData, title:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500 " /><br/>
                    </div>
                    <div className="p-2">
                        <label >Description</label> <br/>
                        <input type="text" onChange={(e)=>setDeptData({...deptData, description:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    <div className="p-2">
                        <label >Address of Department</label> <br/>
                        <input type="text" onChange={(e)=>setDeptData({...deptData, address:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    
                    <div className="mt-4">
                        <div onClick={saveHandler} className="py-2 px-5 mr-5 text-xl rounded-full cursor-pointer hover:bg-green-800 inline-block bg-green-500 ">Save</div>
                        <div onClick={cancelHandler} className="py-2 px-5 text-xl rounded-full cursor-pointer hover:bg-red-800 inline-block bg-red-500 ">Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    );
}