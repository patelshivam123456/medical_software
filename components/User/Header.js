'use client'

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import MyOrdersModal from '../order/MyOrdersModal';
import CartModal from '../order/CartModal';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext'; // ✅ use your cart context

const Header = ({ losdingState, orderRefresh, moveOnStep }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkLoginStatus, setCheckLoginStatus] = useState("");
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const router = useRouter();

  const { cart, mobile, removeFromCart, fetchCart } = useCart(); // ✅ use context

  useEffect(() => {
    const userLoggedIn = Cookies.get("userLoggedIn");
    setCheckLoginStatus(userLoggedIn || "");
  }, []);

  useEffect(() => {
    if (losdingState && mobile) {
      fetchCart(mobile);
    }
  }, [losdingState, mobile]);

  const handleLogout = () => {
    Cookies.remove("mobile");
    Cookies.remove("userLoggedIn");
    router.push("/user/login");
  };

  return (
    <header className="bg-yellow-50 sticky top-0 z-30">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-2 lg:px-8">
        <div className="flex lg:flex-1 items-center">
          <a href="/" className="-m-1.5 p-1.5">
            <img alt="company logo" src="/sriji.png" className="w-20" />
          </a>
          <div className="mt-19">
            <div className='text-[10px] font-semibold text-black -ml-18 tracking-wider'>ENTERPRISES</div>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <a href='/order' className="relative cursor-pointer" >
            <ShoppingCartIcon className='w-6 h-6' />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                {cart.length}
              </span>
            )}
          </a>
          <div className="cursor-pointer" onClick={() => setShowOrdersModal(true)}>
            <ShoppingBagIcon className='w-6 h-6' />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/user/product/product-list" className="text-sm font-semibold text-gray-900">Product</a>
          <a href="/user/category" className="text-sm font-semibold text-gray-900">Category</a>
          <a href="/user/aboutus" className="text-sm font-semibold text-gray-900">About us</a>
          {/* <a href="/order" className="text-sm font-semibold text-gray-900">Online Order</a> */}
        </PopoverGroup>

        <div className="hidden lg:flex gap-4 lg:flex-1 lg:justify-end items-center">
          <a href="/order" className="relative cursor-pointer">
            <ShoppingCartIcon className='w-6 h-6' />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                {cart.length}
              </span>
            )}
          </a>
          <div className="cursor-pointer" onClick={() => setShowOrdersModal(true)}>
            <ShoppingBagIcon className='w-6 h-6' />
          </div>
          {checkLoginStatus ? (
            <div onClick={handleLogout} className="cursor-pointer text-sm font-semibold text-gray-900">
              Log out →
            </div>
          ) : (
            <a href="/user/login" className="text-sm font-semibold text-gray-900">Log in →</a>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <img alt="" src="/sriji.png" className="h-16 w-auto" />
            </a>
            <button onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <XMarkIcon className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a href="/user/product/product-list" className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">Product</a>
                <a href="/user/category" className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">Category</a>
                <a href="/user/aboutus" className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">About us</a>
                {/* <a href="/order" className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">Online Order</a> */}
              </div>
              <div className="py-6">
                {checkLoginStatus ? (
                  <div onClick={handleLogout} className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">
                    Log out
                  </div>
                ) : (
                  <a href="/user/login" className="block px-3 py-2 font-semibold text-gray-900 hover:bg-gray-50">
                    Log in
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Modals */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowCartModal(false)}
            >
              ✖
            </button>
            <CartModal cart={cart} removeFromCart={removeFromCart} moveOnStep={moveOnStep} />
          </div>
        </div>
      )}

      {showOrdersModal && (
        <MyOrdersModal mobile={mobile} onClose={() => setShowOrdersModal(false)} orderRefresh={orderRefresh} />
      )}
    </header>
  );
};

export default Header;
