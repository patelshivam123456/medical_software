'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'



const Header=({isLoggedStatus})=> {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkLoginType,setCheckLoginType] = useState('')
  const router = useRouter()

  useEffect(()=>{
    if(Cookies.get("loginType")){
        setCheckLoginType(Cookies.get("loginType"))
    }
   
  },[])

  const handleLogout =()=>{
    Cookies.remove("loggedIn")  
    Cookies.remove("loginType")
    router.push("/admin")
  }

  const Sales_Person = [
    { name: 'Create Client Bill', href: '/admin/bill', icon: ChartPieIcon },
    { name: 'Sell Return',  href: '/admin/return', icon: CursorArrowRaysIcon },
    { name: 'Online Order Bill',  href: '/admin/mark-delivery', icon: FingerPrintIcon },
    { name: 'Add Client',  href: '/admin/client', icon: SquaresPlusIcon },
    { name: 'Product List',  href: '/admin/product-list', icon: SquaresPlusIcon },
    { name: 'Kharcha',  href: '/admin/kharchapage', icon: SquaresPlusIcon },
    // { name: 'Login Access',  href: '/admin/accesstype', icon: ArrowPathIcon },
    // { name: 'User Login/Signup Details',  href: '/admin/register-person', icon: ArrowPathIcon },
  ]
  const Stockiest_Person = [
    { name: 'Purchase', href: '/admin/purchase', icon: ChartPieIcon },
    { name: 'Check Stock',  href: '/admin/manage-stock', icon: CursorArrowRaysIcon },
    { name: 'Online Order',  href: '/admin/online-order', icon: FingerPrintIcon },
    { name: 'Add New Pharam',  href: '/admin/add-new-pharam', icon: SquaresPlusIcon },
    { name: 'Return Purchase',  href: '/admin/purchase-return', icon: ArrowPathIcon },
    // { name: 'User Login/Signup Details',  href: '/admin/register-person', icon: ArrowPathIcon },
  ]

  return (
    <header className="bg-white sticky top-0 z-40 shadow-2xl">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl py-1 items-center justify-between px-6 lg:px-8">
        <div className="flex lg:flex-1 items-center">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="company logo"
              src="/sriji.png"
              className="w-20"
            />
          </a>
          <div className='mt-19'>
          <div className='text-[10px] font-semibold text-black -ml-18 tracking-wider'>ENTERPRISES</div>
            {/* <div className='text-yellow-600 font-semibold text-[18px]'>SHRI JI</div> */}
            {/* <div className='text-[10px]  text-black -mt-1 border-t-[0.5px] border-gray-400'>ENTERPRISES</div> */}
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        {/* {router.pathname==="/manage-stock"?<PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm/6 font-semibold text-gray-900">
            Bill page
          </a>
          <a href="/client" className="text-sm/6 font-semibold text-gray-900">
            Client
          </a>
        </PopoverGroup>
        :router.pathname==="/"?<PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/manage-stock" className="text-sm/6 font-semibold text-gray-900">
            Stock 
          </a>
          <a href="/client" className="text-sm/6 font-semibold text-gray-900">
            Client
          </a>
          </PopoverGroup>
          :
          router.pathname==="/client"?<PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-gray-900">
            Bill page
          </a>
          <a href="/manage-stock" className="text-sm/6 font-semibold text-gray-900">
            Stock 
          </a>
          </PopoverGroup>
          :
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-gray-900">
            Bill page
          </a>
          <a href="/manage-stock" className="text-sm/6 font-semibold text-gray-900">
            Stock
          </a>
          <a href="/client" className="text-sm/6 font-semibold text-gray-900">
            Client
          </a>
          </PopoverGroup>
          
          } */}
          {(router.pathname.toLowerCase().includes("admin")&&isLoggedStatus)&&<>
          
          <PopoverGroup className="hidden lg:flex lg:gap-x-5">
          {checkLoginType==="admin"&&
          <><Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 outline-none">
              Sales Person
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {Sales_Person.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg px-4 py-2 text-sm/6 hover:bg-gray-50"
                  >
                    
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                       
                      </a>
                     
                    </div>
                  </div>
                ))}
              </div>
              
            </PopoverPanel>
          </Popover></>}
          {checkLoginType==="admin"&&
          <><Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 outline-none">
              Stock Manager Person
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {Stockiest_Person.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg px-4 py-2 text-sm/6 hover:bg-gray-50"
                  >
                    
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                       
                      </a>
                     
                    </div>
                  </div>
                ))}
              </div>
              
            </PopoverPanel>
          </Popover></>}
          {(checkLoginType==="sales"||checkLoginType==="stockiest"||checkLoginType==="admin")&& <a href="/admin/itemListWithImages" className="text-sm/6 font-semibold text-gray-900">
            Item List
          </a>}
          {(checkLoginType==="sales"||checkLoginType==="stockiest"||checkLoginType==="admin")&& <a href="/admin/gst-calculator" className="text-sm/6 font-semibold text-gray-900">
            Calculator
          </a>}
           {checkLoginType==="sales"&& <a href="/admin/bill" className="text-sm/6 font-semibold text-gray-900">
            Create Bill
          </a>}
          {checkLoginType==="stockiest"&&<a href="/admin/purchase" className="text-sm/6 font-semibold text-gray-900">
            Purchase
          </a>}
          {checkLoginType==="stockiest"&&<a href="/admin/purchase-return" className="text-sm/6 font-semibold text-gray-900">
            Purchase Return
          </a>}
          {checkLoginType==="stockiest"&&<a href="/admin/manage-stock" className="text-sm/6 font-semibold text-gray-900">
            Check  Stock
          </a>}
          {checkLoginType==="stockiest"&&<a href="/admin/add-new-pharam" className="text-sm/6 font-semibold text-gray-900">
            Add New Pharam
          </a>}
          {checkLoginType==="sales"&&<a href="/admin/mark-delivery" className="text-sm/6 font-semibold text-gray-900">
            Online Order Bill
          </a>}
          {checkLoginType==="sales"&&<a href="/admin/return" className="text-sm/6 font-semibold text-gray-900">
            Sell Return
          </a>}
          {checkLoginType==="stockiest"&&<a href="/admin/online-order" className="text-sm/6 font-semibold text-gray-900">
            Online Order
          </a>}
          {checkLoginType==="sales"&&<a href="/admin/client" className="text-sm/6 font-semibold text-gray-900">
            Client
          </a>}
          {checkLoginType==="admin"&&<a href="/admin/accesstype/adduser" className="text-sm/6 font-semibold text-gray-900">
            Login Access
          </a>}
          {checkLoginType==="admin"&&<a href="/admin/profit" className="text-sm/6 font-semibold text-gray-900">
            Check Profit
          </a>}
          {(checkLoginType==="admin"||checkLoginType==="delivery")&&<a href="/admin/complete-delivery" className="text-sm/6 font-semibold text-gray-900">
            Delivery person
          </a>}
          {(checkLoginType==="admin")&&<a href="/admin/register-person" className="text-sm/6 font-semibold text-gray-900">
            User Register/Login details
          </a>}
          </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" onClick={handleLogout} className="text-sm/6 font-semibold text-gray-900">
            Log out <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        </>}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt="logo"
                src="/sriji.png"
                className="h-12 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* {router.pathname==="/"?<>
            <div className="space-y-2 py-6">
                <a
                  href="/client"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Client
                </a>
              </div>
              <div className="space-y-2 py-6">
              <a
                href="/manage-stock"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Stock
              </a>
            </div>
            </>:
              router.pathname==="/client"?<>
              <div className="space-y-2 py-6">
                  <a
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Bill page
                  </a>
                </div>
                <div className="space-y-2 py-6">
                <a
                  href="/manage-stock"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Stock
                </a>
              </div>
              </>:
              router.pathname==="/manage-stock"?<>
              <div className="space-y-2 py-6">
                  <a
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Bill page
                  </a>
                </div>
                <div className="space-y-2 py-6">
                <a
                  href="/clint"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Client
                </a>
              </div>
              </>:
            <>
            <div className="space-y-2 py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Bill page
                </a>
              </div>
              <div className="space-y-2 py-6">
              <a
                href="/manage-stock"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Stock
              </a>
            </div>
            <div className="space-y-2 py-6">
              <a
                href="/client"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Client
              </a>
            </div>
            </>
            } */}
           {(checkLoginType==="admin"||checkLoginType==="sales")&& <div className="space-y-2 py-6">
                <a
                  href="/admin/bill"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                 Create Bill
                </a>
              </div>}
              {(checkLoginType==="admin"||checkLoginType==="sales")&&<div className="space-y-2 py-6">
              <a
                href="/admin/return"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
               Sell Return
              </a>
            </div>}
              {(checkLoginType==="admin"||checkLoginType==="sales")&& <div className="space-y-2 py-6">
                <a
                  href="/admin/mark-delivery"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Online Order Bill
                </a>
              </div>}
              {(checkLoginType==="admin"||checkLoginType==="sales")&&<div className="space-y-2 py-6">
              <a
                href="/admin/client"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Add Client
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/purchase"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Purchase
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/purchase-return"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Purchase Return
              </a>
            </div>}
              {(checkLoginType==="admin"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/manage-stock"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Check Stock
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="sales"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/itemListWithImages"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Item List
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="sales"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/gst-calculator"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Calculator
              </a>
            </div>}
            {(checkLoginType==="admin")&&<div className="space-y-2 py-6">
              <a
                href="/admin/product-list"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Product List
              </a>
            </div>}
            {(checkLoginType==="admin")&&<div className="space-y-2 py-6">
              <a
                href="/admin/kharchapage"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Kharcha
              </a>
            </div>}
            
            {(checkLoginType==="admin"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/online-order"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Online Order
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="stockiest")&&<div className="space-y-2 py-6">
              <a
                href="/admin/add-new-pharam"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Add New Pharam
              </a>
            </div>}
            
            {(checkLoginType==="admin")&&<div className="space-y-2 py-6">
              <a
                href="/admin/accesstype/adduser"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Login Access
              </a>
            </div>}
            {(checkLoginType==="admin")&&<div className="space-y-2 py-6">
              <a
                href="/admin/profit"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Check Profit
              </a>
            </div>}
            {(checkLoginType==="admin"||checkLoginType==="delivery")&&<div className="space-y-2 py-6">
              <a
                href="/admin/complete-delivery"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Delivery Person
              </a>
            </div>}
            {(checkLoginType==="admin")&&<div className="space-y-2 py-6">
              <a
                href="/admin/register-person"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
               User Register/Login details
              </a>
            </div>}
              {router.pathname.toLowerCase().includes("admin")&&<div className="py-6">
                <a
                  href="#"
                  onClick={handleLogout}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log out
                </a>
              </div>}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
export default Header