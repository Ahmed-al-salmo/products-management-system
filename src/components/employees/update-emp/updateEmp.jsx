import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import { updateDoc, doc } from "firebase/firestore";

export default function UpdateEmp() {
    const navigate = useNavigate();
    const location = useLocation();
    const departmentName = location.state?.deptName;
    const employee = location.state?.employee

    const [newEmpData, setNewEmpData] = useState({
        name: employee.name,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        
    });


    const cancelHandler =()=>{
        setNewEmpData({...newEmpData,
            name: "",
            address: "",
            phoneNumber: "",
        })
        navigate(-1)
    }
    
    const saveHandler = async()=>{
        // لازم ضيف للقاعدة
        try{
            const docRef = doc(db,"employees",employee.id);
            await updateDoc(docRef, newEmpData);
            navigate(-1,{state:{isReloaded:true}})
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-800 ">
            <h1 className="text-4xl text-center text-fuchsia-500 pt-25 py-10">Update Employee {employee.name} work in {departmentName}</h1>
            <div className="flex justify-center"> 
                <form className=" max-w-[500px] bg-slate-500 p-5 flex flex-wrap text-bold text-white rounded-2xl ">
                    <div className="p-2">
                        <label >Name</label> <br/>
                        <input value={newEmpData.name} type="text" onChange={(e)=>setNewEmpData({...newEmpData, name:e.target.value})} className="focus:outline-none border-b-2 border-b-fuchsia-500 " /><br/>
                    </div>
                    <div className="p-2">
                        <label >Address</label> <br/>
                        <input value={newEmpData.address} type="text" onChange={(e)=>setNewEmpData({...newEmpData, address:e.target.value})} className="focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    <div className="p-2">
                        <label >Phone Number</label> <br/>
                        <input value={newEmpData.phoneNumber} type="text" onChange={(e)=>setNewEmpData({...newEmpData, phoneNumber:e.target.value})} className="focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    
                    <div className="p-2">
                        <label>Department</label> <br/>
                        <div className="focus:outline-none border-b-2 border-b-fuchsia-500 w-[190px]">
                            {departmentName || "Loading..."}
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div onClick={saveHandler} className="py-2 px-5 mr-5 text-xl rounded-full cursor-pointer hover:bg-green-800 inline-block bg-green-500 ">Update</div>
                        <div onClick={cancelHandler} className="py-2 px-5 text-xl rounded-full cursor-pointer hover:bg-red-800 inline-block bg-red-500 ">Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    )
}