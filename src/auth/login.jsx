import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [managersFile, setManagersFile] = useState([]);
    const [employeesFile, setEmployeesFile] = useState([]);
    const collectionRef = collection(db,"managers");

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, you can navigate to the desired page
                navigate("/departments");
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    },[])


    useEffect(()=>{
        getMangerFile();
    },[])
    useEffect(()=>{
        getEmployeesFile();
    },[])

    const getMangerFile =async ()=>{
        try{
            const data = await getDocs(collectionRef);
            const filteredManagersData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            setManagersFile(filteredManagersData);
        }catch(err){
            console.log(err)
        }
    }

    const getEmployeesFile = async ()=>{
        try{
            const data = await getDocs(collection(db,"employees"));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            setEmployeesFile(filteredData);
        }catch(err){
            console.log(err)
        }
    }
    const singnInHandler = async () => {
        // هون منعنا التحديث التلقائي للصفحة بعد الضغط على الزر مشان نقدر نستخدم الكود اللي تحت بدون ما يضيع
        // e.preventDefault();
        const lowerName = email.toLowerCase();

        // هون لازم نستخدم كود مشان نتاكد من كلمة السر والاسم اذا كانت صحيحة نسمح له بالدخول الى الصفحة حسب الوظيفة اللي هو فيها اذا كان مدير يروح لصفحة المديرين اذا كان عامل يروح لصفحة الموظفين
        try{
            // await signInWithEmailAndPassword(auth, lowerName, password);
            window.localStorage.setItem("loginEmail", lowerName);
            window.localStorage.setItem("loginPassword", password);
            await signInWithEmailAndPassword(auth, lowerName, password);
            if(auth.currentUser?.email === "root@gmail.com")  navigate("/managers") ;
            
            managersFile.map((ele)=>{
                ele.name === email ? navigate("/departments"): null
            })
            employeesFile.map((ele)=>{
                ele.empEmail === email ? navigate('/departments/products',{state:{deptId:ele.deptid}}):null;
            })


            // await signInWithEmailAndPassword(auth, lowerName, password);
        }catch(err){
            console.log(err);
        }
    
        
        setEmail("");
        setPassword("");
        
    };
    
    return (
        //  تسجيل دخول عن طريق ادقال الاسم وكلمة السر 
        //  بحيث ان كلمة السر تاخذ من المبرمج بحيث كنت مدير او عن طريق المدير اذا كنت عامل 
        // لازم عند الزر تحت نتاكد من كلمة السر والاسم اذا كانت صحيحة نسمح له بالدخول الى الصفحة الرئيسية
        // كلمة السر تاخذ من المبرمج في حال كان مالك اي يعني مدير 
        // كلمة السر تاخذ من المدير في حال كان عامل
        
        <div className="w-full h-screen bg-slate-800 flex justify-center items-center">
            <div className="bg-neutral-800/50 w-[300px] max-h-[400px] rounded-2xl">
                <h1 className="bg-fuchsia-500 text-center p-4  font-bold text-[22px] rounded-2xl">Login</h1>
                <form className="p-4 gap-4">
                    <label className="text-[#FFF]">Name</label><br/>
                    <input  onChange={(e)=>setEmail(e.target.value)} type="email" className="border-b-2 border-[#FFF] mb-5 w-full focus:outline-none "/><br/>
                    <label className="text-[#FFF]">Password </label><br/>
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" className=" bg-neutral-800/50 border-b-2 border-[#FFF] mb-5 w-full focus:outline-none" /><br/>

                    <div onClick={singnInHandler} className="bg-fuchsia-500 py-2 px-8 rounded-xl text-[14px] font-bold cursor-pointer ">Submit</div>
                </form>
                
            </div>
        </div>
    );
}


