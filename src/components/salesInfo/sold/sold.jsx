import React, { useEffect, useState } from "react";
import NavBar from "../../navBar/naveBar";
import { db } from "../../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useLocation } from "react-router-dom";
export default function Sold (){
    const location = useLocation();
    const deptId = location.state?.deptId; 
    const departmentCollectionRef = collection(db, "departments");
    const collectionRef = collection(db,"sold-in-cash")
    const [productsSoldInCash, setProductsSoldInCash]= useState([]);
    const [departmentName,setDepartmentName] = useState('');

    useEffect(() => {
        const getDepartmentName = async () => {
            try {
                const data = await getDocs(departmentCollectionRef);
                const filteredDept = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                const department = filteredDept.find((dept) => dept.id === deptId);
                setDepartmentName(department ? department.title : 'loading..'); // تعيين اسم القسم أو تركه فارغًا إذا لم يتم العثور عليه
            } catch (error) {
                console.error("Error fetching department name: ", error);
            }
        }
        getDepartmentName();
    },[]) //خاصة بجلب اسم القسم

    useEffect(()=>{
        const getProductsSoldInCash = async()=>{
            try{
                const data = await getDocs(collectionRef);
                const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
                const sortedFilterdData = filteredData.sort((a,b)=> ( (parseInt(b.day) - parseInt(a.day)) || (parseInt(b.month) - parseInt(a.month)) || (parseInt(b.year) - parseInt(a.year)) ) )
                setProductsSoldInCash(sortedFilterdData)
            }catch(err){
                console.log(err)
            }
        }
        getProductsSoldInCash();
    },[])


    return (
        <div className='flex bg-slate-800'>
            <NavBar 
                deptId={deptId}
            />
            <div className='  min-h-screen text-white w-[100%] p-5 pt-25'> 
                <div className='w-fit text-3xl m-auto my-4 '><i>Paid By Cash in {departmentName}</i> </div>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />
                <div className='flex w-fit  my-2 m-auto'>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500' >Title</div>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500'>Amout</div>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500'>Total</div>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500'>loan</div>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500'>Time</div>
                    <div className='bg-neutral-800 text-center w-[110px] rounded-full p-2 m-2  text-fuchsia-500'>Date</div>
                </div>
                <div className=' w-fit  my-2 m-auto max-h-[70vh] overflow-y-auto p-3'>
                    {productsSoldInCash.map((prod)=>(
                        deptId === prod.deptid &&
                        < div key={prod.id} className='flex bg-neutral-800 w-fit my-2 m-auto rounded-full border-2 border-fuchsia-500'>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white truncate hover:text-wrap' >{prod.title}</div>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white'>{prod.soldAmount}</div>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white'>{prod.total}$</div>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white'>-</div>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white'>{prod.hours%12}:{prod.minets}</div>
                            <div className='bg-slate-800 text-center w-[110px] rounded-full p-2 m-2  text-white'>{prod.day}/{prod.month}/{prod.year}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}