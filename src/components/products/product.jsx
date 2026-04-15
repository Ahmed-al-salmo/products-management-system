import React,{useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import NavBar from "../navBar/naveBar";
import { db, auth } from "../../config/firebase";
import { getDocs, addDoc, updateDoc, doc, collection, deleteDoc } from "firebase/firestore";



//===============================================================
// ============ بس يخلص المشروع كليا لازم احسن طريقة جيب المعطيات من القاعدة خصوصا اللي فيهون شروط
//===================================================================

// الفورم الخاص بعملية ادخال منتج جديد او تعديل منتج موجود بالفعل
const FormEnterNewProduct =(props)=>{
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: 0,
        discount: 0,
        total: 0,
        amount: 0,
        category: "",
        deptid:'',

    });// بيحفظ محتويات العنصر الجديد المدخلة 

    const createProductHandler = async ()=>{
        const productCollection = collection(db,'products')
        try{
            await addDoc(productCollection,
                {...newProduct,
                    total:newProduct.price-newProduct.discount,
                    deptid:props.deptId
                }
            );// بيحفظ عملية الادخال جوا القاعدة
    
            const inputs = document.querySelectorAll("input");
            inputs[0].value="";
            inputs[1].value=0;
            inputs[2].value=0;
            inputs[3].value="";
            inputs[4].value='';
            
            setNewProduct({
                title: "",
                price: 0,
                discount: 0,
                total: 0,
                amount: 0,
                category: "",
            }) // بعد الادخال منفضي الحالة لاني هي مجرد مخزن مؤقت للعنصر المضاف
            props.setIsReload(true); // هي منستخدما مشان نعرف اذا لازم نعمل اعادو تحميل لاني التعديل بالقاعدة مابيظهر غير بعادة تحميل
        }catch(err){
            console.log(err)
        }
    }

    const deleteAllHandler = async ()=>{
        try{
            const data = await getDocs(collection(db,'products'));
            const filteredProducts = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            
            for(const item of filteredProducts){
                if(item.deptid === props.deptId){ // لمعرفوة اذا العنصر بينتمي للقسم
                    await deleteDoc(doc(db,"products",item.id)) // عملية حذف عنصر من قاعدة البيانات حسب رقمو 
                }
            }
            props.setIsReload(true);// هي منستخدما مشان نعرف اذا لازم نعمل اعادو تحميل لاني التعديل بالقاعدة مابيظهر غير بعادة تحميل
            
        }catch(err){
            console.log(err)
        }
    }

    const saveUpdateProductHandler = async()=>{
        try{
            const docRef = doc(db,'products',props.updatedProduct.id);
            await updateDoc(docRef,props.updatedProduct)
            props.setIsReload(true)  // هي منستخدما مشان نعرف اذا لازم نعمل اعادو تحميل لاني التعديل بالقاعدة مابيظهر غير بعادة تحميل
            props.setIsUpdateMode(false);// هي عم نستخدما لحتى نستبدل زر الانشاء في زرين حفظ التعديل والغاء عملية التعديل
            props.setUpdatedProduct({
                id: "",
                title: "",
                price: 0,
                discount: 0,
                total: 0,
                amount: 0,
                category: "",
            })// تغريغ الحالة لانها عبارة عن مخزن لقيم العنصر المراد تعديله
        }catch(err){
            console.log(err)
        }
        
    }

    // خاص بعملية الغاء التعديل 
    const cancelUpdateProductHandler =()=>{
        props.setIsUpdateMode(false);// هي عم نستخدما لحتى نستبدل زر الانشاء في زرين حفظ التعديل والغاء عملية التعديل
        props.setUpdatedProduct({
            id: "",
            title: "",
            price: 0,
            discount: 0,
            total: 0,
            amount: 0,
            category: "",
        })// تغريغ الحالة لانها عبارة عن مخزن لقيم العنصر المراد تعديله
    }
    const titleBUttonHandler =()=>{
        props.setSearchBy('title');
        props.setOnSearch(true);
    }
    const categoryButtonHandler =()=>{
        props.setSearchBy('category');
        props.setOnSearch(true);
    }
    return (
        <div className=" w-[1000px]  m-auto ">
            <form >
                <input 
                    onChange={props.isUpdateMode ?
                        (e)=>props.setUpdatedProduct({...props.updatedProduct,title:e.target.value}):
                        (e)=>setNewProduct({...newProduct,title:e.target.value})
                    } 
                    className="bg-neutral-800 p-2 m-2 w-[97%]" 
                    type="text" 
                    placeholder={props.updatedProduct.title || "Title"} 
                />

                <div className="flex flex-wrap" >
                    <input 
                        onChange={
                            props.isUpdateMode ?
                            (e)=>props.setUpdatedProduct({...props.updatedProduct,amount:parseInt(e.target.value) }):
                            (e)=>setNewProduct({...newProduct,amount:parseInt(e.target.value) })
                        } 
                        className="bg-neutral-800 p-2 m-2 w-[30%]" 
                        placeholder={props.updatedProduct.amount || "Product amount" }  
                    />
                    <input 
                        onChange={ props.isUpdateMode ?
                            (e)=>props.setUpdatedProduct({...props.updatedProduct,price:parseFloat(e.target.value) }):
                            (e)=>setNewProduct({...newProduct,price:parseFloat(e.target.value) })
                        } 
                        className="bg-neutral-800 p-2 m-2 w-[20%] "
                        placeholder={props.updatedProduct.price || "Price"} type="" 
                    />
                    <input 
                        onChange={
                            props.isUpdateMode ?
                            (e)=>props.setUpdatedProduct({...props.updatedProduct,discount:parseFloat(e.target.value) }):
                            (e)=>setNewProduct({...newProduct,discount:parseFloat(e.target.value) }) 
                        } 
                        className="bg-neutral-800 p-2 m-2 w-[20%]"  
                        placeholder={props.updatedProduct.discount || "Discount"} 
                    />
                    <div id="total" className="inline-block w-fit bg-red-800 p-2 m-2">total :{ props.isUpdateMode ? parseFloat(props.updatedProduct.price) - parseFloat(props.updatedProduct.discount): newProduct.price - newProduct.discount}</div>
                </div>
                
                <input 
                    onChange={
                        props.isUpdateMode ?
                        (e)=>props.setUpdatedProduct({...props.updatedProduct,category:e.target.value}):
                        (e)=>setNewProduct({...newProduct,category:e.target.value})
                    } 
                    className="bg-neutral-800 p-2 m-2 w-[97%]" 
                    placeholder={props.updatedProduct.category || "Category"}
                />

                {
                    props.isUpdateMode ?
                        <div className="w-[95%]  flex justify-around p-1">
                            <p onClick={saveUpdateProductHandler} className="bg-blue-800 rounded-full cursor-pointer w-[40%] text-center py-2 hover:bg-blue-600">Save Update</p>
                            <p onClick={cancelUpdateProductHandler} className="bg-red-800 rounded-full cursor-pointer w-[40%] text-center py-2 hover:bg-red-600">Cancel</p>
                        </div>:
                        <div onClick={createProductHandler} className="bg-fuchsia-500 p-2 m-2 w-[97%] rounded-full text-center cursor-pointer hover:bg-fuchsia-600" > Create </div>
                }
                {
                    props.onSearch && <input onChange={(e)=>(props.setSearchValue(e.target.value), e.target.value===""&& props.setOnSearch(false) && props.setSearchBy(''))} className="bg-neutral-800 p-2 m-2 w-[97%]" type="text" placeholder="Search" />
                }
                <div className="flex justify-evenly flex-wrap">
                    <div onClick={titleBUttonHandler} className="bg-fuchsia-500 w-[400px] rounded-full text-center py-[10px] font-bold my-2 cursor-pointer hover:bg-fuchsia-600">Search by Title</div>
                    <div onClick={categoryButtonHandler} className="bg-fuchsia-500 w-[400px] rounded-full text-center py-[10px] font-bold my-2 cursor-pointer hover:bg-fuchsia-600">Search by Category</div>
                </div>
                <div onClick={deleteAllHandler}  className="bg-red-800 p-2 m-2 w-[97%] rounded-full text-center cursor-pointer hover:bg-red-600" > Delete All Products </div>
            </form>
        </div>
    );
}


// الفورم الخاص بعملية البيع سواء كانت بيع كاش او بيع بالتقسيط
const SaleHandler =(props)=>{
    
    const [product , setProduct] = useState({}); // بتحتوي على بيانات المبيع اللي ردنا نبيعو ومنجيبو مشان ناخد منو معلومات 
    // هدول مشان نعرف اي حقول لازم نعرضون حسب عملية البيع 
    const [isCash, setIsCash] = useState(false); // معرفة اذا المبيع صاير كاش
    const [saleDataInCash, setSaleDataInCash] = useState({
        title:'',
        price:"",
        total:'',
        soldAmount:0,
        category:'',
        deptid:'',
        empIdSoldBy:'',
        year:new Date().getFullYear(),
        month:new Date().getMonth() +1,
        day:new Date().getDate(),
        hours:new Date().getHours(),
        minets:new Date().getMinutes()
    });// معلومات المبيع بالكاش اللي لازم نستخدمها في عملية حفظ البيع وتعديل كمية المنتج الموجود في المخزن


    const [isInstallments , setIsInstallments] = useState(false); // معرفة اذا المبيع صاير تقسيط
    const [saleDataInInstallments, setSaleDataInInstallments] = useState({
        title:'',
        price:"",
        total:'',
        soldAmount:0,
        category:'',
        deptid:'',
        empIdSoldBy:'',
        firstInstallment: 0,
        customerName: "",
        previousAmount:"",
        prodid:'',
        year:new Date().getFullYear(),
        month:new Date().getMonth() +1,
        day:new Date().getDate(),
        hours:new Date().getHours(),
        minets:new Date().getMinutes()
    })

    useEffect(()=>{
        isCash && setSaleDataInCash({
            ...saleDataInCash,
            title: product.title,
            price: product.price,
            total: product.total,
            category: product.category,
            deptid: product.deptid,
            empIdSoldBy:auth.currentUser?.email,
            previousAmount:product.amount,
        });

        isInstallments && setSaleDataInInstallments({
            ...saleDataInInstallments,
            title: product.title,
            price: product.price,
            total: product.total,
            category: product.category,
            deptid: product.deptid,
            prodid:product.id,
            empIdSoldBy:auth.currentUser?.email,
            previousAmount:product.amount,
            firstInstallment: 0,
            customerName: "",
        })
    },[isCash,isInstallments])

    

    useEffect(()=>{
        const getProductss=async ()=>{
            try{
                const productCollection =collection(db,"products");
                const data= await getDocs(productCollection);
                const filteredProducts = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
                filteredProducts.map((prod)=>{
                    prod.id === props.saleProductID && setProduct({...prod})
                })
            }catch(err){
                console.log(err)
            }
        }
        getProductss();
    },[])

    

    // الفورم الخاص بادخال بيانات بيع منتج مباع بالكاش
    const saleInCashHandler =()=>{
        return (
            <div className="bg-white w-fit m-auto p-2 rounded-xl ">
                <label>Amount</label>
                <input onChange={(e)=>setSaleDataInCash({...saleDataInCash,soldAmount:e.target.value,total:product.total*e.target.value})} type="text" className="m-1 bg-[#AAA] border-2 border-black focus:outline-none rounded-sm p-1" /><br/> 
            </div>
        );
    }
    // الفورم الخاص بادخال بيانات بيع منتج بالتقسيط
    const saleInInstallmentsHandler =()=>{
        return(
            <div className="bg-white w-fit m-auto p-2 rounded-xl mb-5">
                <input onChange={(e)=>setSaleDataInInstallments({...saleDataInInstallments,soldAmount:e.target.value})} placeholder="Amount" type="text" className="m-1 bg-[#AAA] border-2 border-black focus:outline-none rounded-sm p-1" /><br/> 
                <input onChange={(e)=>setSaleDataInInstallments({...saleDataInInstallments,firstInstallment:e.target.value})} placeholder="first Installment" type="text" className="m-1 bg-[#AAA] border-2 border-black focus:outline-none rounded-sm p-1" /><br/> 
                <input onChange={(e)=>setSaleDataInInstallments({...saleDataInInstallments,customerName:e.target.value})} placeholder="Name of Customer" type="text" className="m-1 bg-[#AAA] border-2 border-black focus:outline-none rounded-sm p-1" /><br/> 
                <div>stay money {product.price*saleDataInInstallments.soldAmount} - {product.total*saleDataInInstallments.soldAmount} $</div>
            </div>
        );
    }
    // بحال الضغط على الخطا اللي بالزاوية يلغي عمليات البيع
    const closeHandler =()=>{
        props.setIsSale(false);
        props.setSaleProductID("")
        setIsCash(false);
        setIsInstallments(false);
        // setSaleAmountInCash(0);
        setSaleDataInInstallments({
            amount: 0,
            firstInstallment: 0,
            customerName: "",
        })
    }

    const cancelSaleHandler =()=>{
        props.setIsSale(false);
        props.setSaleProductID("")
        setIsCash(false);
        setIsInstallments(false);
        // setSaleAmountInCash(0);
        setSaleDataInInstallments({
            title:'',
            price:"",
            total:'',
            soldAmount:0,
            category:'',
            deptid:'',
            prodid:'',
            empIdSoldBy:'',
            firstInstallment: 0,
            customerName: "",
            year:new Date().getFullYear(),
            month:new Date().getMonth() +1,
            day:new Date().getDate(),
            hours:new Date().getHours(),
            minets:new Date().getMinutes()
        })
        setSaleDataInCash({
            title:'',
            price:"",
            total:'',
            soldAmount:0,
            category:'',
            deptid:'',
            empIdSoldBy:'',
            year:new Date().getFullYear(),
            month:new Date().getMonth() +1,
            day:new Date().getDate(),
            hours:new Date().getHours(),
            minets:new Date().getMinutes()
        })
    }

    const saveSaleHandler = async()=>{
        if(isCash){
            // لازم نضيف التابع اللي بيحفظ عملية البيع بالكاش في القاعدة وبنفس الوقت بنعدل كمية المنتج الموجود في المخزن حسب الكمية المباعة
            try{
                
                const salesCollection = collection(db,'sold-in-cash');
                await addDoc(salesCollection,saleDataInCash);
                const docRef = doc(db,'products',product.id);
                await updateDoc(docRef,{amount: parseInt(product.amount) - parseInt(saleDataInCash.soldAmount) }) // تعديل كمية المنتج الموجود في المخزن حسب الكمية المباعة
            }catch(err){
                console.log(err)
            }
        }
        if(isInstallments){
            // لازم نضيف التابع اللي بيحفظ عملية البيع بالتقسيط في القاعدة وبنفس الوقت بنعدل كمية المنتج الموجود في المخزن حسب الكمية المباعة
            
            try{
                const salesCollection = collection(db,'sold-in-installments');
                await addDoc(salesCollection,saleDataInInstallments);
                const docRef = doc(db,'products',product.id);
                await updateDoc(docRef,{amount: parseInt(product.amount) - parseInt(saleDataInInstallments.soldAmount) }) // تعديل كمية المنتج الموجود في المخزن حسب الكمية المباعة
            }catch(err){
                console.log(err)
            }
        }
        props.setIsReload(true)
        cancelSaleHandler();
    }

    return (
        
            <div className=" fixed z-[2] top-[50%] left-[50%] translate-[-50%]  bg-[#AAA] w-[600px]  rounded-4xl text-mono" >
                <FaTimes onClick={closeHandler} className="m-4 text-xl hover:text-red-700 cursor-pointer" />
                <div className="text-center ">
                    <h1 className="text-2xl">sale {product.title}</h1>
                    <div onClick={()=>{setIsCash(!isCash), setSaleDataInInstallments({amount:0,firstInstallment:0,customerName:"" }), isInstallments? setIsInstallments(false): null}} className="bg-blue-800 text-white w-fit px-6 py-2 m-auto my-5 rounded-2xl hover:bg-blue-700 cursor-pointer" >Sale in Cash</div>
                    {isCash && saleInCashHandler()}
                    <div onClick={()=>{setIsInstallments(!isInstallments) , isCash? setIsCash(false) : null} } className="bg-blue-800 text-white w-fit px-6 py-2 m-auto my-5 rounded-2xl hover:bg-blue-700 cursor-pointer" >Sale in installments</div>
                    {isInstallments && saleInInstallmentsHandler()}
                </div>
                <div className="ml-5 flex text-white mb-3"> 
                    <div onClick={saveSaleHandler} className="bg-green-700 w-fit px-5 py-2 m-2 rounded-lg hover:bg-green-500 cursor-pointer">Save</div>
                    <div onClick={cancelSaleHandler} className="bg-red-500 w-fit px-5 py-2 m-2 rounded-lg hover:bg-red-800 cursor-pointer">Cancel</div>
                </div>
            </div>
        
    );
}


// التابع الخاص بعملية عرض قائمة المنتجات
const ProductsList =(props)=>{
    const deleteHandler = async()=>{
        try{
            const docRef = doc(db,'products',props.prod.id);
            await deleteDoc(docRef,props.prod.id) // حذف عنصر من القاعدة
            props.setIsReload(true) // هي منستخدما مشان نعرف اذا لازم نعمل اعادو تحميل لاني التعديل بالقاعدة مابيظهر غير بعادة تحميل
        }catch(err){
            console.log(err)
        }
    }
    const updateHandler =()=>{
        props.setIsUpdateMode(true); // تعني انو نحن بحالة تعديل ولازم نغير زر الانشاء لزرين الحفظ والالغاء

        props.setUpdatedProduct({
            id: props.prod.id,
            title: props.prod.title,
            price: props.prod.price,
            discount: props.prod.discount,
            total: props.prod.total,
            amount: props.prod.amount,
            category: props.prod.category,
        }) // قيم العنصر اللي بدنا نعدلو

    }
    // const saleHandler =()=>{
    //     return <div className="relative top-0 left-0  bg-red-500 bg-opacity-50 flex items-center justify-center w-[200px] h-[200px]" >
    //         <h1>sale</h1>
    //     </div>
    // }
    return ( 
        <div className=" w-fit flex gap-4 justify-between mx-3 my-2 text-center gap-1 border-2 border-neutral-600 rounded-full p-1">
            <div className=" rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full hover:text-wrap">{props.prod.title}</div>
            <div className="  rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full">{props.prod.price}$</div>
            <div className="  rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full">{props.prod.discount}$</div>
            <div className="  rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full">{props.prod.total}$</div>
            <div className="  rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full">{props.prod.amount} </div>
            <div className="  rounded-full w-[100px] truncate py-1 px-2 border-2 border-fuchsia-800 rounded-full hover:text-wrap">{props.prod.category} </div>
            <div onClick={updateHandler} className=" bg-blue-600 rounded-full w-fit truncate py-1 px-2 hover:bg-blue-500 cursor-pointer">UPDATE</div>
            <div onClick={deleteHandler} className=" bg-red-600 rounded-full w-fit truncate py-1 px-2 hover:bg-red-500 cursor-pointer">DELETE</div>
            <div onClick={()=>{props.setIsSale(true), props.setSaleProductID(props.prod.id)}} className=" bg-green-600 rounded-full w-fit truncate py-1 px-2 hover:bg-green-500 cursor-pointer">Sale</div>
        </div>
    );
}

export default function Product(){
    // هدول استخدمناهون عشان نجيب ال id تبع القسم من ال location state لحتى نعرض المنتجات الخاصة بهالقسم
    const location = useLocation();
    const deptId = location.state?.deptId || null;

    const deptCollectionRef = collection(db,'departments'); // خاص بعمليات الfirebase
    const productCollectionRef = collection(db,'products');

    const [isUpdateMode, setIsUpdateMode] = useState(false); // هدول مشان نعرف اذا المنتج في مود التعديل
    const [updatedProduct, setUpdatedProduct] = useState({
        id: "",
        title: "",
        price: 0,
        discount: 0,
        total: 0,
        amount: 0,
        category: "",
    })// مشان ناخد مكونات المنتج ونبعتا تنحط داخل الفورم بحالة التعديل يني هي المخزن الخاص بعملية التعديل اي المخزن لقيم العنصر اللي بدنا نعدلو
    const [isSale, setIsSale] = useState(false);// هدول مشان نعرف اذا عم نعمل عملية بيع لمنتج معين

    // هدول مشان نبعت الرقم الخاص بالمنتج اللي بدنا نعمل عليه عملية بيع للفورم الخاص بالبيع لحتى نعرض معلوماته داخل الفورم
    // لازم نكبر الكونتاينر بحيث يحتوي على محتويات المنتج بما يتوافق مع الفورم
    const [saleProductID, setSaleProductID] = useState("")

    const [isReload, setIsReload] = useState(false) // متحول منحط فيه اذا لازم نعمل اعادة تحميل 
    const [deptName , setDeptName]= useState(''); // خاصة بعرض اسم القسم 
    const [products, setProducts]=useState([]); // بتحتوي على المنتجات اللي بقاعدة البيانات
    const [onSearch, setOnSearch] = useState(false); // مشان نعرف اذا عم نعمل عملية بحث لحتى نعرض الفورم الخاص بالبحث
    const [searchValue, setSearchValue] = useState(''); // مخزن لقيمة البحث اللي بدنا نعملها لحتى نستخدمها في عملية البحث
    const [searchBy, setSearchBy] = useState(''); // مشان نعرف اذا بدنا نبحث عن طريق العنوان ولا عن طريق القسم لحتى نستخدمها في عملية البحث


    const getProducts = async ()=>{
        try{
            const data = await getDocs(productCollectionRef);
            const filteredProducts = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            setProducts(filteredProducts);
        }catch(err){
            console.log(err)
        }
    } // تابع منستخدم لنجيب البضائع من القاعدة

    useEffect(()=>{
        const getDeptName =async ()=>{
            try{
                const data = await getDocs(deptCollectionRef);
                const filteredDept = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
                filteredDept.map((doc)=>{
                    doc.id === deptId ? setDeptName(doc.title):null // عم نقارن رقم القسم من القاعدة مع رقم القسم اللي جاي برا
                })
            }catch(err){
                console.log(err)
            }
        } // التابع مشان نجيب اسم القسم 
        getDeptName();
        getProducts(); 
    },[])


    {isReload ? (getProducts(),setIsReload(false)) : null} // في حال كان لازم نعمل اعادة تحميل بيعمل وبيعكس القرار مشان ماندخل بحلقة لا نهائية
    
    return (
        <div className="flex">
            <NavBar 
                deptId={deptId}
            />
            {/* هي مشان نحط الفورم الخاص بعملية البيع وبيظهر بحال ضغطنا على زر البيع الخاص بكل منتج  */}
            {isSale===true? 
                <SaleHandler 
                    setIsSale={setIsSale} 
                    saleProductID={saleProductID}
                    setSaleProductID={setSaleProductID} 
                    setIsReload={setIsReload}
                />:null
            }

            <div className="min-h-screen w-full bg-slate-800 text-white pb-10">
                <div className='w-fit m-auto pt-20 pb-5 text-4xl '>PRODUCT MANAGEMENT STSTEM {deptName}</div>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />
                <FormEnterNewProduct 
                    deptId={deptId} 
                    isUpdateMode={isUpdateMode} 
                    setIsUpdateMode={setIsUpdateMode} 
                    updatedProduct={updatedProduct} 
                    setUpdatedProduct={setUpdatedProduct}
                    setIsReload={setIsReload}
                    onSearch={onSearch}
                    setOnSearch={setOnSearch}
                    setSearchBy={setSearchBy}
                    setSearchValue={setSearchValue}
                />

                <div className=" m-auto w-fit pt-[20px]">
                    <div className="flex justify-between mx-4 my-2 text-center gap-4">
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">TITLE</div>
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">PRICE</div>
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">DISCOUNT</div>
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">TOTAL</div>
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">Amount</div>
                        <div className=" bg-neutral-800 rounded-full w-[100px] truncate py-1 px-2">CATEGORY</div>
                        <div className=" bg-neutral-800 rounded-full w-fit truncate py-1 px-2">UPDATE</div>
                        <div className=" bg-neutral-800 rounded-full w-fit truncate py-1 px-2">DELETE</div>
                        <div className=" bg-neutral-800 rounded-full w-fit truncate py-1 px-2">Sale</div>
                    </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto m-auto w-fit pb-10 ">
                    {
                        onSearch ? // اختبار اذا نحن بحالة بحث
                            products.map((prod,index)=>
                                prod.deptid === deptId && prod[searchBy].toLowerCase().includes(searchValue.toLowerCase())&&  // شرط بجيب العنصر اللي بينتمي للقسم واللي بيحتوي على قيمة البحث في العنوان او القسم حسب نوع البحث
                                <ProductsList 
                                    saleProductID={saleProductID} 
                                    setSaleProductID={setSaleProductID} 
                                    setIsSale={setIsSale} isSale={isSale} 
                                    setIsUpdateMode={setIsUpdateMode} 
                                    setUpdatedProduct={setUpdatedProduct} 
                                    isReload={isReload}
                                    setIsReload={setIsReload}
                                    prod={prod} 
                                    key={index} 
                                />)
                            :
                            products.map((prod,index)=>
                                prod.deptid === deptId &&
                                <ProductsList 
                                    saleProductID={saleProductID} 
                                    setSaleProductID={setSaleProductID} 
                                    setIsSale={setIsSale} isSale={isSale} 
                                    setIsUpdateMode={setIsUpdateMode} 
                                    setUpdatedProduct={setUpdatedProduct} 
                                    isReload={isReload}
                                    setIsReload={setIsReload}
                                    prod={prod} 
                                    key={index}
                                    
                                />)
                    }
                </div>
            </div>
        </div>
    );
}