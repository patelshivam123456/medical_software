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

  // const handleDownloadPDF = async () => {
  //   setDownloading(true);
  
  //   const content = document.getElementById("bill-content");
  //   const table = content.querySelector("table");
  //   const rows = table?.querySelectorAll("tbody tr") || [];
  //   const totalRows = rows.length;
  //   const rowsPerPage = 14;
  //   const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  //   const generatePageClone = (pageIndex) => {
  //     const clone = content.cloneNode(true);
  //     clone.id = `clone-page-${pageIndex + 1}`;
  
  //     const tableClone = clone.querySelector("table");
  //     const bodyRows = tableClone.querySelectorAll("tbody tr");
  
  //     bodyRows.forEach((row, i) => {
  //       const startIndex = pageIndex * rowsPerPage;
  //       const endIndex = startIndex + rowsPerPage;
  //       if (i < startIndex || i >= endIndex) row.remove();
  //     });
  
  //     // Remove bottom content except on last page
  //     if (pageIndex !== totalPages - 1) {
  //       clone.querySelectorAll(".bottom-content").forEach(el => el.remove());
  //     }
  
  //     document.body.appendChild(clone);
  //     return clone;
  //   };
  
  //   const generateImageFromElement = async (element) => {
  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       backgroundColor: "#ffffff",
  //       ignoreElements: (el) => el.classList?.contains("no-print"),
  //     });
  //     return canvas.toDataURL("image/png");
  //   };
  
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  
  //   for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
  //     const pageClone = generatePageClone(pageIndex);
  //     const imgData = await generateImageFromElement(pageClone);
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
  //     if (pageIndex > 0) pdf.addPage();
  //     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
  //     pageClone.remove();
  //   }
  
  //   pdf.save(`Invoice-${billdata.billNo}.pdf`);
  //   setDownloading(false);
  // };
  
  



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
const handleDownloadPDF = async () => {
  setDownloading(true);

  const content = document.getElementById("bill-content");
  const table = content.querySelector("table");
  const rows = table?.querySelectorAll("tbody tr") || [];
  const totalRows = rows.length;
  const rowsPerPage = 14; // rows per page
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const generatePageClone = (pageIndex) => {
    const clone = content.cloneNode(true);
    clone.id = `clone-page-${pageIndex + 1}`;

    // Add Page number below invoice number (only on continued pages)
    const invoiceEl = clone.querySelector(".invoice-number");
    if (invoiceEl && totalPages > 1 && pageIndex > 0) {
      const pageEl = document.createElement("div");
      pageEl.style.fontSize = "20px";
      pageEl.style.marginTop = "2px";
      pageEl.style.fontWeight = "bold";
      pageEl.textContent = `Page No...${pageIndex + 1}`;
      invoiceEl.insertAdjacentElement("afterend", pageEl);
    }

    const tableClone = clone.querySelector("table");
    const bodyRows = tableClone.querySelectorAll("tbody tr");

    // Keep only the rows for this page
    bodyRows.forEach((row, i) => {
      const startIndex = pageIndex * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      if (i < startIndex || i >= endIndex) row.remove();
    });

    // Handle continuation pages
    if (pageIndex !== totalPages - 1) {
      const fillerRow = document.createElement("tr");
      fillerRow.style.height = "120px";

      const totalCols = tableClone.querySelector("thead tr").children.length;

      for (let c = 0; c < totalCols; c++) {
        const fillerCell = document.createElement("td");

        // Last two cells → only top & bottom border
        if (c >= totalCols - 2) {
          fillerCell.style.borderTop = "1px solid black";
          fillerCell.style.borderBottom = "1px solid black";
          fillerCell.style.borderLeft = "none";
          fillerCell.style.borderRight = "none";
          fillerCell.style.textAlign = "right";

          // Put continued text in last cell
          if (c === totalCols - 1) {
            // fillerCell.style.verticalAlign = "top";
            fillerCell.style.textAlign = "right";
            fillerCell.style.fontSize = "16px";
            fillerCell.style.fontWeight = "bold";
            fillerCell.style.marginTop = "50px";
            fillerCell.style.paddingRight = "20px";
            fillerCell.innerText = `Continued...${pageIndex + 2}`;
          } else {
            fillerCell.innerHTML = "&nbsp;";
          }
        } else {
          // Normal cells → full border
          fillerCell.style.borderTop = "1px solid black";
          fillerCell.style.borderLeft = "none";
          fillerCell.style.borderRight = "1px solid black";
          fillerCell.style.borderBottom = "1px solid black";
          fillerCell.innerHTML = "&nbsp;";
        }

        fillerRow.appendChild(fillerCell);
      }

      tableClone.querySelector("tbody").appendChild(fillerRow);

      // remove bottom content so it only appears on last page
      clone.querySelectorAll(".bottom-content").forEach((el) => el.remove());
    }

    document.body.appendChild(clone);
    return clone;
  };

  const generateImageFromElement = async (element) => {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      ignoreElements: (el) => el.classList?.contains("no-print"),
    });
    return canvas.toDataURL("image/png");
  };

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const pageClone = generatePageClone(pageIndex);
    const imgData = await generateImageFromElement(pageClone);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pageClone.remove();
  }

  pdf.save(`Invoice-SJ000${billdata.billNo}.pdf`);
  setDownloading(false);
};

  return (
    // <></>
    <>
      <Header isLoggedStatus={isLoggedCheck} />
      <div
        id="bill-content"
        className="relative  max-w-7xl mx-auto bg-white "
        style={{
          width: "1500px",
          minHeight: "700px",
          padding: "35px",
          boxSizing: "border-box",
          position: "relative",
          color: "black",
        }}
      >
        {/* ✅ Watermark logo */}
        <img
          src="/sriji.png"
          alt="Watermark"
          className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none w-[300px]"
          style={{ zIndex: 10 }}
        />
        <div className="mb-6 mt-5 no-print relative z-10 flex justify-end">
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
                    "Your Health, Our Priority"
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "-5px",fontSize:"14px" }}>
                Keshav Nagar, Fazullaganj
              </div>
              <div className="text-sm">Lucknow,Uttar Pradesh-226020</div>
              <div className="text-sm">Mobile Number: +91-9211037182</div>
              <div className="text-sm">Email: <span style={{color:"blue"}}>shrijienterprise352@gmail.com</span></div>
            </div>
            <div className="w-1/2">
              <div className="text-lg" style={{ fontWeight: "bold" }}>
                {billdata.clientName}
              </div>
              <div className="text-sm">{billdata.address1}</div>
              <div className="text-sm">{billdata.address2 || ""}</div>
              <div className="text-sm">{billdata.state + "," + billdata.pinCode}</div>
              <div className="text-sm">
                Mobile Number: +91-{billdata.mobile}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
              <div className="text-sm">GST: <span style={{fontWeight:"bold"}}>{billdata.gstIn}</span></div>
              {billdata.email&&<div className="text-sm">Email: <span style={{color:"blue"}}>{billdata.email}</span></div>}
              </div>
              {billdata.accountDetails&&<div className="text-sm">Account Details: {billdata.accountDetails}</div>}
              {billdata.accountDetails&&
              <div style={{display:"flex",justifyContent:"space-between"}}>
              <div className="text-sm">Account Number: {billdata.accountNumber}</div>
              <div className="text-sm">Ifsc Code: {billdata.accountIfscCode}</div>
              </div>
              }
              
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
                style={{ border:"1px skyblue",backgroundColor:"skyblue" }}
              >
                GST INVOICE
              </div>
              <div className="w-[65%] flex  justify-between pb-4 ">
                <div>
                  <div className="text-sm invoice-number">
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
              minHeight: "150px", // adjust as needed
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              // paddingBottom:"20px"
            }}
            id="bill-table"
          >
            <table className="min-w-full text-sm border-collapse">
              <thead
                className=""
                style={{ backgroundColor: "lightgray", color: "black" }}
              >
                <tr>
                  <th className="border-r px-3 py-2 text-left">Sn.</th>
                  {/* <th className="border-r px-3 py-2 text-left">Qty.</th> */}
                  {/* <th className="border-r px-3 py-2 text-left">Free</th> */}
                  <th className="border-r px-3 py-2 text-left">Pack</th>
                 
                  <th className="border-r px-3 py-2 text-left">Qty.</th>
                  <th className="border-r px-3 py-2 text-left min-w-[220px]">
                    Product
                  </th>
                  <th className="border-r px-3 py-2 text-left">Company</th>
                  <th className="border-r px-3 py-2 text-left">Batch</th>
                  <th className="border-r px-3 py-2 text-left">Mg</th>
                  <th className="border-r px-3 py-2 text-left">Exp.</th>
                  <th className="border-r px-3 py-2 text-left">HSN</th>
                  <th className="border-r px-3 py-2 text-left">MRP</th>
                  <th className="border-r px-3 py-2 text-left">Rate</th>
                  <th className="border-r px-3 py-2 text-left">Dis.</th>
                  <th className="border-r px-3 py-2 text-left">GST</th>
                  {/* <th className="border-r px-3 py-2 text-left">CGST</th> */}
                  <th className="border-r px-3 py-2 text-left w-[85px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billdata.tablets.map((t, i) => (
                  <tr key={t._id || i}>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{i + 1}</td>
                    {/* <td className="border-r px-3 pb-2 text-right">{t.lessquantity}</td> */}
                    {/* <td className="border-r px-3 pb-2 text-right">{t.free}</td> */}
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.packing}</td>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.strips}</td>
                    <td className="border-r px-3 pb-2 min-w-[220px]" style={{paddingBottom:"4px"}}>{t.name}</td>
                    <td className="border-r px-3 pb-2  min-w-[10px]" style={{paddingBottom:"4px"}}>{t.company}</td>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.batch}</td>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.mg==="NA"?"-":t?.mg?.split(" ")[0]+t?.mg?.split(" ")[1]}</td>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.expiry}</td>
                    <td className="border-r px-3 pb-2" style={{paddingBottom:"4px"}}>{t.hsm}</td>
                    <td className="border-r px-3 pb-2 text-right font-mono" style={{paddingBottom:"4px"}}>
                      {t.mrp}
                    </td>
                    <td className="border-r px-3 pb-2 text-right font-mono" style={{paddingBottom:"4px"}}>
                      {Number(t.price)}
                    </td>
                    <td className="border-r px-3 pb-2 text-right font-mono">
                      {Number(t.discount).toFixed(2)}
                    </td>
                    <td className="border-r px-3 pb-2">{t.gst}</td>
                    {/* <td className="border-r px-3 pb-2">{t.cgst||"6"}</td> */}
                    <td className="border-r px-3 pb-2 text-right font-mono w-[85px]">
                      {Number(t.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
                 {billdata.tablets.length < 14 &&
    Array.from({ length: 14 - billdata.tablets.length }).map((_, idx) => (
      <tr key={"empty-" + idx}>
        {Array.from({ length: 14 }).map((_, colIdx) => (
          <td key={colIdx} className="border-r px-3">&nbsp;</td>
        ))}
      </tr>
    ))}
              </tbody>
            </table>
          </div>
          <div className="bottom-content">
          <div className="flex items-center mb-2" >
            <div
              className="w-[60%]"
             
            >
              <table className=" min-w-full border pb-60 text-sm mt-3">
                <thead className="" style={{  }}>
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
                          ? billdata.grandtotal.toFixed(2)
                          : billdata.grandtotal.toFixed(2)
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
                          ? ((billdata.grandtotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
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
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
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
                    <td className="border px-3 pt-1 pb-2 font-semibold">
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
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
                className="w-[98%] ml-2 flex justify-between items-center font-bold border text-white bg-black px-4 py-4 "
                style={{
                  border: "1px solid black",
                  fontSize: "16px",
                  backgroundColor: "skyblue",
                  // color: "#00000",
                }}
              >
                <div style={{ marginTop: "-20px", color: "black" }}>
                  GRAND TOTAL
                </div>
                <div
                  style={{
                    marginTop: "-20px",
                    paddingRight: "8px",
                    color: "black",
                  }}
                >
                  ₹{Math.ceil(grandtotalWithTax).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="font-medium italic text-xs  pb-2" >
            Rs&nbsp;
            {totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1)}{" "}
            Rupees Only
          </div>
          <table className="w-full" >
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

                <td className="w-[30%] border p-2 align-top text-center">
                  <div className="text-sm font-semibold italic underline mb-2">
                    For SHRI JI ENTERPRISES
                  </div>
                  <div>
                    {/* <img
                      src="/shivamsign.jpeg"
                      alt="sign"
                      className="w-42 h-16"
                    /> */}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
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
