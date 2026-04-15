import React,{useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";
import {auth, db } from "../../config/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";


const AddMangerForm =(props)=>{
    // الفورم الخاص باضافة مدير جديد
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const managersCollectionRef = collection(db, "managers"); // المرجع الخاص بمجموعة المديرين في قاعدة البيانات
    const saveHandler =async ()=>{
        try{
            const lowerName = name.toLowerCase();
            await createUserWithEmailAndPassword(auth, lowerName, password);
            await addDoc(managersCollectionRef, {name:lowerName, password:password}); // بنضيف المدير الجديد لقاعدة البيانات
            props.setIsAddedMember(true); // بنعلم انو تم اضافة مدير جديد عشان نعمل تحديث لقائمة المديرين عشان يظهر المدير الجديد في القائمة
            props.setIsClicked(false);
        }catch(err){
            console.log(err);
        }
    }
    const cancelHandler =()=>{
        setName("");
        setPassword("");
        const inputs = document.querySelector("input");
        inputs.value="";
        props.setIsClicked(false);

    }
    const generatePassword =()=>{
        // دالة لتوليد كلمة مرور عشوائية
        let num =Math.floor(Math.random() * 10000)
        setPassword(name[0]?.toUpperCase()+name[1]?.toLocaleLowerCase() + "@MG" +num);
    }
    return (
        <div className=" w-[500px] p-3 m-auto mt-5 rounded-md text-white ">
            <input onChange={(e)=>setName(e.target.value)} placeholder="email..." type="email" className="w-full border-2 border-fuchsia-500 rounded-full p-1 bg-slate-500 focus:outline-none" />
            <div className="flex justify-between"> 
                <p onClick={generatePassword} className="bg-fuchsia-500 py-2  rounded-full w-[48%] mt-2 hover:bg-fuchsia-600 cursor-pointer text-center">Generate password</p>
                <p className="bg-slate-500 border-2 border-fuchsia-500 py-2 px-5 rounded-full w-[48%] mt-2 ">{password}</p>
            </div>
            <div className="flex justify-between w-[50%] "> 
                <p onClick={saveHandler} className="bg-green-500 py-2  rounded-full w-[48%] mt-2 hover:bg-green-600 cursor-pointer text-center">Save</p>
                <p onClick={cancelHandler} className="bg-red-500  py-2 px-5 rounded-full w-[48%] mt-2 hover:bg-red-600 cursor-pointer text-center">Cancel</p>
            </div>
            
        </div>
    );
}

const ListOfManagers =(props)=>{
    
    const deleteHandler = async(id)=>{
        // لازم نضيف التابع اللي بيحذف المدير من القاعدة
        try{
            const docRef = doc(db, "managers", id); // بنحدد المستند اللي بدنا نحذفه عن طريق رقم المدير
            await deleteDoc(docRef, id); // حذف المدير من قاعدة البيانات باستخدام رقم المدير
            
        }catch(err){
            console.log(err);
        }
    }
    const updateHandler =(id)=>{
        // هون وقت كبسنا على زر التعديل بدنا نعمل انو الفورم الخاص بالتعديل يطلع وبدنا نحدد اي مدير بدنا نعدله عشان نعرض معلوماته بالفورم ونعدل عليها وبعدين نحفظ التعديل او نلغي عملية التعديل
        props.setIsUpdate(true); // العملية بتقلك انو في تعديل 
        props.setUpdatedManger({name:props.name, password:props.password,id:id}) //  بتحفظ المعلومات الخاصة بالعنصر اللي عم نعدل عليه
    }
    return (

        <div className="flex justify-between w-fit m-auto mt-5 text-white text-center border-2 border-fuchsia-500 rounded-full">
            <p className=" w-[150px] py-1 px-6 m-1 font-bold rounded-full truncate hover:w-fit ">{props.name}</p>
            <p className=" w-[150px] py-1 px-6 m-1 font-bold rounded-full">{props.password}</p>
            <p className=" w-[150px] py-1 px-6 m-1 font-bold rounded-full">Dept-NO{props.item || 0}</p>
            <p className=" w-[150px] py-1 px-6 m-1 font-bold rounded-full">Emp-NO {props.item || 0}</p>
            <p onClick={()=>updateHandler(props.id)} className="bg-blue-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full cursor-pointer hover:bg-blue-600 ">update</p>
            <p onClick={()=>deleteHandler(props.id)} className="bg-red-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full cursor-pointer hover:bg-red-600">delete</p>
        </div>
    );
}

const UpdateMemberForm =(props)=>{
    // الفورم الخاص بتعديل معلومات مدير معين
    const [newPassword, setNewPassword] = useState(props.updatedManger.password); //كلمة المرور الجديدة اللي بدنا نولدها اذا بدنا او نخليها زي ما هي اذا ما بدنا نغيرها 
    const [newName, setNewName] = useState(props.updatedManger.name);// الاسم الجديد اللي بدنا نغيره اذا بدنا نغيره او نخليه زي ما هو اذا ما بدنا نغيره
    const docRef = doc(db,"managers",props.updatedManger.id)

    const saveHandler = async ()=>{

        // بدك تستخدم الupdatedManger في الAPI عشان تحدث المدير اللي بدك اياه
        // الحكي السابق مشان نعرف اي شخص تعدل عليه 
        // وبعد ما تخلص التحديث بدك ترجع الisUpdate لfalse و الupdatedManger لافتراضي عشان يختفي الفورم

        try{
            await updateDoc(docRef,{name:newName, password:newPassword})
        }catch(err){
            console.log(err)
        }

        props.setIsUpdate(false); // وقت عملنا حفظ للتعديل هي عملت انو حاليا مافي تعديل فبالتالي الفورم الخاص بالتعديل بيختفي
        props.setUpdatedManger({name:"", password:""}) // بما انو خلصنا تعديل بالتالي مخزن المعلومات تبع المدير لازم يفضى

    }
    const cancelHandler =()=>{

        props.setIsUpdate(false);
        props.setUpdatedManger({name:"", password:""})
    }

    const generatePassword =()=>{
        // دالة لتوليد كلمة مرور عشوائية
        let num =Math.floor(Math.random() * 10000)
        setNewPassword(newName[0]?.toUpperCase()+newName[1]?.toLocaleLowerCase() + "@MG" +num);
    }
    return (
        <div className="bg-fuchsia-500 w-fit p-1 m-auto mt-5 rounded-full text-white flex ">
            <input value={newName} onChange={(e)=>setNewName(e.target.value)}  className="w-fit border-2 border-fuchsia-500 rounded-full p-1 bg-slate-500 focus:outline-none" />
            <div className="p-1 w-fit border-2 border-fuchsia-500 rounded-full  bg-slate-500 flex">
                <p onClick={generatePassword} className="bg-fuchsia-500 p-1 rounded-full cursor-pointer">Generate Password</p>
                <p className="p-1 w-[100px] bg-neutral-800 rounded-full">{newPassword  }</p>
            </div>
            <p onClick={saveHandler} className="bg-green-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full cursor-pointer hover:bg-green-700">Save</p>
            <p onClick={cancelHandler} className="bg-red-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full cursor-pointer hover:bg-red-700">Cancel</p>
        </div>
    );
}

export default function Managers (){
    const [isClicked, setIsClicked] = useState(false); // مشان نعرف اذا انضغط على زر اضافة مدير جديد او لا واذا انضغط نعرض الفورم الخاص بالاضافة واذا انضغط مرة تانية نخفيه
    const [isUpdate,setIsUpdate]=useState(false); // استخدمناها مشان نعرف اذا طلبنا تعديل معلومات مدير 
    const [updatedManger,setUpdatedManger]=useState({name:"", password:"",id:''}); // مجرد مخزن للمعلومات 
    const [isAddedMember, setIsAddedMember] = useState(false); // مشان نعرف اذا تم اضافة مدير جديد او لا واذا تم اضافة مدير جديد نعمل تحديث لقائمة المديرين عشان يظهر المدير الجديد في القائمة
    const [isDeletedMember, setIsDeletedMember] = useState(false); // مشان نعرف اذا تم حذف مدير او لا واذا تم حذف مدير نعمل تحديث لقائمة المديرين عشان يختفي المدير اللي تم حذفه من القائمة
    const [managers, setManagers] = useState([]); // حالة لتخزين قائمة المديرين من قاعدة البيانات
    const managersCollectionRef = collection(db, "managers"); // المرجع الخاص بمجموعة المديرين في قاعدة البيانات

    const getManagers = async () => {
        try{
            const data= await getDocs(managersCollectionRef); // جلب بيانات المديرين من قاعدة البيانات
            const mangerList = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            setManagers(mangerList); // تخزين قائمة المديرين في الحالة
        }catch(err){
            console.log(err);
        }  
    }

    useEffect(() => {
        getManagers(); // جلب قائمة المديرين عند تحميل المكون
    }, []); // استخدام useEffect لجلب قائمة المديرين عند تحميل المكون

    // useEffect(() => {getManagers()}, [isAddedMember]); // استخدام useEffect لتحديث قائمة المديرين عند اضافة مدير جديد
    // useEffect(() => {getManagers()}, [isDeletedMember]); // استخدام useEffect لتحديث قائمة المديرين عند حذف مدير
    {isAddedMember && getManagers()}
    {isDeletedMember && getManagers()}
    return (
        <div className="w-full min-h-screen  bg-slate-800">
            <h1 className=" w-full text-4xl text-center  text-fuchsia-500 pt-20">Managers</h1>

            <div onClick={()=>setIsClicked(!isClicked)} className="w-40 h-10 bg-fuchsia-500 text-white flex items-center justify-center rounded-md m-auto mt-10 cursor-pointer">
                <FaPlus />
                <p>Add Manager</p>
            </div>


            {/* بتضيف الفورم اللي فبه حقول ادخال مدير جديد */}
            {isClicked ? <AddMangerForm setIsAddedMember={setIsAddedMember} setIsClicked={setIsClicked} />: null}

            {/* مجرد قائمة اللي بتعطي اسماء الحقول تبع */}
            <div className="flex justify-between w-fit m-auto mt-5 text-white text-center">
                <p className="bg-neutral-800 w-[150px] py-1 px-6 m-1 font-bold text-xl rounded-full">name</p>
                <p className="bg-neutral-800 w-[150px] py-1 px-6 m-1 font-bold text-xl rounded-full">password</p>
                <p className="bg-neutral-800 w-[150px] py-1 px-6 m-1 font-bold text-xl rounded-full">Dept-NO</p>
                <p className="bg-neutral-800 w-[150px] py-1 px-6 m-1 font-bold text-xl rounded-full">Emp-NO</p>
                <p className="bg-neutral-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full">update</p>
                <p className="bg-neutral-800 w-fit py-1 px-6 m-1 font-bold text-xl rounded-full">delete</p>
            </div>

            {/* بحال كان في تعديل بيظهر الفورم الي بدنا نكتب جواه التعديل */}
            {isUpdate ? <UpdateMemberForm 
                            updatedManger={updatedManger} 
                            setUpdatedManger={setUpdatedManger}
                            setIsUpdate={setIsUpdate}
                        />: null}

            {/* بتقوم بعرض العناصر او المدراء */}
            <div className="w-full h-[60vh]  mt-2 overflow-y-scroll ">
                {
                    managers?.map((item)=><ListOfManagers 
                                            setUpdatedManger={setUpdatedManger} 
                                            setIsUpdate={setIsUpdate} 
                                            setIsDeletedMember={setIsDeletedMember}
                                            name={item.name} 
                                            password={item.password}
                                            id={item.id}
                                            key={item.id} />)
                }
            </div>
        </div>
    );
}
