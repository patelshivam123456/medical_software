import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Header from "@/components/Header";

const ProfitSummaryPage=(props)=> {
  const [salesTotal, setSalesTotal] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedCheck,setIsLoggedCheck] = useState('')

  useEffect(() => {
    if(props.isLoggedStatus){
      setIsLoggedCheck(props.isLoggedStatus)
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, purchaseRes] = await Promise.all([
          axios.get("/api/bills"),
          axios.get("/api/get-purchse"),
        ]);

        const salesBills = Array.isArray(salesRes.data)
          ? salesRes.data
          : Array.isArray(salesRes.data.bills)
          ? salesRes.data.bills
          : [];

        const purchaseBills = Array.isArray(purchaseRes.data)
          ? purchaseRes.data
          : Array.isArray(purchaseRes.data.purchases)
          ? purchaseRes.data.purchases
          : [];

        const totalSales = Math.ceil(
          salesBills.reduce((sum, bill) => sum + Number(bill.grandtotal || 0), 0)
        );

        const totalPurchases = Math.ceil(
          purchaseBills.reduce((sum, bill) => sum + Number(bill.grandtotal || 0), 0)
        );

        setSalesTotal(totalSales);
        setPurchaseTotal(totalPurchases);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profit = salesTotal - purchaseTotal;

  const chartData = [
    { name: "Sales", amount: salesTotal },
    { name: "Purchases", amount: purchaseTotal },
    { name: "Profit", amount: profit },
  ];

  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 flex flex-col items-center justify-center text-white">
      <div className="bg-[#111827] rounded-2xl shadow-2xl p-8 w-full max-w-3xl mb-10 border border-blue-700">
        <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-8 tracking-wide">
          📈 Profit Summary Dashboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Fetching live data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xl font-semibold">
            <div className="bg-[#1f2937] p-6 rounded-xl shadow-inner border border-green-500">
              <p className="text-green-400 text-sm mb-1">TOTAL SALES</p>
              <h2 className="text-green-300 text-2xl font-bold">₹{salesTotal.toFixed(2)}</h2>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl shadow-inner border border-red-500">
              <p className="text-red-400 text-sm mb-1">TOTAL PURCHASE</p>
              <h2 className="text-red-300 text-2xl font-bold">₹{purchaseTotal.toFixed(2)}</h2>
            </div>

            <div
              className={`bg-[#1f2937] p-6 rounded-xl shadow-inner border ${
                profit >= 0 ? "border-green-500" : "border-red-500"
              }`}
            >
              <p className="text-yellow-400 text-sm mb-1">NET PROFIT</p>
              <h2
                className={`text-2xl font-bold ${
                  profit >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{Math.ceil(profit)}.00
              </h2>
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div className="bg-[#111827] rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-blue-700">
          <h2 className="text-2xl font-semibold text-center mb-6 text-blue-300">
            🧮 Profit Visualization
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#3b82f6", color: "#fff" }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="amount" fill="#3b82f6" barSize={45} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
    </>
  );
}
export default ProfitSummaryPage
export async function getServerSideProps(context) {
    const { loggedIn, loginType } = context.req.cookies;
  
    if (!loggedIn && !context.query.loggedIn) {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
  
    // Only allow admin or sales
    if (loggedIn && loginType !== "admin") {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
  
    const isLoggedStatus= loggedIn
  
    return {
      props: {isLoggedStatus},
    };
  }