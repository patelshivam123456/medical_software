import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/components/User/Header";
import Footer from "@/components/User/Footer";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/tablets");
        const tablets = res.data || [];

        const uniqueCategories = [
          ...new Set(tablets.map((tab) => tab.category).filter(Boolean)),
        ];

        setCategories(uniqueCategories?.slice(0,4));
      } catch (error) {
        console.error("Error fetching tablets:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/user/product/product-list?category=${encodeURIComponent(category)}`);
  };

  const categoryImages = {
    "TAB": "/category/med.jpg",
    "CREME": "/category/creme.jpg",
    "DRY SYP": "/category/drysyp.jpg",
    "INJ": "/category/inj.jpg",
    "OIL":"/category/oil.jpg",
    "GEL":"/category/gel.jpg",
  };

  return (
    <>

      <div className="p-5  bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 tracking-tight text-gray-800">
         Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
           <div
           key={idx}
           onClick={() => handleCategoryClick(category)}
           className="relative h-48 rounded-xl overflow-hidden shadow-md cursor-pointer group"
         >
           <img
             src={categoryImages[category.toUpperCase()] || "/category/default.jpg"}
             alt={category}
             className="w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125"
           />
         
           {/* Overlay appears only on hover */}
           <div className="absolute inset-0 flex items-end justify-center  bg-opacity-0 group-hover:bg-opacity-60  group-hover:backdrop-blur transition-all duration-500">
             <h3 className="text-black bottom-0 bg-green-100 p-4 w-full text-xl font-semibold text-center  transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               {category}
             </h3>
           </div>
         </div>
          ))}
        </div>
        <div className="flex justify-end pt-4 pb-2">
          <a href="/user/category" className="text-green-800 hover:text-green-500">View More <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>

    </>
  );
};

export default Category;
