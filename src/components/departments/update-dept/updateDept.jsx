import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
export default function UpdateDept() {
    const navigate = useNavigate();
    const [deptOldAndNewData, setdeptOldAndNewData] = useState({
        title: "",
        description: "",
        address: "",
    })
    const location = useLocation();
    const deptId = location.state?.deptId || null;

    const deptColllectionRef = collection(db,"departments")

    useEffect(()=>{
        const getOldDept = async ()=>{
            try{
                const data = await getDocs(deptColllectionRef)
                const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
                filteredData.map((ele)=>{
                    ele.id === deptId && setdeptOldAndNewData(ele)
                })
            }catch(err){
                console.log(err)
            }
        }
        getOldDept();
    },[])

    
    const saveUpdateHandler = async ()=>{
        try{
            const docRef = doc(db,'departments',deptOldAndNewData?.id);
            await updateDoc(docRef,
                {title:deptOldAndNewData.title, 
                address:deptOldAndNewData.address, 
                description:deptOldAndNewData.description
            });
            setdeptOldAndNewData({
                title: "",
                description: "",
                address: "",
            })
            navigate(-1)
        }catch(err){
            console.log(err)
        }
    }
    const cancelHandler =()=>{
        setdeptOldAndNewData({
            name: "",
            description: "",
            address: "",
        })
        const inputs = document.querySelectorAll("form input");
        inputs.forEach((item)=>{
            item.value=""
        })
        navigate(-1);
        //لازم ضيف كود مشان نرجع للصفحة القبل بس يتنفز هالتابع
    }
    return (
        <div className="min-h-screen bg-slate-800 ">
            <h1 className="text-4xl text-center text-fuchsia-500 pt-35 pb-10">Update Department</h1>
            <div className="flex justify-center"> 
                <form className=" w-[500px] bg-slate-500 p-5  text-bold text-white rounded-2xl ">
                    <div className="p-2 ">
                        <label >Name</label> <br/>
                        <input value={deptOldAndNewData?.title} type="text" onChange={(e)=>setdeptOldAndNewData({...deptOldAndNewData, title:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500 " /><br/>
                    </div>
                    <div className="p-2">
                        <label >Description</label> <br/>
                        <input value={deptOldAndNewData?.description} type="text" onChange={(e)=>setdeptOldAndNewData({...deptOldAndNewData, description:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    <div className="p-2">
                        <label >Address of Department</label> <br/>
                        <input value={deptOldAndNewData?.address} type="text" onChange={(e)=>setdeptOldAndNewData({...deptOldAndNewData, address:e.target.value})} className="w-full focus:outline-none border-b-2 border-b-fuchsia-500"/><br/>
                    </div>
                    
                    <div className="mt-4">
                        <div onClick={saveUpdateHandler} className="py-2 px-5 mr-5 text-xl rounded-full cursor-pointer hover:bg-green-800 inline-block bg-green-500 ">Save Update</div>
                        <div onClick={cancelHandler} className="py-2 px-5 text-xl rounded-full cursor-pointer hover:bg-red-800 inline-block bg-red-500 ">Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    );
}