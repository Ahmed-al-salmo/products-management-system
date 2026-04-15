import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import {auth, db} from '../../../config/firebase'
import { addDoc, collection,  } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
export default function AddEmp() {
    const location = useLocation();
    const navigate = useNavigate();
    const deptId = location.state?.deptId;
    const deptName = location.state?.deptName;
    const employeesCollectionRef = collection(db, "employees");
    const [newEmpData, setNewEmpData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        password: "",
        empEmail:'',
        departmentName:deptName,
        deptid:deptId,
        managerEmail:auth.currentUser?.email || "",
    }); // خاصة بتخزين بيانات الموظف الجديد اللي رح نضيفه للقاعدة
    const [managerData, setManagerData] = useState({
        email: "",
        password : "",
    })

    useEffect(()=>{
        setManagerData({
            email: window.localStorage.getItem('loginEmail') || "",
            password: window.localStorage.getItem('loginPassword') || "",
        })
    },[])
    const generatePassword = () => {
        // كود لتوليد كلمة سر عشوائية للمستخدم 
        // لازم عدل عليه بحيث يختبر عدم وجود كلمة السر سابقا 

        if( newEmpData.name!=="" ||
            newEmpData.address!=="" ||
            newEmpData.phoneNumber!=="" ||
            newEmpData.departmentName!=="" ) {
                const randomNo = Math.floor(Math.random() * 1000000);
                const st= newEmpData.name[0].toUpperCase() + newEmpData.name[1].toLowerCase();
                setNewEmpData({...newEmpData, password: st + randomNo});
        }
    }

    const saveHandler =async ()=>{
        // لازم ضيف للقاعدة 
        try{
            await addDoc(employeesCollectionRef, newEmpData);
            await createUserWithEmailAndPassword(auth, newEmpData.name.toLowerCase()+'@gmail.com', newEmpData.password);
            await signInWithEmailAndPassword(auth, managerData.email, managerData.password);
            navigate(-1,{state:{isReloaded:true}})
        }catch(err){
            console.log(err)
        }
    }
    const cancelHandler =()=>{
        //عملية تفريغ قول الادخال بالاضافة الغاء عملية الاضافة مع تفريغ ال state

        setNewEmpData({...newEmpData,
            name: "",
            address: "",
            phoneNumber: "",
            password: "",
            departmentName:"",
            deptid:"",
            managerEmail:"",

        })
        const inputs = document.querySelectorAll("form input");
        inputs.forEach((item)=>{
            item.value=""
        })
        
        navigate(-1,{state:{isReloaded:false}})
    }
    return (
        <div className="min-h-screen bg-slate-800 ">
            <h1 className="text-4xl text-center text-fuchsia-500 pt-25 pb-10">Add Employee in {deptName}</h1>
            <div className="flex justify-center"> 
                <form className=" max-w-[500px] bg-slate-500 p-5 flex flex-wrap text-bold text-white rounded-2xl ">
                    <div className="p-2">
                        <label >Name</label> <br/>
                        <input type="text" onChange={(e)=>setNewEmpData({...newEmpData, name:e.target.value,empEmail:e.target.value+'@gmail.com'})} className="focus:outline-none border-b-2 border-b-fuchsia-500 " /><br/>
                    </div>
                    <div className="p-2">
                        <label >Address</label> <br/>
                        <input type="text" onChange={(e)=>setNewEmpData({...newEmpData, address:e.target.value})} className="focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    <div className="p-2">
                        <label >Phone Number</label> <br/>
                        <input type="text" onChange={(e)=>setNewEmpData({...newEmpData, phoneNumber:e.target.value})} className="focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    
                    <div className="p-2">
                        <label>Department</label> <br/>
                        <div className="focus:outline-none border-b-2 border-b-fuchsia-500 w-[190px] ">
                            {deptName}
                        </div>
                    </div>
                    <div className="px-2 py-6 w-full">
                        <label onClick={generatePassword} className="py-2 px-6 mr-4 bg-fuchsia-500 text-bold rounded-full cursor-pointer">generate Password</label> 
                        <input value={newEmpData.password} type="text" disabled className="focus:outline-none border-b-2 border-b-red-900 "/>
                    </div>
                    <div className="mt-4">
                        <div onClick={saveHandler} className="py-2 px-5 mr-5 text-xl rounded-full cursor-pointer hover:bg-green-800 inline-block bg-green-500 ">Save</div>
                        <div onClick={cancelHandler} className="py-2 px-5 text-xl rounded-full cursor-pointer hover:bg-red-800 inline-block bg-red-500 ">Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    )
}