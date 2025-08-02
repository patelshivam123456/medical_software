import React from 'react'

const Footer = () => {
  return (
   

<footer class="bg-gray-900  shadow-sm dark:bg-gray-900">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:pt-2">
        <div class="sm:flex sm:items-center sm:justify-between px-4">
            <a href="/" class="mb-4 sm:mb-0 relative">
                <img src="/sriji.png" class="h-16 w-16" alt="Flowbite Logo" />
                <span class="absolute top-14 text-[8px] left-2 -pt-6  whitespace-nowrap text-white dark:text-white">ENTERPRISES</span>
            </a>
            <ul class="pt-4 sm:pt-0 flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="/user/aboutus" class="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                    <a href="/user/privay-policy" class="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="/user/catogery" class="hover:underline me-4 md:me-6">category</a>
                </li>
                <li>
                    <a href="/user/product/product-list" class="hover:underline">Product</a>
                </li>
            </ul>
        </div>
        <hr class=" border-gray-200 sm:mx-auto dark:border-gray-700 mt-5 mb-4" />
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="/" class="hover:underline">SHRI JI ENTERPRISES</a>. All Rights Reserved.</span>
    </div>
</footer>


  )
}

export default Footer