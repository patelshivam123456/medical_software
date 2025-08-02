"use client";
import { useRouter } from "next/router";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { toWords } from "number-to-words";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import Header from "@/components/Header";



const BillDetailPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [grandtotal, setgrandtotal] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [isLoggedCheck, setIsLoggedCheck] = useState("");
  const [billdata, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);



  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/new-purchase/${id}`); // ✅ Correct URL
      setBillData(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch purchase:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (props.isLoggedStatus) {
      setIsLoggedCheck(props.isLoggedStatus);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPurchase();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!billdata) return <p>No bill found</p>;

  console.log(billdata.gst);
  

//   if (error) return <div className="p-6">❌ Failed to load bill</div>;
//   if (!data) return <div className="p-6">Loading...</div>;

  const discountAmount = billdata.discount
    ? (billdata.grandtotal * billdata.discount) / 100
    : 0;
  const subTotal = billdata.grandtotal - discountAmount;

  const sgstAmount = billdata.gst ? (subTotal * billdata.sgst) / 100 : 0;
  const cgstAmount = billdata.gst ? (subTotal * billdata.cgst) / 100 : 0;

  const grandtotalWithTax = subTotal + sgstAmount + cgstAmount;

  const roundedgrandtotal = Math.ceil(grandtotalWithTax);
  const totalInWords = toWords(roundedgrandtotal);

  const handleDownloadPDF = () => {
    setDownloading(true);
    const input = document.getElementById("bill-content");

    html2canvas(input, {
      backgroundColor: "#00000",
      scale: 2,
      ignoreElements: (el) => el.classList?.contains("no-print"),
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${billdata.billNo}.pdf`);
      setDownloading(false);
    });
  };

//   const calculateStrips = (packing, quantity) => {
//     if (!packing || !quantity) return "0";
  
//     const parts = packing.split("*");
//     if (parts.length !== 2) return "0";
  
//     const multiplier = parseInt(parts[1], 10);
//     if (isNaN(multiplier) || multiplier === 0) return "0";
  
//     const fullStrips = Math.floor(quantity / multiplier);
//     const remaining = quantity % multiplier;
  
//     return remaining === 0 ? `${fullStrips}` : `${fullStrips}*${remaining}`;
//   };

  return (
    // <></>
    <>
      <Header isLoggedStatus={isLoggedCheck} />
      <div
        id="bill-content"
        className="relative p-6 max-w-7xl mx-auto bg-white "
        style={{
          width: "2000px",
          minHeight: "700px",
          padding: "40px",
          boxSizing: "border-box",
          position: "relative",
          color: "black",
        }}
      >
        {/* ✅ Watermark logo */}
        <img
          src="/sriji.png"
          alt="Watermark"
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none w-[300px]"
          style={{ zIndex: 10 }}
        />
        <div className="mb-6 -mt-6 no-print relative z-10 flex justify-end">
          {downloading ? (
            <LoadingBtn />
          ) : (
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              📥 Download PDF
            </button>
          )}
        </div>
        {/* ✅ Bill content */}
        <div className="relative z-10 border px-2 py-2">
          <div className="flex">
            <div className="w-1/2">
              <div
                className="gap-1"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{ marginTop: "13px" }}>
                  <img src="/sriji.png" alt="logo" className="h-12 w-12" />
                </div>
                <div>
                  <div className="text-lg" style={{ fontWeight: "bold" }}>
                    SHRI JI ENTERPRISES
                  </div>
                  <div className="text-xs font-semibold italic -mt-1">
                    GST Not Applicable
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "-5px" }}>
                Pratap market,Kamla Market,Aminabad Rd
              </div>
              <div>Aminabad,Lucknow,Uttar Pradesh-122001</div>
              <div className="text-base">Mobile Number: +91-8707868591</div>
            </div>
            <div className="w-1/2">
              <div className="text-lg" style={{ fontWeight: "bold" }}>
                {billdata.clientName}
              </div>
              <div className="">{billdata.address1}</div>
              <div>{billdata.address2 || ""}</div>
              <div>{billdata.state + "," + billdata.pinCode}</div>
              <div className="text-base">
                Mobile Number: +91-{billdata.mobile}
              </div>
              <div>GST:</div>
            </div>
          </div>
          <div className="flex  gap-2 border mt-2 px-3">
            <div className="w-[35%]">
              <div className="text-sm">
                Payment Method: {billdata.paymenttype==="cod"?"Cash on Delivery":billdata.paymenttype}
              </div>
              {billdata.orderid&&<div className="text-sm">
                Order_Id: {billdata.orderid}
              </div>}
            </div>
            <div className="w-[65%] flex gap-4 ">
              <div
                className="w-[35%] text-xl font-semibold text-center pb-4 pt-2 px-2"
                style={{ backgroundColor: "#f5b13d" }}
              >
                GST INVOICE
              </div>
              <div className="w-[65%] flex  justify-between pb-4 ">
                <div>
                  <div className="text-sm">
                    Invoice No.: SJ000{billdata.billNo}
                  </div>
                  {/* <div className="text-sm">
                    Purchase Person: {billdata.salesperson}
                  </div> */}
                </div>
                <div>
                  <div className="text-sm">
                    Date:{" "}
                    {billdata?.createdAt
                      ? new Date(billdata.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </div>
                  {billdata.dispatchDate?
                  <div className="text-sm">
                  Dispatch Date:{" "}
                  {billdata?.dispatchDate
                    ? billdata.dispatchDate.split("T")[0]
                    : ""}</div>
                  :
                  <div className="text-sm">
                    Invoice Date:{" "}
                    {billdata?.invoiceDate
                      ? new Date(billdata.invoiceDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          // hour: "2-digit",
                          // minute: "2-digit",
                          // hour12: true,
                        })
                      : ""}
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative border"
            style={{
              minHeight: "220px", // adjust as needed
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <table className=" min-w-full pb-60 text-sm">
              <thead
                className=""
                style={{ backgroundColor: "#60b16b", color: "black" }}
              >
                <tr>
                  <th className="border px-3 py-2 text-left">Sn.</th>
                  {/* <th className="border px-3 py-2 text-left">Qty.</th> */}
                  <th className="border px-3 py-2 text-left">Free</th>
                  <th className="border px-3 py-2 text-left">Pack</th>
                  <th className="border px-3 py-2 text-left">Qty.</th>
                  <th className="border px-3 py-2 text-left min-w-[280px]">
                    Product
                  </th>
                  <th className="border px-3 py-2 text-left">Batch</th>
                  <th className="border px-3 py-2 text-left">Mg</th>
                  <th className="border px-3 py-2 text-left">Exp.</th>
                  <th className="border px-3 py-2 text-left">HSN</th>
                  <th className="border px-3 py-2 text-left">MRP</th>
                  <th className="border px-3 py-2 text-left">Rate</th>
                  {/* <th className="border px-3 py-2 text-left">Dis.</th>
                  <th className="border px-3 py-2 text-left">SGST</th>
                  <th className="border px-3 py-2 text-left">CGST</th> */}
                  <th className="border px-3 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billdata.tablets.map((t, i) => (
                  <tr key={t._id || i}>
                    <td className="px-3 pb-1">{i + 1}</td>
                    {/* <td className="px-3 pb-1 text-right">{t.lessquantity}</td> */}
                    <td className="px-3 pb-1 text-right">{t.free}</td>
                    <td className="px-3 pb-1">{t.packing}</td>
                    <td className="px-3 pb-1">{t.strips}</td>
                    <td className="px-3 pb-1 min-w-[280px]">{t.name}</td>
                    <td className="px-3 pb-1">{t.batch}</td>
                    <td className="px-3 pb-1">{t.mg}</td>
                    <td className="px-3 pb-1">{t.expiry}</td>
                    <td className="px-3 pb-1">{t.hsm}</td>
                    <td className="px-3 pb-1 text-right font-mono">
                      {t.mrp}
                    </td>
                    <td className="px-3 pb-1 text-right font-mono">
                      {Number(t.price)}
                    </td>
                    {/* <td className="px-3 pb-1 text-right font-mono">
                      {Number(t.discount).toFixed(2)}
                    </td>
                    <td className="px-3 pb-1">{t.sgst||"6"}</td>
                    <td className="px-3 pb-1">{t.cgst||"6"}</td> */}
                    <td className="px-3 pb-1 text-right font-mono">
                      {Number(t.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center mb-2">
            <div
              className="w-[60%]"
              // style={{
              //   minHeight: "220px", // adjust as needed
              //   display: "flex",
              //   flexDirection: "column",
              //   justifyContent: "flex-start",
              // }}
            >
              <table className=" min-w-full border pb-60 text-sm mt-3">
                <thead className="" style={{ backgroundColor: "yellowgreen" }}>
                  <tr>
                    <th className="border px-3 py-2 text-left">CLASS</th>
                    <th className="border px-3 py-2 text-left">TOTAL</th>
                    <th className="border px-3 py-2 text-left">SCH.</th>
                    <th className="border px-3 py-2 text-left">DISC.</th>
                    <th className="border px-3 py-2 text-left">CGST</th>
                    <th className="border px-3 py-2 text-left">SGST</th>
                    <th className="border px-3 py-2 text-left">TOTAL GST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1} className="">
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"GST 5.00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 5
                        ? billdata.discount
                          ? billdata.grandtotal.toFixed(2)
                          : billdata.grandtotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">{"00"}</td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 5
                        ? billdata.discount
                          ? ((billdata.grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 5
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 5
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 5
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={2} className="">
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"GST 12.00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 12
                        ? billdata.discount
                          ? billdata.grandtotal.toFixed(2)
                          : billdata.grandtotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">{"00"}</td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 12
                        ? billdata.discount
                          ? ((billdata.grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 12
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 12
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 12
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={3} className="">
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"GST 18.00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 18
                        ? billdata.discount
                          ? billdata.grandtotal.toFixed(2)
                          : billdata.grandtotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">{"00"}</td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 18
                        ? billdata.discount
                          ? ((billdata.grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 18
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 18
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 18
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={4} className="">
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"GST 28.00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 28
                        ? billdata.discount
                          ? billdata.grandtotal.toFixed(2)
                          : billdata.grandtotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">{"00"}</td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 28
                        ? billdata.discount
                          ? ((billdata.grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 28
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 28
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2">
                      {billdata.gst === 28
                        ? (
                            ((billdata.grandtotal -
                              ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={5} className="">
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"TOTAL"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? billdata.discount
                          ? grandtotal.toFixed(2)
                          : grandtotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {"00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? billdata.discount
                          ? ((grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandtotal -
                              ((grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandtotal -
                              ((grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandtotal -
                              ((grandtotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-[40%] space-y-3 pt-5">
            <div className="flex justify-between px-7 text-sm">
  <div className="font-medium">SUB TOTAL</div>
  <div>
    {billdata.discount && billdata.discount > 0
      ? (billdata.grandtotal - (billdata.grandtotal * billdata.discount) / 100).toFixed(2)
      : billdata.grandtotal.toFixed(2)}
  </div>
</div>
              <div className="flex justify-between  px-7 text-sm">
                <div className="font-medium">SGST PAYBLE</div>
                <div>
                  {billdata.gst === 5 ||
                  billdata.gst === 12 ||
                  billdata.gst === 18 ||
                  billdata.gst === 28
                    ? billdata.discount
                      ? (
                          ((billdata.grandtotal -
                            ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.cgst) /
                          100
                        ).toFixed(2)
                      : (
                          ((billdata.grandtotal -
                            ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.cgst) /
                          100
                        ).toFixed(2)
                    : "00"}
                </div>
              </div>
              <div className="flex justify-between  px-7 text-sm">
                <div className="font-medium">CGST PAYBLE</div>
                <div>
                  {billdata.gst === 5 ||
                  billdata.gst === 12 ||
                  billdata.gst === 18 ||
                  billdata.gst === 28
                    ? billdata.discount
                      ? (
                          ((billdata.grandtotal -
                            ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.sgst) /
                          100
                        ).toFixed(2)
                      : (
                          ((billdata.grandtotal -
                            ((billdata.grandtotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.sgst) /
                          100
                        ).toFixed(2)
                    : "00"}
                </div>
              </div>
              <div className="flex justify-between  px-7 text-sm ">
                <div className="font-medium">ADD/LESS</div>
                <div>
                  {billdata.gst === 5 ||
                  billdata.gst === 12 ||
                  billdata.gst === 18 ||
                  billdata.gst === 28
                    ? "00"
                    : "00"}
                </div>
              </div>
              <div className="flex justify-between px-7 text-sm " style={{}}>
                <div className="font-medium">CR/DR/NOTE</div>
                <div>
                  {billdata.gst === 5 ||
                  billdata.gst === 12 ||
                  billdata.gst === 18 ||
                  billdata.gst === 28
                    ? "00"
                    : "00"}
                </div>
              </div>
              {/* <div className="border-t-2"></div> */}
              <div
                className="w-[98%] ml-2 flex justify-between items-center font-bold border text-white bg-black px-4 py-3 "
                style={{
                  borderWidth: "2px",
                  fontSize: "16px",
                  backgroundColor: "skyblue",
                  color: "#00000",
                }}
              >
                <div style={{ marginTop: "-14px", color: "black" }}>
                  GRAND TOTAL
                </div>
                <div
                  style={{
                    marginTop: "-14px",
                    paddingRight: "8px",
                    color: "black",
                  }}
                >
                  ₹{Math.ceil(grandtotalWithTax).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="font-medium italic text-xs  pb-2">
            Rs&nbsp;
            {totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1)}{" "}
            Rupees Only
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-[40%] border p-2 align-top">
                  <div className="text-xl font-semibold italic underline mb-1">
                    Terms & Conditions
                  </div>
                  <div className="text-sm">
                    Goods once sold will not be taken back or exchanged.
                  </div>
                  <div className="text-sm">
                    Bills not paid by due date will attract 24% interest.
                  </div>
                </td>

                <td className="w-[30%] border p-2 align-top text-center">
                  <div className="text-xl font-semibold italic underline mb-10">
                    Receiver
                  </div>
                </td>

                <td className="w-[30%] border p-2 align-top">
                  <div className="text-sm font-semibold italic underline mb-2">
                    For SHRI JI ENTERPRISES
                  </div>
                  <div>
                    <img
                      src="/shivamsign.jpeg"
                      alt="sign"
                      className="w-42 h-16"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ✅ Hidden from PDF */}
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
  if (loggedIn && loginType !== "admin" && loginType !== "stockiest") {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }
  const isLoggedStatus = loggedIn;

  return {
    props: { isLoggedStatus },
  };
}
export default BillDetailPage;
