'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogPanel,

  PopoverGroup,

} from '@headlessui/react'
import {

  Bars3Icon,

  ShoppingBagIcon,
  ShoppingCartIcon,

  XMarkIcon,
} from '@heroicons/react/24/outline'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import MyOrdersModal from '../order/MyOrdersModal'
import CartModal from '../order/CartModal'
import axios from 'axios';
import { toast } from 'react-toastify'



const Header=({losdingState,orderRefresh,moveOnStep})=> {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkLoginStatus,setCheckLoginStatus] =useState("")
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [mobile,setMobile]=useState("")
  const router = useRouter()

  useEffect(()=>{
    if(Cookies.get("userLoggedIn")){
        setCheckLoginStatus(Cookies.get("userLoggedIn"))
    }
    if(Cookies.get("mobile")){
        setMobile(Cookies.get("mobile"))
    }
  },[])
  useEffect(() => {
    if (losdingState) {
      axios.get(`/api/order/cart?mobile=${mobile}`)
        .then(res => {setCart(res.data)})
        .catch(err => {
          console.error("Cart fetch failed:", err);
          setCart([]);
        });
    }
  }, [losdingState]);
  useEffect(() => {
    if (mobile) {
      axios.get(`/api/order/cart?mobile=${mobile}`)
        .then(res => {setCart(res.data)})
        .catch(err => {
          console.error("Cart fetch failed:", err);
          setCart([]);
        });
    }
  }, [mobile]);

  const handleLogout=()=>{
    Cookies.remove("mobile")
    Cookies.remove("userLoggedIn")
    router.push("/user/login")
  }

  const removeFromCart = async (index) => {
    const product = cart[index];
    try {
      await axios.delete('/api/order/cart', {
        data: { productId: product._id, mobile }
      });
      setCart(prev => prev.filter((_, i) => i !== index));
      toast.success("Item removed from cart")
      axios.get(`/api/order/cart?mobile=${mobile}`)
        .then(res => {setCart(res.data)})
        .catch(err => {
          console.error("Cart fetch failed:", err);
          setCart([]);
        });
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <header className="bg-yellow-50 sticky top-0 z-30">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-2 lg:px-8">
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
          <div className='text-[10px] font-semibold text-black -ml-18 tracking-wider'>ENTERPRISE</div>
          
          </div>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
        <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
    <ShoppingCartIcon className='w-6 h-6' />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
        {cart.length}
      </span>
    )}
  </div>
  <div className=" cursor-pointer" onClick={() => setShowOrdersModal(true)}>
  <ShoppingBagIcon className='w-6 h-6' />
</div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
        <a href="/user/product/product-list" className="text-sm/6 font-semibold text-gray-900">
            Product
          </a>
        <a href="/user/aboutus" className="text-sm/6 font-semibold text-gray-900">
            About us
          </a>
          <a href="/order" className="text-sm/6 font-semibold text-gray-900">
            Online Order
          </a>
         
        </PopoverGroup>
        <div className="hidden lg:flex gap-4 lg:flex-1 lg:justify-end items-center">
       
  <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
    <ShoppingCartIcon className='w-6 h-6' />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
        {cart.length}
      </span>
    )}
  </div>
  <div className=" cursor-pointer" onClick={() => setShowOrdersModal(true)}>
  <ShoppingBagIcon className='w-6 h-6' />
</div>

          {checkLoginStatus?<div onClick={handleLogout} className="cursor-pointer text-sm/6 font-semibold text-gray-900">
            Log out <span aria-hidden="true">&rarr;</span>
          </div>
          :
          <a href="/user/login" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="/sriji.png"
                className="h-16 w-auto"
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
              <div className="space-y-2 py-6">
              <a
                  href="/user/product/product-list"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Product
                </a>
              <a
                  href="/user/aboutus"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  About us
                </a>
                <a
                  href="/order"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Online Order
                </a>
               
              </div>
              <div className="py-6">
                {checkLoginStatus?
                <div
                onClick={handleLogout}
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Log out
              </div>
                :<a
                  href="/user/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      {showCartModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setShowCartModal(false)}
      >
        ✖
      </button>

      <CartModal cart={cart} removeFromCart={removeFromCart} moveOnStep={moveOnStep}/>
     
    </div>
  </div>
)}
 {showOrdersModal && (
  <MyOrdersModal mobile={mobile} onClose={() => setShowOrdersModal(false)} orderRefresh={orderRefresh}/>
)}
    </header>
  )
}
export default Header