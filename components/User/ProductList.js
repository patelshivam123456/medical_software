// import React from 'react'

// const ProductList = () => {
//   return (

//     <div class="bg-white">
//     <div class="pt-32  bg-white">
//     <h1 class="text-center text-2xl font-bold text-gray-800">All Products</h1>
//     </div>
//     <div class="flex flex-wrap items-center  overflow-x-auto overflow-y-hidden py-10 justify-center   bg-white text-gray-800">
//         <a rel="noopener noreferrer" href="#" class="flex items-center flex-shrink-0 px-5 py-3 space-x-2text-gray-600">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
//                 <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
//             </svg>
//             <span>Architecto</span>
//         </a>
//         <a rel="noopener noreferrer" href="#" class="flex items-center flex-shrink-0 px-5 py-3 space-x-2 rounded-t-lg text-gray-900">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
//                 <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
//                 <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
//             </svg>
//             <span>Corrupti</span>
//         </a>
//         <a rel="noopener noreferrer" href="#" class="flex items-center flex-shrink-0 px-5 py-3 space-x-2  text-gray-600">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
//                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
//             </svg>
//             <span>Excepturi</span>
//         </a>
//         <a rel="noopener noreferrer" href="#" class="flex items-center flex-shrink-0 px-5 py-3 space-x-2  text-gray-600">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
//             </svg>
//             <span>Consectetur</span>
//         </a>
//     </div>
    

//     <section class="py-10 bg-gray-100">
//       <div class="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">Adobe Photoshop CC 2022</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$850</p>
    
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
//               <div class="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 <span class="ml-1 text-sm text-slate-400">4.9</span>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$850</p>
       
    
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
    
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
    
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1520256862855-398228c41684?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
    
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
    
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
          
//             <div class="relative flex items-end overflow-hidden rounded-xl">
//               <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80" alt="Hotel Photo" />
//               <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
    
//                 <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//               </div>
//             </div>
    
//             <div class="mt-1 p-2">
//               <h2 class="text-slate-700">The Hilton Hotel</h2>
//               <p class="mt-1 text-sm text-slate-400">Lisbon, Portugal</p>
    
//               <div class="mt-3 flex items-end justify-between">
//                   <p class="text-lg font-bold text-blue-500">$450</p>
    
//                 <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                   </svg>
    
//                   <a href="/user/product/product-details"><button class="text-sm">Add to cart</button></a>
//                 </div>
//               </div>
//             </div>
          
//         </article>
//         </div>
//     </section>
    
//    </div>
//   )
// }

// export default ProductList

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList() {
  const [groupedTablets, setGroupedTablets] = useState([]);
  const [stripCounts, setStripCounts] = useState({});
  const [selectedMG, setSelectedMG] = useState({});
  const [mobile, setMobile] = useState("8707868591"); // Replace with dynamic mobile if needed
  const [cart, setCart] = useState([]);

  // ✅ Fetch all tablets and group them
  useEffect(() => {
    const fetchTablets = async () => {
      try {
        const res = await axios.get("/api/tablets");
        const data = Array.isArray(res.data) ? res.data : res.data.tablets;

        const grouped = {};
        data.forEach((tab) => {
          if (!grouped[tab.name]) {
            grouped[tab.name] = {
              name: tab.name,
              packaging: tab.packaging,
              category: tab.category,
              company: tab.company,
              mgOptions: [],
              fullTabs: [],
            };
          }

          if (tab.mg && !grouped[tab.name].mgOptions.includes(tab.mg)) {
            grouped[tab.name].mgOptions.push(tab.mg);
          }

          grouped[tab.name].fullTabs.push(tab);
        });

        setGroupedTablets(Object.values(grouped));
      } catch (err) {
        console.error("Error fetching tablets:", err);
      }
    };

    fetchTablets();
  }, []);

  // ✅ Fetch cart items from API on load
  useEffect(() => {
    if (!mobile) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
        setCart(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [mobile]);

  // ✅ Strip input handler
  const handleStripChange = (productName, value) => {
    setStripCounts((prev) => ({ ...prev, [productName]: value }));
  };

  // ✅ MG select handler
  const handleMGChange = (productName, mg) => {
    setSelectedMG((prev) => ({ ...prev, [productName]: mg }));
  };

  // ✅ Check if item with selected MG is already in cart
  const isInCart = (product) => {
    const selectedMg = selectedMG[product.name];
    return cart.some((item) => item.name === product.name && item.mg === selectedMg);
  };

  // ✅ Add to cart
  const handleAddToCart = async (product) => {
    const selectedMg = selectedMG[product.name];
    const strips = Number(stripCounts[product.name] || 0);

    if (!selectedMg || !strips || strips <= 0) {
      alert("Please select MG and enter valid strips.");
      return;
    }

    const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
    if (!tablet) {
      alert("Variant not found");
      return;
    }

    const stripCountInPack = parseInt(product.packaging.split("*")[1] || "1");
    const quantity = stripCountInPack * strips;
    const total = tablet.price * strips;

    const payload = {
      _id: tablet._id,
      name: tablet.name,
      packaging: tablet.packaging,
      category: tablet.category,
      company: tablet.company,
      salt: tablet.salt,
      purchase: tablet.purchase,
      price: tablet.price,
      mrp: tablet.mrp,
      mg: tablet.mg,
      batch: tablet.batch,
      expiry: tablet.expiry,
      strips,
      quantity,
      total,
      mobile,
    };

    try {
      await axios.post("http://localhost:3000/api/order/cart", payload);
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
      alert("🛒 Added to cart successfully");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groupedTablets.map((product, index) => {
          const selectedMg = selectedMG[product.name];
          const alreadyInCart = isInCart(product);

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                <span>Product Image</span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.company}</p>
                <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Packaging: {product.packaging}</p>

                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <select
                    className="border rounded-md px-3 py-2 text-sm text-gray-700 w-full"
                    value={selectedMG[product.name] || ""}
                    onChange={(e) => handleMGChange(product.name, e.target.value)}
                  >
                    <option value="">Select MG</option>
                    {product.mgOptions.map((mg, idx) => (
                      <option key={idx} value={mg}>
                        {mg} mg
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    placeholder="Strips"
                    className="border rounded-md px-3 py-2 text-sm w-full"
                    value={stripCounts[product.name] || ""}
                    onChange={(e) => handleStripChange(product.name, e.target.value)}
                  />
                </div>

                <button
                  className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium transition duration-200 ${
                    alreadyInCart
                      ? "bg-green-500 cursor-not-allowed text-white"
                      : selectedMg
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-white"
                  }`}
                  onClick={() => {
                    if (!alreadyInCart && selectedMg) {
                      handleAddToCart(product);
                    }
                  }}
                  disabled={alreadyInCart || !selectedMg}
                >
                  {alreadyInCart
                    ? "Added"
                    : !selectedMg
                    ? "Select MG"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">🛒 Cart Summary</h3>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between border-b py-2 text-sm">
                <span>{item.name} ({item.mg}mg)</span>
                <span>{item.strips} strips = ₹{item.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}




