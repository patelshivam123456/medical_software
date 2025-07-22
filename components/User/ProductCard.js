import React from 'react'

const ProductCard = () => {
  return (
    <div className='flex gap-10'>
    <div className='border border-gray-400 rounded p-2 w-[20%]'>
        <div className="flex ju">
            <img src="/category/inj.jpg" className='w-full h-28'/>
        </div>
        <div className='text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13'>Hexilak Ultra Hexilak Ultra Hexilak Ultra</div>
        <div className='text-xs font-medium text-gray-600 font-sans pt-0'>Medini</div>
        <div className='flex justify-between items-center' ><select className='mt-2 text-xs font-medium text-gray-600 font-sans border px-2 py-1 rounded outline-none'>
            <option>10 Mg</option>
            <option>10 Mg</option>
        </select>
        <div className='mt-2 text-xs font-medium text-gray-600 font-sans'>1*3 pack</div>
        
        </div>
        <div className='flex justify-between items-center mt-3'>
            <div className='text-sm font-medium text-gray-600 font-sans'>499</div>
            <div className='border border-green-700 text-green-700 rounded px-4 py-1 text-sm'>Add</div>
        </div>
        <div className='flex justify-between items-center mt-3'>
            <div className='text-sm font-medium text-gray-600 font-sans'>499</div>
            <div className='flex items-center'>
                <div className='bg-green-700 text-white h-8 rounded-l-sm flex justify-center items-center w-6 text-sm text-center'>1</div>
                <div className='bg-green-700 text-white h-8  flex justify-center items-center w-5 text-sm text-center'>2</div>
                <div className='bg-green-700 text-white h-8 rounded-r-sm flex justify-center items-center w-6 text-sm text-center'>3</div>

            </div>
        </div>
    </div>
    <div className='border border-gray-400 rounded p-2 w-[20%]'>
        <div className="flex ju">
            <img src="/category/inj.jpg" className='w-full h-28'/>
        </div>
        <div className='text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13'>Hexilak Ultra</div>
       <div> <div className='text-xs font-medium text-gray-600 font-sans pt-0'>Medini</div>
       <div>1*3 Pack</div>
       </div>
    </div>
    <div className='border border-gray-400 rounded p-2 w-[20%]'>
        <div className="flex ju">
            <img src="/category/inj.jpg" className='w-full h-28'/>
        </div>
        <div className='text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13'>Hexilak Ultra</div>
        <div className='text-xs font-medium text-gray-600 font-sans pt-0'>Medini</div>
    </div>
    <div className='border border-gray-400 rounded p-2 w-[20%]'>
        <div className="flex justify-center">
            <img src="/category/inj.jpg" className='w-full h-28'/>
        </div>
        <div className='text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13'>Hexilak Ultra</div>
        <div className='text-xs font-medium text-gray-600 font-sans pt-0'>Medini</div>
    </div>
    <div className='border border-gray-400 rounded p-2 w-[20%]'>
        <div className="flex justify-center">
            <img src="/category/inj.jpg" className='w-full h-28'/>
        </div>
        <div className='text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13'>Hexilak Ultra</div>
        <div className='text-xs font-medium text-gray-600 font-sans pt-0'>Medini</div>
    </div>
    </div>
  )
}

export default ProductCard