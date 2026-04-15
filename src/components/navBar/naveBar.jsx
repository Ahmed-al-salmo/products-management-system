import React,{useState} from "react";
import { Link } from "react-router-dom";
import { FaHome,FaTimes, 
    FaList, 
    FaCoins, 
    FaPeopleCarry, 
    FaTasks } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";



export default function NavBar(props) {
    const navigate = useNavigate();
    const location = useLocation()
    const [buttonActive, setButtonActive] = useState(location.pathname);
    const hideHandler =()=>{
        document.getElementById('sidebar').style.display='none'
        document.getElementById('listSidbar').style.display='block'

    }
    const appearHandler =()=>{
        document.getElementById('listSidbar').style.display='none'
        document.getElementById('sidebar').style.display='block'

    }
    const soldMoveHandler =()=>{
        navigate('/products/sold',{state:{deptId:props.deptId}})
    }
    const debtsMoveHandler =()=>{
        navigate('/products/debts',{state:{deptId:props.deptId}})
    }
    const InventoryMoveHandler =()=>{
        navigate('/products/inventory',{state:{deptId:props.deptId}})
    }
    const homeMoveHandler =  ()=>{
        location.pathname !== '/departments/products' ? 
        navigate('/departments/products',{state:{deptId:props.deptId}}):null

    }
    const employeesMoveHandler =()=>{
        navigate('/products/employees',{state:{deptId:props.deptId}})
    }
    const todoMovingHandler =()=>{
        navigate('/products/todo',{state:{deptId:props.deptId}});
    }
    console.log(props.deptId)
    return (
        <div className=' bg-slate-800 relative top-0 w-[75px] inline-block'>
            <div onClick={appearHandler} id='listSidbar' className='hidden sticky top-2 left-2 w-fit'>
                <div className='text-fuchsia-500  w-fit p-3 hover:text-white cursor-pointer '>  <FaList className='text-2xl ' /> </div>
            </div>
            <div id='sidebar' className='w-[75px] bg-neutral-800/50 h-[100%] text-center '>
                <div className='h-[100vh]  w-fit m-auto pt-4 sticky top-0'>
                    <div onClick={hideHandler} className='text-fuchsia-500/60 p-3 my-1 hover:bg-fuchsia-500 hover:text-white cursor-pointer rounded-[20px]'><FaTimes className='text-3xl ' /></div>
                    {/* هون وقت بضغط عالرجعة عالبيت عم يروح من القسم كلو  */}
                    <div onClick={ homeMoveHandler }  className={`text-fuchsia-500 p-3 my-1  hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/departments/products" && 'bg-fuchsia-500/60 text-white'}`} > <FaHome className='text-3xl' /></div>  
                    <div onClick={soldMoveHandler} className={`text-fuchsia-500 py-3 my-1 hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/products/sold" && 'bg-fuchsia-500/60 text-white'}`}> Sold </div>
                    <div onClick={debtsMoveHandler} className={`text-fuchsia-500 py-3 my-1 hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/products/debts" && 'bg-fuchsia-500/60 text-white'}`}> Debts </div>
                    <div onClick={InventoryMoveHandler} className={`text-fuchsia-500 p-3 my-1 hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/products/inventory" && 'bg-fuchsia-500/60 text-white'}`}> <FaCoins className='text-3xl' /> </div>
                    <div onClick={employeesMoveHandler} className={`text-fuchsia-500 p-3 my-1 hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/products/employees" && 'bg-fuchsia-500/60 text-white'} `}>  <FaPeopleCarry className='text-3xl'  /> </div>
                    <div onClick={todoMovingHandler} className={`text-fuchsia-500 p-3 my-1 hover:bg-fuchsia-500/60 hover:text-white cursor-pointer rounded-[20px] ${buttonActive=== "/products/todo" && 'bg-fuchsia-500/60 text-white'} `}>  <FaTasks className='text-3xl' /> </div>
                </div>
            </div>
        </div>

    )
}