import React,{useState, useEffect} from "react";
import NavBar from "../../navBar/naveBar";
import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLocation } from "react-router-dom";
export default function Inventory(){
    const [searchTerm, setSearchTerm] = useState(""); // خاص بتخزين قيمة حقل البحث
    const [selectedYear, setSelectedYear] = useState("2026");
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [inventoryType, setInventoryType] = useState("installments"); //نوع الجرد من القائمة اللي عاليسار 
    const [productsSoldForInstallments, setProductsSoldForInstallments] = useState([]); // مخزن المبيعات بالتقسيط
    const [productsSoldForCash, setProductsSoldForCash] = useState([]); // مخزن المبيعت كاش
    const [inventoryForInstallment, setInventoryForInstallment ] = useState(0) // هاد بيحتوي مجموع قيمة البضاعة المباعة بالتقسيط
    const [paidInstallment, setPaidInstallment]=useState(0); // اللي مدفوع من التقسيط
    const [inventoryForCash, setInventoryForCash]= useState(0) // مجموع اللي مدفوع من عملية البيع كاش
    const [deptName,setDeptName]= useState(''); // بتحتوي اسم القسم
    const soldForCashCollectionRef = collection(db, "sold-in-cash");
    const soldForInstallmentsCollectionRef = collection(db, "sold-in-installments");
    const departmentsCollectionRef = collection(db,'departments');
    const location = useLocation();
    const deptId = location.state?.deptId || null;

    useEffect(() => {
        const getProductsSoldForInstallments = async () => {
            try{
                const data = await getDocs(soldForInstallmentsCollectionRef);
                const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                const sortedFilterdData = filteredData.sort((a,b)=> ( (parseInt(b.day) - parseInt(a.day)) || (parseInt(b.month) - parseInt(a.month)) || (parseInt(b.year) - parseInt(a.year)) ) )
                setProductsSoldForInstallments(sortedFilterdData);
                let total =0;
                let totalPaid=0;
                {
                    selectedMonth === 'All' ? 
                    filteredData.map((prod)=>(
                        prod.deptid === deptId && 
                            prod.year === parseInt(selectedYear) && 
                            (total += prod.soldAmount* prod.total),

                        prod.deptid === deptId && 
                            prod.year === parseInt(selectedYear) && 
                            (totalPaid += parseFloat(prod.firstInstallment))
                    )):
                    filteredData.map((prod)=>(
                        prod.deptid === deptId && 
                            prod.year === parseInt(selectedYear) && 
                            prod.month=== parseInt(selectedMonth) && 
                            (total += prod.soldAmount* prod.total),

                        prod.deptid === deptId && 
                            prod.year === parseInt(selectedYear) && 
                            prod.month=== parseInt(selectedMonth) && 
                            (totalPaid += parseFloat(prod.firstInstallment))
                    ))
                } // حسبنا القيمة اللي اجتنا من البيع بالتقصيت ومعرفة المتبقى
                setInventoryForInstallment(total)
                setPaidInstallment(totalPaid);
            }catch(err){
                console.error("Error fetching products sold for installments: ", err);
            }
        }; // خاص بجيب البضاعات اللي منباعة تقسيط

        const getProductsSoldForCash = async () => {
            try{
                const data = await getDocs(soldForCashCollectionRef);
                const filteredData =data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                const sortedFilterdData = filteredData.sort((a,b)=> ( (parseInt(b.day) - parseInt(a.day)) || (parseInt(b.month) - parseInt(a.month)) || (parseInt(b.year) - parseInt(a.year)) ) )
                setProductsSoldForCash(sortedFilterdData);
                let total=0;

                {
                    selectedMonth ==='All' ?
                    filteredData.map((prod)=>(
                        prod.deptid === deptId && 
                            prod.year=== parseInt(selectedYear) && 
                            (total += prod.soldAmount* prod.total)
                    )):
                    filteredData.map((prod)=>(
                        prod.deptid === deptId && 
                            prod.year=== parseInt(selectedYear) && 
                            prod.month === parseInt(selectedMonth) && 
                            (total += prod.soldAmount* prod.total)
                    ))
                } // حسبنا القيمة اللي اجتنا من البيع كاش
                setInventoryForCash(total)
            }catch(err){
                console.error("Error fetching products sold for cash: ", err);
            }
        }; // خاص بجيب البضاعات المنباعة كاش


        getProductsSoldForInstallments();
        getProductsSoldForCash();
    },[selectedMonth, selectedYear]) // جلب معلوات البيع كاش وتقسيط

    useEffect(()=>{
        const getDeptName = async ()=>{
            try{
                const data = await getDocs(departmentsCollectionRef);
                const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
                const findDeptName = filteredData.find((doc)=> doc.id === deptId)
                setDeptName(findDeptName.title);
            }catch(err){
                console.error(err)
            }
        }
        getDeptName();
    },[]) // جلب اسم القسم

    const getProductsSoldForInstallments = ()=>{
        return (
            <>
                {
                    selectedMonth === 'All'?  
                    productsSoldForInstallments.map((product) => (
                        product.deptid === deptId && product.year === parseInt(selectedYear) && 
                        <div key={product.id} className="flex flex-wrap justify-around gap-1 bg-neutral-800  rounded-xl my-2 text-white">
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.customerName}</p>
                            <p className="bg-slate-700 w-[60px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount-product.firstInstallment}$</p>
                            <p className="bg-slate-700 w-[90px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                            <p className="bg-slate-700 w-[100px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                        </div>
                    )):
                    productsSoldForInstallments.map((product) => (
                        product.deptid === deptId && product.year === parseInt(selectedYear) && product.month === parseInt(selectedMonth) &&
                        <div key={product.id} className="flex flex-wrap justify-around gap-1 bg-neutral-800  rounded-xl my-2 text-white">
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.customerName}</p>
                            <p className="bg-slate-700 w-[60px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount-product.firstInstallment}$</p>
                            <p className="bg-slate-700 w-[90px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                            <p className="bg-slate-700 w-[100px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                        </div>
                    ))
                }
            </>
        );
    } // بتعرض العناصر المنباعة بالتقسيط

    const getProductsSoldForCash =()=>{
        return(
            <>
                {
                    selectedMonth === "All" ?
                    productsSoldForCash.map((product)=>(
                        product.deptid === deptId && product.year === parseInt(selectedYear) &&
                            <div key={product.id} className="flex flex-wrap justify-around gap-2 bg-neutral-800  rounded-xl my-2 text-white">
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                            </div>
                    )):
                    productsSoldForCash.map((product)=>(
                        product.deptid === deptId && product.year === parseInt(selectedYear) && product.month === parseInt(selectedMonth) && 
                            <div key={product.id} className="flex flex-wrap justify-around gap-2 bg-neutral-800  rounded-xl my-2 text-white">
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                                <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                            </div>
                    ))
                }
            </>
        );
    } // بتعرض العناصر المنباعة بالكاش

    const getAllInventory = ()=>{
        return (
            <div>
                <div className="p-1 m-2.5 bg-neutral-800 text-white rounded-xl">
                    <div className=" p-1.5">
                        Total inventory for installments: {inventoryForInstallment}$
                    </div>
                    <div className=" p-1.5">
                        Paid installments: {paidInstallment }$
                    </div>
                    <div className=" p-1.5">
                        Stay: {inventoryForInstallment-paidInstallment}$
                    </div>
                    <div className="p-1.5">
                        Total inventory for cash: {inventoryForCash}$
                    </div>
                </div>
                <div className="p-1 m-2.5 bg-neutral-800 text-white rounded-xl">
                    <div className="p-1.5">
                        Total: {inventoryForCash+inventoryForInstallment}$
                    </div>
                    <div className="p-1.5">
                        Paid: {inventoryForCash+paidInstallment}$
                    </div>
                    <div className="p-1.5">
                        Stay: {inventoryForInstallment-paidInstallment}$
                    </div>
                </div>

            </div>
        );
    }

    const getSearchResult = ()=>{
        if(inventoryType === 'installments'){
            return (
                productsSoldForInstallments.map((product)=>(
                    (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ) &&
                        <div key={product.id} className="flex flex-wrap justify-around gap-1 bg-neutral-800  rounded-xl my-2 text-white">
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.customerName}</p>
                            <p className="bg-slate-700 w-[60px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                            <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount-product.firstInstallment}$</p>
                            <p className="bg-slate-700 w-[90px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                            <p className="bg-slate-700 w-[100px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                        </div>
                ))
            );
        }else if(inventoryType === 'cash'){
            return (
                productsSoldForCash.map((product)=>(
                    (product.title.toLowerCase().includes(searchTerm.toLowerCase())  ) &&
                        <div key={product.id} className="flex flex-wrap justify-around gap-2 bg-neutral-800  rounded-xl my-2 text-white">
                            <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.title}</p>
                            <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.total*product.soldAmount}$</p>
                            <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">{product.soldAmount}</p>
                            <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.day}/{product.month}/{product.year}</p>
                            <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap ">{product.empIdSoldBy}</p>
                        </div>
                ))
            );
        }
    }

    return (
        <div className='flex bg-slate-800'>
            <NavBar 
                deptId={deptId}
            />
            <div className='min-h-screen w-[100%] bg-slate-900 pb-20'>
                <div className='w-fit m-auto pt-25 pb-6 text-3xl text-white'>Inventory of Goods in {deptName}</div>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />

                <div className="flex justify-center gap-14">
                    <div className='w-[300px] h-[240px] flex flex-wrap '>
                        <div className="text-2xl text-center w-[300px] p-1 m-2 text-white">type of inventory</div>
                        <div onClick={()=>setInventoryType('installments')} 
                            className={`text-center ${inventoryType==='installments'? "bg-fuchsia-800": "bg-neutral-800"} w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer`}>Inventory of installment</div>
                        <div onClick={()=>setInventoryType('cash')} 
                            className={`text-center ${inventoryType==='cash'? "bg-fuchsia-800": "bg-neutral-800"} w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer`}>Inventory of Cash</div>
                        <div onClick={()=>setInventoryType('all')} 
                            className={`text-center ${inventoryType==='all'? "bg-fuchsia-800": "bg-neutral-800"} w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer`}>Inventory of All</div>
                    </div>

                    <div className="w-[650px]  min-h-[500px] rounded-2xl ">
                        {
                            inventoryType !== 'all' && 
                            <input 
                                type="text"
                                placeholder="search..."
                                className="w-full bg-neutral-800 p-2  rounded-xl text-white"
                                onChange={e=>setSearchTerm(e.target.value)}
                            />
                        }

                        <select 
                            className="w-full bg-neutral-800 p-2 my-1 rounded-xl text-white"
                            onChange={e=>setSelectedYear(e.target.value)}
                        >
                            <option>2026</option>
                            <option>2025</option>
                            <option>2024</option>
                            
                        </select>

                        <select 
                            className="w-full bg-neutral-800 p-2 mb-1 rounded-xl text-white"
                            onChange={e=>setSelectedMonth(e.target.value)}
                        >
                            <option>All</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                        </select>

                        {
                            inventoryType === 'installments' && 
                                <div className="flex flex-wrap justify-around gap-2 bg-neutral-800 mt-3 rounded-xl ">
                                    <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Title</p>
                                    <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Customr Name</p>
                                    <p className="bg-slate-700 w-[60px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Amount</p>
                                    <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Total</p>
                                    <p className="bg-slate-700 w-[80px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Stay</p>
                                    <p className="bg-slate-700 w-[90px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Date</p>
                                    <p className="bg-slate-700 w-[100px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400 mr-5">Sold By</p>
                                </div>
                        }
                        {
                            inventoryType === 'cash'&&
                                <div className="flex flex-wrap justify-around gap-2 bg-neutral-800 mt-3 rounded-xl ">
                                    <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Title</p>
                                    <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Total</p>
                                    <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Amount</p>
                                    <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400">Date</p>
                                    <p className="bg-slate-700 w-[110px] p-1 my-1 rounded-xl text-center truncate hover:text-wrap text-fuchsia-400 mr-5">Sold By</p>
                                </div>
                        }

                        <div className="bg-slate-800  w-full h-[300px] mt-1 rounded-xl overflow-y-auto">
                            {inventoryType === 'installments'&& searchTerm==="" && getProductsSoldForInstallments()}
                            {inventoryType === 'cash' && searchTerm==="" && getProductsSoldForCash()}
                            {inventoryType === 'all' && getAllInventory()}
                            {searchTerm !== "" && getSearchResult()}
                        </div>

                        <div className="w-full bg-neutral-800 p-2 mt-2.5 rounded-xl text-white">
                            {inventoryType === 'installments' && `Total inventory for installments: ${inventoryForInstallment }$`}
                            {inventoryType === 'installments' && <br/> }
                            {inventoryType === 'installments' && `paid installments: ${paidInstallment }$ - stay: ${inventoryForInstallment-paidInstallment}$`}
                            {inventoryType === 'cash' && `Total inventory for cash: ${inventoryForCash}$`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}