import { useState, useEffect, use } from "react";
import { db,auth } from "../../config/firebase";
import { getDocs, addDoc, updateDoc, doc, collection, deleteDoc } from "firebase/firestore";
import { FaPlus, FaTimes, } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NavBar from "../navBar/naveBar";


export default function ToDo() {
    const location = useLocation();
    const deptId = location.state?.deptId || null;
    const todoCollectionRef = collection(db, "todo");
    
    const [listType, setListType]=useState('not done')
    const [deptName, setDeptName] = useState('');
    const [isAddNewTodo, setIsAddNewTodo]=useState(false);
    const [todo, setTodo] = useState([]); // يحتوي على قائمة المهام في القسم الحالي
    const [isManagers, setIsManagers] = useState(false);
    const [newTodo, setNewTodo] = useState({
        addby: '',
        doneby:'',
        deptid:deptId,
        taskstate:'not done',
        tasktext:'',
        year:new Date().getFullYear(),
        month:new Date().getMonth() + 1,
        day:new Date().getDate(),
        hours:new Date().getHours(),
        minutes:new Date().getMinutes(),
    })

    useEffect(() => {
        const getDepartmentName = async () => {
            try{
                const data = await getDocs(collection(db, "departments"));
                const filteredDept = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                const department = filteredDept.find((dept) => dept.id === deptId);
                setDeptName(department ? department.title : 'loading..'); // تعيين اسم القسم أو تركه فارغًا إذا لم يتم العثور عليه
            }catch(err){
                console.log(err)
            }
        }
        getDepartmentName();
    },[]); // خاص بجلب اسم القسم

    const getTodo = async ()=>{
        try{
            const data = await getDocs(todoCollectionRef);
            const filterData= data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            const filteredDataByDept = filterData.filter((t)=>t.deptid === deptId);
            const sortedFilterdDataByDate = filteredDataByDept.sort((a,b)=> ( (parseInt(b.day) - parseInt(a.day)) || (parseInt(b.month) - parseInt(a.month)) || (parseInt(b.year) - parseInt(a.year)) ) )
            const sortedFilterdDataByTime = sortedFilterdDataByDate.sort((a,b)=> ( (parseInt(b.hours) - parseInt(a.hours)) || (parseInt(b.minutes) - parseInt(a.minutes)) ) )
            setTodo(sortedFilterdDataByTime)

        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getTodo();
    },[]) // خاص بجلب المهام 

    useEffect(()=>{
        const getManagers = async ()=>{
            try{
                const data = await getDocs(collection(db, "managers"));
                const filterData= data.docs.map((doc)=>({...doc.data(), id:doc.id}))
                filterData.map((m)=>{
                    m.name === auth.currentUser?.email && setIsManagers(true)
                })
            }catch(err){
                console.log(err)
            }
        }
        getManagers();
    },[]) // خاص بجلب بيانات المديرين لتحديد صلاحياتهم في المهام (مثل حذف المهام أو إلغاءها)

    const addToDoHandler = async () => {
        try{
            // await setNewTodo ({...newTodo, addby:auth.currentUser?.email })
            await addDoc(todoCollectionRef, newTodo);
            getTodo();
            setIsAddNewTodo(!isAddNewTodo)
        }catch(err){
            console.log(err)
        }
    } // اضافة مهمة جديدة 

    const DoneTaskHandler = async (id)=>{
        try{
            const docTodoRef = doc(db,'todo',id); 
            await updateDoc(docTodoRef,{doneby:auth.currentUser?.email, taskstate:'done'});
            getTodo();
        }catch(err){
            console.log(err)
        }
    }

    const cancelTaskHandler = async (id)=>{
        try{
            const docTodoRef = doc(db,'todo',id); 
            await updateDoc(docTodoRef,{doneby:auth.currentUser?.email, taskstate:'cancel'});
            getTodo();
        }catch(err){
            console.log(err)
        }
    }

    const deleteTaskHandler=async(id)=>{
        try{
            const docTodoRef = doc(db,'todo',id); 
            await deleteDoc(docTodoRef,id);
            getTodo();
        }catch(err){
            console.log(err)
        }
    }

    const getNotDoneTodo = ()=>{
        return (
            todo.map((task)=>(
                task.taskstate === 'not done'&&
                <div key={task.id} className="bg-neutral-800 truncate rounded-sm m-3 p-3 text-white  h-[70px] transition-[height] duration-800 delay-[800ms] hover:h-[200px]">
                    <div className=" flex justify-between">
                        <p className="font-bold text-xl">{task.addby}</p>
                        <div>
                            <p className="">{task.day}/{task.month}/{task.year} </p>
                            <p className="text-green-500">{task.hours}:{task.minutes} </p>
                        </div>
                    </div>
                    <p className="bg-slate-700 truncate hover:text-wrap py-3 px-6 my-3">- {task.tasktext}</p>
                    <div className=" flex gap-3 justify-end">
                        <div onClick={()=>DoneTaskHandler(task.id)} className="py-3 px-6 bg-green-400 rounded-2xl hover:bg-green-600 cursor-pointer">Done</div>
                        { isManagers && <div onClick={()=>cancelTaskHandler(task.id)} className="py-3 px-6 bg-red-400 rounded-2xl hover:bg-red-600 cursor-pointer">Cancel</div>}
                    </div>
                </div>
            ))
        )
    }

    const getDoneTodo =()=>{
        return (
            todo.map((task)=>(
                task.taskstate === 'done'&&
                <div key={task.id} className="bg-neutral-800 truncate rounded-sm m-3 p-3 text-white  h-[70px] transition-[height] duration-800 delay-[800ms] hover:h-[240px]">
                    <div className=" flex justify-between">
                        <p className="font-bold text-xl">Added By: {task.addby}</p>
                        
                        <div>
                            <p className="">{task.day}/{task.month}/{task.year} </p>
                            <p className="text-green-500">{task.hours}:{task.minutes} </p>
                        </div>
                    </div>
                    <p className="font-bold py-3 text">Done By: {task.doneby}</p>
                    <p className="truncate hover:text-wrap bg-slate-700 py-3 px-2 my-1">- {task.tasktext}</p>
                    <div className=" flex gap-3 justify-end">
                        <div onClick={()=>deleteTaskHandler(task.id)} className="py-3 px-6 bg-red-400 rounded-2xl hover:bg-red-600 cursor-pointer">Delete</div>
                    </div>
                </div>
            ))
        )
    }
    const getCanceledTodo =()=>{
        return (
            todo.map((task)=>(
                task.taskstate === 'cancel'&&
                <div key={task.id} className="bg-neutral-800 truncate rounded-sm m-3 p-3 text-white  h-[70px] transition-[height] duration-800 delay-[800ms] hover:h-[200px]">
                    <div className=" flex justify-between">
                        <p className="font-bold text-xl">{task.addby}</p>
                        <div>
                            <p className="">{task.day}/{task.month}/{task.year} </p>
                            <p className="text-green-500">{task.hours}:{task.minutes} </p>
                        </div>
                    </div>
                    <p className="bg-slate-700 truncate hover:text-wrap py-3 px-6 my-3">- {task.tasktext}</p>
                    <div className=" flex gap-3 justify-end">
                        <div onClick={()=>deleteTaskHandler(task.id)} className="py-3 px-6 bg-red-400 rounded-2xl hover:bg-red-600 cursor-pointer">Delete</div>
                    </div>
                </div>
            ))
        )
    }
    
    return (
        <div className='flex bg-slate-800' >
            <NavBar 
                deptId={deptId}
            />
            <div className='min-h-screen w-[100%] bg-slate-900 pb-20 '>
                <div className='w-fit m-auto pt-25 pb-6 text-3xl text-gray-300'>To Do List in {deptName} </div>
                <hr className='border-1 border-fuchsia-500 w-[80%] m-auto mb-5' />
                <div className="flex justify-center gap-14">

                    {
                        isManagers &&
                        <div className='w-[300px] max-h-[240px] flex flex-wrap '>
                            <div className="text-4xl text-center w-[300px] p-1 m-2 text-white">List Type</div>
                            <div 
                                onClick={()=>setListType('not done')}
                                className={` ${listType==='not done' ? "bg-fuchsia-800": "bg-neutral-800"} text-center  w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer text-xl h-fit `}
                                >Not Done
                            </div>
                                <div
                                    onClick={()=>setListType('done')}
                                    className={` ${listType==='done' ? "bg-fuchsia-800": "bg-neutral-800"} text-center  w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer text-xl `}
                                    >Done
                                </div>
                                <div
                                    onClick={()=>setListType('canceled')}
                                    className={` ${listType==='canceled' ? "bg-fuchsia-800": "bg-neutral-800"} text-center  w-[300px] p-3 m-1 text-white hover:bg-fuchsia-800  rounded-full cursor-pointer text-xl `}
                                    >Canceled
                                </div>
                            
                        </div>
                    }

                    <div className="w-[650px]  min-h-[500px] rounded-2xl  ">
                        
                        {
                            listType==='not done' && isManagers &&
                            <div onClick={()=>setIsAddNewTodo(!isAddNewTodo)} className={`flex gap-2 ${isAddNewTodo? "bg-red-500 hover:bg-red-800":"bg-fuchsia-500 hover:bg-fuchsia-800"} py-4 px-6 mb-2 w-full justify-center m-auto rounded-2xl cursor-pointer text-xl font-bold`}> 
                                {!isAddNewTodo && <><FaPlus className="mt-0.5"/><p >Add Task</p></>}
                                {isAddNewTodo && <><FaTimes className="mt-0.5"/><p >Cancel add Task</p></>}
                            </div>
                        }

                        {
                            isAddNewTodo && listType==='not done' &&
                            <div className="flex">
                                <input type="text"
                                    className="w-[90%] bg-neutral-800 p-2 mt-1 mb-3  rounded-l-xl text-white outline-none"
                                    placeholder="Add Text for New Task..."
                                    onChange={
                                        (e)=>setNewTodo({...newTodo, 
                                            tasktext:e.target.value,
                                            addby:auth.currentUser?.email ,
                                            year:new Date().getFullYear(),
                                            month:new Date().getMonth() + 1,
                                            day:new Date().getDate(),
                                            hours:new Date().getHours(),
                                            minutes:new Date().getMinutes(),})
                                    }
                                />
                                <p 
                                    onClick={addToDoHandler}
                                    className="w-[10%] bg-fuchsia-800 p-2 mt-1 mb-3 rounded-r-xl text-white cursor-pointer hover:bg-fuchsia-500"
                                    >Add
                                </p>
                            </div>
                        }

                        <div className="bg-slate-800  w-full h-[375px] mt-1 rounded-sm overflow-y-auto">
                            {listType==='not done'&& getNotDoneTodo()}
                            {listType==='done' && getDoneTodo()}
                            {listType==='canceled' && getCanceledTodo()}
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    )
}