import React from "react";
import { FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {db} from '../../config/firebase'
import { getDocs , collection, doc, deleteDoc } from "firebase/firestore";
import NavBar from "../navBar/naveBar";

//  هيموجودة من نظرة المدير لاني هو الوحيد اللي بيقدر يشوف الموظفين ويعدل عليهم ويضيف موظفين جدد ويمسح موظفين كمان

export default function Employees (){
    const navigate = useNavigate();
    const location = useLocation();
    const deptId = location.state?.deptId;

    const employeesCollectionRef = collection(db, "employees");
    const departmentCollectionRef = collection(db, "departments");

    const [departmentName, setDepartmentName] = useState(''); // يحتوي على اسم القسم
    const [employees, setEmployees] = useState([]); // يحتوي على قائمة الموظفين في القسم الحالي
    const [isReloaded, setIsReloaded] = useState(false); // لتتبع حالة إعادة تحميل الصفحة بعد التعديل أو الإضافة
    useEffect(() => {
        const getDepartmentName = async () => {
            try {
                const data = await getDocs(departmentCollectionRef);
                const filteredDept = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                const department = filteredDept.find((dept) => dept.id === deptId);
                setDepartmentName(department ? department.title : 'loading..'); // تعيين اسم القسم أو تركه فارغًا إذا لم يتم العثور عليه
                getEmployees(); // جلب الموظفين بعد الحصول على اسم القسم
            } catch (error) {
                console.error("Error fetching department name: ", error);
            }
        }
        getDepartmentName();
    },[]) //خاصة بجلب اسم القسم


    useEffect(() => {
        try{
            location.state?.isReloaded && getEmployees();
            
        }catch(err){
            console.log(err)
        }
    },[location.state]) // خاصة بتتبع إعادة تحميل الصفحة بعد التعديل أو الإضافة

    const getEmployees = async () => { 
        try{
            const data = await getDocs(employeesCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const employeesInDepartment = filteredData.filter((emp) => emp.deptid === deptId);
            setEmployees(employeesInDepartment);
            setIsReloaded(false); // إعادة تعيين حالة إعادة التحميل بعد جلب الموظفين
        }catch(err){
            console.log(err)
        }
    }

    const updateHandler=(emp)=>{
        navigate('/departments/products/update-emp',{state:{deptId:deptId, deptName:departmentName, employee:emp}})
    }

    const deleteHandler= async(emp)=>{
        console.log(emp)
        try{
            const docRef = doc(db,'employees',emp.id);
            await deleteDoc(docRef,emp.id);
            // await signOut(auth,emp.email ,emp.password); // تسجيل الخروج بعد حذف الموظف
            setIsReloaded(true); // تغيير حالة إعادة التحميل لتحديث الصفحة
        }catch(err){
            console.log(err)
        }
    }

    const addNewEmmployee =()=>{
        navigate('/departments/products/add-emp',{state:{deptId:deptId, deptName:departmentName}})
    }
    {isReloaded && getEmployees();} // إذا كانت حالة إعادة التحميل صحيحة، قم بجلب الموظفين مرة أخرى لتحديث الصفحة
    return (
        <div className="w-full min-h-screen flex bg-slate-800">
            <NavBar 
                deptId={deptId}
            />
            <div className="w-full">
                <h1 className=" w-full text-4xl text-center text-fuchsia-500 pt-25">Employees in {departmentName}</h1>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto my-5' />
                <div className="py-3 cursor-pointer" onClick={addNewEmmployee}>
                    <form className="flex justify-center items-center m-3 bg-fuchsia-500 w-[300px] rounded-lg mx-auto " >
                        <FaPlus className="text-fuchsia-500 text-white " />
                        <p className="bg-fuchsia-500 text-white px-3 py-1 rounded-lg m-2" >Add new Employee</p>
                    </form>
                </div>
                <div className="p-3">
                    <div className="flex flex-wrap justify-center max-h-[70vh] overflow-y-auto   scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-red-500">
                        {employees.map((emp) => (
                            <div key={emp.id} className="w-[250px]  bg-slate-600 border-fuchsia-500 border-2 rounded-xl m-3 text-center  text-white ">
                                <p className="m-2 text-xl">{emp.name}</p>
                                <p className="m-2 text-sm">{emp.address}</p>
                                <p className="m-2 text-md">{emp.phoneNumber}</p>
                                <p className="m-2 ">{emp.departmentName}</p>
                                <p className="m-2 ">{emp.password}</p>
                                <form className="flex justify-center m-3">
                                    <div onClick={()=>updateHandler(emp)} className="bg-fuchsia-700 text-white px-3 py-1 rounded-lg m-2 cursor-pointer hover:bg-fuchsia-600">
                                        Update
                                    </div>
                                    <div onClick={()=>deleteHandler(emp)} className="bg-red-700 text-white px-3 py-1 rounded-lg m-2 cursor-pointer hover:bg-red-600">Delete</div>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

