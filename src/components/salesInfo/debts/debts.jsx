import React, {useEffect, useState} from "react";
import NavBar from "../../navBar/naveBar";
import { FaTimes } from 'react-icons/fa'
import { useLocation } from "react-router-dom";
import { db } from "../../../config/firebase";
import { getDocs,collection, doc, updateDoc, deleteDoc } from "firebase/firestore";



// الفورم الخاص بالتعديل عالتقسيط و اللي بيظهر لما بضغط عالزر الخاص بالتعديل
const UpdateHandler =(props)=>{
    // بتحفظ الدفعة الجديدة اللي بدخلها المستخدم عشان نقدر نعدل عالتقسيط
    const [newInstallment , setNewInstallment] = useState(props.updateProduct.firstInstallment);
    const [newName, setNewName] = useState(props.updateProduct.customerName)
    const saveUpdateHandler =async()=>{
        try{
            const docRef = doc(db,'sold-in-installments',props.updateProduct.id);
            await updateDoc(docRef,{firstInstallment:newInstallment, customerName:newName});
            props.setIsUpdated(false);
            props.setIsReload(true)
        }catch(err){
            console.log(err)
        }
    }

    const cancelUpdateHandler =()=>{
        props.setIsUpdated(false);
        props.setUpdateProduct({});
        setNewInstallment(0);
        setNewName('');
    }

    return (
        <div className=" fixed z-[2] top-[50%] left-[50%] translate-[-50%]  bg-[#AAA] w-[600px]  rounded-4xl text-mono" >
            <FaTimes onClick={cancelUpdateHandler} className="m-4 text-xl hover:text-red-700 cursor-pointer" />
            <div className="text-center ">
                <h1 className="text-2xl">Updtae Installment {props.updateId}</h1>
                <div className="bg-white w-fit m-auto p-3 rounded-lg  my-5 text-black">
                    <label >New Istallment</label>
                    <input value={newInstallment} className=" border-2 border-black ml-4 p-2 rounded-lg focus:outline-none " onChange={(e)=> setNewInstallment(e.target.value)} /> <br/>
                    <label className="py-10" >Customer Name</label>
                    <input value={newName} className=" border-2 border-black ml-4 p-2 my-3 rounded-lg focus:outline-none " onChange={(e)=> setNewName(e.target.value)} /> <br/>
                </div>
            </div>
            <div className="ml-5 flex text-white mb-3"> 
                <div onClick={saveUpdateHandler} className="bg-green-700 w-fit px-5 py-2 m-2 rounded-lg hover:bg-green-500 cursor-pointer">Save</div>
                <div onClick={cancelUpdateHandler} className="bg-red-500 w-fit px-5 py-2 m-2 rounded-lg hover:bg-red-800 cursor-pointer">Cancel</div>
            </div>
        </div>
    );
}

export default function Debts(){
    const location = useLocation();
    const deptId = location.state?.deptId;
    const departmentCollectionRef = collection(db,'departments')
    const salesCollection = collection(db,'sold-in-installments');
    const [departmentName, setDepartmentName]=useState('')
    const [isUpdated , setIsUpdated] = useState(false);
    const [updateProduct , setUpdateProduct] = useState({});
    const [productsSoldInInstallments, setProductsSoldInInstallments]=useState([])
    const [isReload, setIsReload] = useState(false)
    const [searchByCustomerName, setSearchByCustomerName]= useState("");

    useEffect(()=>{
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
    },[])// خاصة بجلب اسم القسم 

    useEffect(()=>{
        getProducts();
    },[])

    const getProducts = async()=>{
        try{
            const data = await getDocs(salesCollection);
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            const sortedFilterdData = filteredData.sort((a,b)=> ( (parseInt(b.day) - parseInt(a.day)) || (parseInt(b.month) - parseInt(a.month)) || (parseInt(b.year) - parseInt(a.year)) ) )
            setProductsSoldInInstallments(sortedFilterdData)
        }catch(err){
            console.log(err)
        }
    }

    const cancelHandler =async (id,soldAmount,prodid)=>{
        if(confirm("Are you sure you want to cancel this installment?")){
            console.log("installment cancelled");
            // هنا لازم نضيف التابع اللي يلغي عملية التقسيط
            // لازم نعدل عالقاعدة لاني البيع و والدفع كلو انلغى 
            // ولازم نحذف العنصر من المبيعات 
            console.log(id,soldAmount,prodid,'=============')
            const collectionRef = collection(db,'products')
            const data = await getDocs(collectionRef);
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            const product = filteredData.find((doc)=> doc.id=== prodid )

            const docRef = doc(db,'products',prodid);
            const docRefInstallments = doc(db,'sold-in-installments',id)
            await updateDoc(docRef,{amount:parseInt(product.amount)+parseInt(soldAmount)})
            await deleteDoc(docRefInstallments,id)
            console.log(product)
            getProducts();
        }
        else {
            console.log("cancellation aborted");
        }
    }
    {isReload ? (getProducts(), setIsReload(false)) : null}
    return (
        <div className='flex bg-slate-800'>
            <NavBar 
                deptId={deptId}
            />
            {isUpdated && <UpdateHandler 
                setUpdateProduct={setUpdateProduct} 
                updateProduct={updateProduct} 
                setIsUpdated={setIsUpdated} 
                setIsReload={setIsReload} 
                />
            }
            <div className='  min-h-screen text-white w-[100%] p-5 pt-25'>
                <div className='w-fit text-3xl m-auto my-4 '><i>Paid By installments in {departmentName}</i> </div>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />
                <input type="search"
                    onChange={e=>setSearchByCustomerName(e.target.value)}
                    placeholder="Search by customer name..."
                    className=" ml-[7%] bg-neutral-800 p-2 my-2 w-[85%]" 
                />
                <div className='flex w-fit  my-2 m-auto'>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500' >Title</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Amout</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Total</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Paid</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Steal</div>
                    <div className='bg-neutral-800 text-center w-[120px] rounded-full p-2 m-2  text-fuchsia-500 truncate hover:text-wrap'>Cudtomer name</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Time</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Date</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Update</div>
                    <div className='bg-neutral-800 text-center w-[80px] rounded-full p-2 m-2  text-fuchsia-500'>Cancel</div>
                </div>
                <div className=' w-fit  my-2 m-auto max-h-[70vh] overflow-y-auto p-3'>
                    {
                        productsSoldInInstallments.map((prod,index)=>(
                            searchByCustomerName !=="" ?
                            prod.deptid === deptId && prod["customerName"].includes(searchByCustomerName) &&
                            <div className='flex bg-neutral-800 w-fit my-2 m-auto rounded-full border-fuchsia-500 border-1' key={index}>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2 truncate hover:text-wrap' >{prod.title}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2 truncate hover:text-wrap'>{prod.soldAmount}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.total*prod.soldAmount}$</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.firstInstallment}$</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.total*prod.soldAmount-prod.firstInstallment}</div>
                                <div className='bg-slate-800 text-center w-[120px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.customerName}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.hours%12}:{prod.minets}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.day}/{prod.month}/{prod.year}</div>
                                <div onClick={()=>{setIsUpdated(true), setUpdateProduct(prod) } } className='bg-blue-600 text-center w-[80px] rounded-full p-2 m-2 hover:bg-blue-900' >Update</div> 
                                <div onClick={()=>cancelHandler(prod.id, prod.soldAmount, prod.prodid)} className='bg-red-600 text-center w-[80px] rounded-full p-2 m-2 cursor-pointer hover:bg-red-900'>CANCEL</div> 
                            </div>
                            :
                            prod.deptid === deptId &&
                            <div className='flex bg-neutral-800 w-fit my-2 m-auto rounded-full border-fuchsia-500 border-1' key={index}>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2 truncate hover:text-wrap' >{prod.title}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2 truncate hover:text-wrap'>{prod.soldAmount}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.total*prod.soldAmount}$</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.firstInstallment}$</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.total*prod.soldAmount-prod.firstInstallment}</div>
                                <div className='bg-slate-800 text-center w-[120px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.customerName}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.hours%12}:{prod.minets}</div>
                                <div className='bg-slate-800 text-center w-[80px] rounded-full p-2 m-2  truncate hover:text-wrap'>{prod.day}/{prod.month}/{prod.year}</div>
                                <div onClick={()=>{setIsUpdated(true), setUpdateProduct(prod) } } className='bg-blue-600 text-center w-[80px] rounded-full p-2 m-2 hover:bg-blue-900' >Update</div> 
                                <div onClick={()=>cancelHandler(prod.id, prod.soldAmount, prod.prodid)} className='bg-red-600 text-center w-[80px] rounded-full p-2 m-2 cursor-pointer hover:bg-red-900'>CANCEL</div> 
                            </div>
                        )
                        )
                    }
                </div>
            </div>
        </div>
    );
}