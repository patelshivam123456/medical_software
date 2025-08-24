"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

const GstCalculator = (props) => {
  const [amount, setAmount] = useState(3200);
  const [isLoggedCheck,setIsLoggedCheck] = useState('')

   useEffect(() => {
      if(props.isLoggedStatus){
        setIsLoggedCheck(props.isLoggedStatus)
      }
    }, []);

  const gstRates = [5, 12, 18];

  const calculateForGst = (gstRate) => {
    const requiredDiscount = (gstRate / (100 + gstRate)) * 100;
    const discountAmount = (amount * requiredDiscount) / 100;
    const discountedPrice = amount - discountAmount;
    const finalAmount = discountedPrice * (1 + gstRate / 100);

    return { gstRate, requiredDiscount, discountAmount, discountedPrice, finalAmount };
  };

  const results = gstRates.map((rate) => calculateForGst(rate));

  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
    <div className="pt-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          GST ↔ Discount Calculator
        </h1>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1 font-medium">
            Original Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">GST Rate</th>
                <th className="p-3 border">Discount %</th>
                <th className="p-3 border">Discount (₹)</th>
                <th className="p-3 border">After Discount (₹)</th>
                <th className="p-3 border">Final with GST (₹)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.gstRate} className="text-center">
                  <td className="p-2 border font-semibold">{res.gstRate}%</td>
                  <td className="p-2 border text-blue-600 font-medium">
                    {res.requiredDiscount.toFixed(2)}%
                  </td>
                  <td className="p-2 border text-blue-600">
                    ₹{res.discountAmount.toFixed(2)}
                  </td>
                  <td className="p-2 border">₹{res.discountedPrice.toFixed(2)}</td>
                  <td className="p-2 border text-green-600 font-bold">
                    ₹{res.finalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};
export async function getServerSideProps(context) {
    const { loggedIn, loginType } = context.req.cookies;
  
    if (!loggedIn && !context.query.loggedIn) {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
  
    // Only allow admin or sales
    if (loggedIn && loginType !== "admin" && loginType !== "sales"&&loginType!=="stockiest") {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
    const isLoggedStatus= loggedIn
    const checkLoginType=loginType
  
    return {
      props: {isLoggedStatus,checkLoginType},
    };
  }
  
export default GstCalculator;
