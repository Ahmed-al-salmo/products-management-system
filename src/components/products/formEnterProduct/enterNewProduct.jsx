import React from "react";

export default function EnterNewProduct(){
    return (
        <div className=" w-[1000px]  m-auto ">
            <form >
                <input className="bg-neutral-800 p-2 m-2 w-[97%]" type="text" placeholder="Title" />
                <div className="flex flex-wrap" >
                    <input className="bg-neutral-800 p-2 m-2 w-[180px] "  type="" placeholder="Price"/>
                    <input  className="bg-neutral-800 p-2 m-2 w-[180px]"  type="" placeholder="Tex"/>
                    <input className="bg-neutral-800 p-2 m-2 w-[180px]"  type="" placeholder="ADS"/>
                    <input className="bg-neutral-800 p-2 m-2 w-[180px]"  type="" placeholder="Discount"/>
                    {/* {
                        totalPrice ===0 ?
                            <div id="total" className="inline-block w-fit bg-red-800 p-2 m-2">total :{}</div>:
                            <div id="total" className="inline-block w-fit bg-green-700 p-2 m-2">total :{}</div>
                    } */}
                </div>
                <input className="bg-neutral-800 p-2 m-2 w-[97%]" placeholder="Product amount"/>
                <input className="bg-neutral-800 p-2 m-2 w-[97%]" placeholder="Category"/>

                <div  className="bg-fuchsia-500 p-2 m-2 w-[97%] rounded-full text-center cursor-pointer" > Create </div>
                <input  className="bg-neutral-800 p-2 m-2 w-[97%]" type="text" placeholder="Search" />
                <div className="flex justify-evenly flex-wrap">
                    <div className="bg-fuchsia-500 w-[400px] rounded-full text-center py-[10px] font-bold my-2 cursor-pointer">Search by Title</div>
                    <div  className="bg-fuchsia-500 w-[400px] rounded-full text-center py-[10px] font-bold my-2 cursor-pointer">Search by Category</div>
                </div>
                <div   className="bg-fuchsia-500 p-2 m-2 w-[97%] rounded-full text-center cursor-pointer" > Delete All </div>
                
            </form>
        </div>
    );
}