"use client";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { toWords } from "number-to-words";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import Header from "@/components/Header";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const BillDetailPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [grandTotal, setGrandTotal] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [isLoggedCheck, setIsLoggedCheck] = useState("");
  const [showStamp, setShowStamp] = useState(false);
  const [showGstDL,setShowGstDL] = useState(false)

  const { data, error } = useSWR(
    () => (id ? `/api/bills/${id}` : null),
    fetcher
  );
  const billdata = data?.bill;
  useEffect(() => {
    if (billdata?.tablets?.length) {
      const total = billdata.tablets.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      );
      setGrandTotal(total);
    }
  }, [billdata]);
  useEffect(() => {
    if (props.isLoggedStatus) {
      setIsLoggedCheck(props.isLoggedStatus);
    }
  }, []);

  if (error) return <div className="p-6">❌ Failed to load bill</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const discountAmount = billdata.discount
    ? (grandTotal * billdata.discount) / 100
    : 0;
  const subTotal = grandTotal - discountAmount;

  const sgstAmount = billdata.gst ? (subTotal * billdata.sgst) / 100 : 0;
  const cgstAmount = billdata.gst ? (subTotal * billdata.cgst) / 100 : 0;

  const grandTotalWithTax = subTotal + sgstAmount + cgstAmount;

  const roundedGrandTotal = Math.ceil(grandTotalWithTax);
  const totalInWords = toWords(roundedGrandTotal);

  // const handleDownloadPDF = async () => {
  //   setDownloading(true);
  
  //   const content = document.getElementById("bill-content");
  //   const table = content.querySelector("table");
  //   const rows = table?.querySelectorAll("tbody tr") || [];
  //   const totalRows = rows.length;
  //   const rowsPerPage = 14; // adjust if needed
  //   const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  //   const generatePageClone = (pageIndex) => {
  //     const clone = content.cloneNode(true);
  //     clone.id = `clone-page-${pageIndex + 1}`;

  //     const invoiceEl = clone.querySelector(".invoice-number");
  // if (invoiceEl && totalPages > 1 && pageIndex > 0) {
  //   const pageEl = document.createElement("div");
  //   pageEl.style.fontSize = "20px";
  //   pageEl.style.marginTop = "2px";
  //   pageEl.style.fontWeight = "bold";
  //   pageEl.textContent = `Page No...${pageIndex + 1}`;
  //   invoiceEl.insertAdjacentElement("afterend", pageEl);
  // }
  
  //     const tableClone = clone.querySelector("table");
  //     const bodyRows = tableClone.querySelectorAll("tbody tr");
  
  //     bodyRows.forEach((row, i) => {
  //       const startIndex = pageIndex * rowsPerPage;
  //       const endIndex = startIndex + rowsPerPage;
  //       if (i < startIndex || i >= endIndex) row.remove();
  //     });

  //     if (pageIndex !== totalPages - 1) {
  //       const continuedDiv = document.createElement("div");
  //       continuedDiv.style.textAlign = "right";
  //       continuedDiv.style.marginTop = "10px";
  //       continuedDiv.style.fontSize = "20px";
  //       continuedDiv.style.fontWeight = "bold";
  //       continuedDiv.innerText = `Continued...${pageIndex + 2}`;
  //       clone.appendChild(continuedDiv);
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
  
  //   pdf.save(`Invoice-SJ000${billdata.billNo}.pdf`);
  //   setDownloading(false);
  // };
  
  const handleDownloadPDF = async () => {
    setDownloading(true);
  
    const content = document.getElementById("bill-content");
    const table = content.querySelector("table");
    const rows = table?.querySelectorAll("tbody tr") || [];
    const totalRows = rows.length;
    const rowsPerPage = 14; // rows per page
    const totalPages = Math.ceil(totalRows / rowsPerPage);
  
    // const generatePageClone = (pageIndex) => {
    //   const clone = content.cloneNode(true);
    //   clone.id = `clone-page-${pageIndex + 1}`;
  
    //   // Add Page number below invoice number (only on continued pages)
    //   const invoiceEl = clone.querySelector(".invoice-number");
    //   if (invoiceEl && totalPages > 1) {
    //     const pageEl = document.createElement("div");
    //     pageEl.style.fontSize = "20px";
    //     pageEl.style.textAlign = "right";
    //     pageEl.style.marginTop = "2px";
    //     pageEl.style.marginBottom = "2px";
    //     pageEl.style.fontWeight = "bold";
    //     pageEl.textContent = `Page No...${pageIndex + 1}`;
    //     invoiceEl.insertAdjacentElement("afterend", pageEl);
    //   }
  
    //   const tableClone = clone.querySelector("table");
    //   const bodyRows = tableClone.querySelectorAll("tbody tr");
  
    //   // Keep only the rows for this page
    //   bodyRows.forEach((row, i) => {
    //     const startIndex = pageIndex * rowsPerPage;
    //     const endIndex = startIndex + rowsPerPage;
    //     if (i < startIndex || i >= endIndex) row.remove();
    //   });
  
    //   // Handle continuation pages
    //   if (pageIndex !== totalPages - 1) {
    //     const fillerRow = document.createElement("tr");
    //     fillerRow.style.height = "100px";
  
    //     const totalCols = tableClone.querySelector("thead tr").children.length;
  
    //     for (let c = 0; c < totalCols; c++) {
    //       const fillerCell = document.createElement("td");
  
    //       // Last two cells → only top & bottom border
    //       if (c >= totalCols - 2) {
    //         fillerCell.style.borderTop = "1px solid black";
    //         fillerCell.style.borderBottom = "1px solid black";
    //         fillerCell.style.borderLeft = "none";
    //         fillerCell.style.borderRight = "none";
    //         fillerCell.style.textAlign = "right";
  
    //         // Put continued text in last cell
    //         if (c === totalCols - 1) {
    //           // fillerCell.style.verticalAlign = "top";
    //           fillerCell.style.textAlign = "right";
    //           fillerCell.style.fontSize = "16px";
    //           fillerCell.style.fontWeight = "bold";
    //           fillerCell.style.marginTop = "50px";
    //           fillerCell.style.paddingRight = "20px";
    //           fillerCell.innerText = `Continued...${pageIndex + 2}`;
    //         } else {
    //           fillerCell.innerHTML = "&nbsp;";
    //         }
    //       } else {
    //         // Normal cells → full border
    //         fillerCell.style.borderTop = "1px solid black";
    //         fillerCell.style.borderLeft = "none";
    //         fillerCell.style.borderRight = "1px solid black";
    //         fillerCell.style.borderBottom = "1px solid black";
    //         fillerCell.innerHTML = "&nbsp;";
    //       }
  
    //       fillerRow.appendChild(fillerCell);
    //     }
  
    //     tableClone.querySelector("tbody").appendChild(fillerRow);
  
    //     // remove bottom content so it only appears on last page
    //     clone.querySelectorAll(".bottom-content").forEach((el) => el.remove());
    //   }
  
    //   document.body.appendChild(clone);
    //   return clone;
    // };
    const generatePageClone = (pageIndex) => {
      const clone = content.cloneNode(true);
      clone.id = `clone-page-${pageIndex + 1}`;
    
      // Add Page number below invoice number (only on continued pages)
      const invoiceEl = clone.querySelector(".invoice-number");
      if (invoiceEl && totalPages > 1) {
        const pageEl = document.createElement("div");
        pageEl.style.fontSize = "20px";
        pageEl.style.textAlign = "right";
        pageEl.style.marginTop = "2px";
        pageEl.style.marginBottom = "2px";
        pageEl.style.fontWeight = "bold";
        pageEl.textContent = `Page No...${pageIndex + 1}`;
        invoiceEl.insertAdjacentElement("afterend", pageEl);
      }
      else {
        const pageEl = document.createElement("div");
        pageEl.style.fontSize = "20px";
        pageEl.style.textAlign = "right";
        pageEl.style.marginTop = "2px";
        pageEl.style.marginBottom = "2px";
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
    
      // ✅ add filler row for min height only from 2nd page onward
      if (pageIndex > 0) {
        const tbody = tableClone.querySelector("tbody");
        const fillerRow = document.createElement("tr");
        const totalCols = tableClone.querySelector("thead tr").children.length;
      
        for (let c = 0; c < totalCols; c++) {
          const fillerCell = document.createElement("td");
          fillerCell.style.height = "180px";
          fillerCell.innerHTML = "&nbsp;";
      
          // All columns except last get borderRight
          if (c < totalCols - 1) {
            fillerCell.style.borderRight = "1px solid black";
          } else {
            fillerCell.style.borderRight = "none";
          }
      
          fillerRow.appendChild(fillerCell);
        }
      
        tbody.appendChild(fillerRow);
      }
      
    
      // Handle continuation pages
      if (pageIndex !== totalPages - 1) {
        const fillerRow = document.createElement("tr");
        fillerRow.style.height = "150px";
    
        const totalCols = tableClone.querySelector("thead tr").children.length;
    
        for (let c = 0; c < totalCols; c++) {
          const fillerCell = document.createElement("td");
    
          if (c >= totalCols - 2) {
            fillerCell.style.borderTop = "1px solid black";
            fillerCell.style.borderBottom = "1px solid black";
            fillerCell.style.borderLeft = "none";
            fillerCell.style.borderRight = "none";
            fillerCell.style.textAlign = "right";
    
            if (c === totalCols - 1) {
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
  
    pdf.save(`${billdata.clientName}.pdf`);
    setDownloading(false);
  };
  
  // const calculateStrips = (packing, quantity) => {
  //   if (!packing || !quantity) return "0";
  
  //   const parts = packing.split("*");
  //   if (parts.length !== 2) return "0";
  
  //   const multiplier = parseInt(parts[1], 10);
  //   if (isNaN(multiplier) || multiplier === 0) return "0";
  
  //   const fullStrips = Math.floor(quantity / multiplier);
  //   const remaining = quantity % multiplier;
  
  //   return remaining === 0 ? `${fullStrips}` : `${fullStrips}*${remaining}`;
  // };

  return (
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
        <img
          src="/sriji.png"
          alt="Watermark"
          className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none w-[300px]"
          style={{ zIndex: 10 }}
        />
        <div className="mb-6 mt-6 no-print relative z-10 flex gap-3 justify-end invoice-number">
        <div>
          <input
          type="checkbox"
          checked={showGstDL}
          onChange={(e) => setShowGstDL(e.target.checked)}
        />
          <span>Show Gst</span>
          </div>
          <div>
          <input
          type="checkbox"
          checked={showStamp}
          onChange={(e) => setShowStamp(e.target.checked)}
        />
          <span>Show Stamp Image</span>
          </div>
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
        <div className="relative z-10 border px-2 py-2">
          <div className="flex">
            <div className="w-[65%]">
              <div
                className="gap-1"
                style={{ display: "flex", alignItems: "center",marginTop:"-10px" }}
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
                Keshav Nagar, Fazullaganj, Lucknow, Uttar Pradesh-226020
              </div>
              <div className="flex items-center gap-3">
              <div className="text-sm">Mobile Number: +91-9211037182</div>
              <div>|</div>
              <div className="text-sm">Email: <span style={{color:"blue"}}>shrijienterprise352@gmail.com</span></div>
              </div>
             {showGstDL&&<div className="flex items-center gap-3"> <div className="text-sm">GSTIN: <span style={{fontWeight:"bold"}}>09DTLPB7433P1Z1</span></div>
             <div>|</div>
                          <div className="text-sm">D L No.: <span style={{}}>UP3220B003299, UP3221B003283</span></div>
                          </div>}
            </div>
            <div className="w-[35%]">
              <div className="text-lg" style={{ fontWeight: "bold" }}>
                {billdata.title + " " + billdata.clientName}
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
                PAYMENT - {billdata.paymenttype==="cod"?"Cash on Delivery":billdata.paymenttype}
              </div>
              {billdata.orderid&&<div className="text-sm">
                Order_Id: {billdata.orderid}
              </div>}
            </div>
            <div className="w-[65%] flex gap-4 ">
              <div
                className="w-[35%] text-xl font-semibold text-center pb-4 pt-0 px-2"
                style={{ backgroundColor: "#cfecf7" }}
              >
                GST INVOICE
              </div>
              <div className="w-[65%] flex  justify-between pb-4 ">
                <div>
                  <div className="text-sm">
                    Invoice No.: SJ000{billdata.billNo}
                  </div>
                  {/* <div className="text-sm">
                    Sales man: {billdata.salesperson}
                  </div> */}
                </div>
                <div>
                  <div className="text-sm">
                    Date:{" "}
                    {billdata?.invoiceDate
                      ? <>{new Date(billdata.invoiceDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })+" "+
                        new Date(billdata.updatedAt).toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).toUpperCase()
                        }
                        </>
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
                    Due Date:{" "}
                    {billdata?.createdAt
                      ? new Date(billdata.invoiceDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div
  className="relative border-l border-r border-b"
  style={{
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // paddingBottom: "20px",
  }}
  id="bill-table"
>
  <table className="min-w-full text-sm border-collapse">
    <thead style={{ backgroundColor:"#cfecf7", color: "black" }}>
      <tr>
        <th className="border-r border-b px-3 pb-4 text-left">Sn.</th>
        <th className="border-r border-b px-3 pb-4 text-left">Pack</th>
        <th className="border-r border-b px-3 pb-4 text-left">Qty</th>
        <th className="border-r border-b px-3 pb-4 text-left min-w-[250px]">Product</th>
        <th className="border-r border-b px-3 pb-4 text-left">Batch</th>
        <th className="border-r border-b px-3 pb-4 text-left">Mg</th>
        <th className="border-r border-b px-3 pb-4 text-left">Exp.</th>
        <th className="border-r border-b px-3 pb-4 text-left">HSN</th>
        <th className="border-r border-b px-3 pb-4 text-left">DIS.(%)</th>
        <th className="border-r border-b px-3 pb-4 text-left">GST(%)</th>
        <th className="border-r border-b px-3 pb-4" style={{textAlign:"right"}}>MRP</th>
        <th className="border-r border-b px-3 pb-4" style={{textAlign:"right"}}>Rate</th>
        <th className="border-r border-b px-3 pb-4 w-[100px]" style={{textAlign:"right"}}>Amount</th>
      </tr>
    </thead>

    <tbody>
      {billdata.tablets.map((t, i) => (
        <tr key={t._id || i} className={t.strips === 0 ? "no-print" : ""}>
          <td className="border-r px-3 pb-1 text-sm">{i + 1}</td>
          <td className="border-r px-3 pb-1 text-sm">{t.packing}</td>
          <td className="border-r px-3 pb-1 text-sm">{t.strips}</td>
          <td className="border-r px-3 pb-1 min-w-[250px] text-sm">
            {t.category === "INJ"
              ? t.category + " " + t?.name?.toUpperCase()
              : t?.name?.toUpperCase()}
          </td>
          <td className="border-r px-3 pb-1 text-sm">{t.batch}</td>
          <td className="border-r px-3 pb-1 text-sm">
            {t?.mg === "NA"
              ? "-"
              : t?.mg?.split(" ")[0] + t?.mg?.split(" ")[1]}
          </td>
          <td className="border-r px-3 pb-1 text-sm">{t.expiry}</td>
          <td className="border-r px-3 pb-1 text-sm">{t.hsm}</td>
          <td className="border-r px-3 pb-1 text-sm">{t.discount}</td>
          <td className="border-r px-3 pb-1 text-sm">{t.gst}</td>
          <td className="border-r px-3 pb-1 text-right font-mono text-sm">
            {Number(t.price).toFixed(2)}
          </td>
          <td className="border-r px-3 pb-1 text-right font-mono text-sm">
            {Number(t.rate).toFixed(2)}
          </td>
          <td className=" px-3 pb-1 text-right font-mono text-sm w-[100px]">
            {Number(t.total).toFixed(2)}
          </td>
        </tr>
      ))}

      {/* Fill Empty Rows up to 15 */}
      {billdata.tablets.length < 14 &&
    Array.from({ length: 14 - billdata.tablets.length }).map((_, idx) => (
      <tr key={"empty-" + idx}>
        {Array.from({ length: 12 }).map((_, colIdx) => (
          <td key={colIdx} className="border-r px-3">&nbsp;</td>
        ))}
      </tr>
    ))}
    </tbody>
  </table>
</div>

          <div className="bottom-content">
          <div className="flex items-center mb-2">
            {/* <div className="w-[60%]"></div> */}
            <div
              className="w-[60%]"
              // style={{
              //   minHeight: "220px", // adjust as needed
              //   display: "flex",
              //   flexDirection: "column",
              //   justifyContent: "flex-start",
              // }}
            >
              <table className=" min-w-full border pb-60 text-sm mt-4">
                <thead className="">
                  <tr>
                    <th className="border-r border-b px-3 pb-3 text-left">CLASS</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>TOTAL</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>SCH.</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>DISC.</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>CGST</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>SGST</th>
                    <th className="border-r border-b px-3 pb-3" style={{textAlign:"right"}}>TOTAL GST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1} className="">
                    <td className="border-r border-b px-3  pb-3 font-black">
                      {"GST 5.00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 5
                        ? billdata.discount
                          ? grandTotal.toFixed(2)
                          : grandTotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">{"00"}</td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 5
                        ? billdata.discount
                          ? ((grandTotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 5
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 5
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 5
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={2} className="">
                    <td className="border-r border-b px-3  pb-3 font-black">
                      {"GST 12.00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 12
                        ? billdata.discount
                          ? grandTotal.toFixed(2)
                          : grandTotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">{"00"}</td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 12
                        ? billdata.discount
                          ? ((grandTotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 12
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 12
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 12
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={3} className="">
                    <td className="border-r border-b px-3  pb-3 font-black">
                      {"GST 18.00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 18
                        ? billdata.discount
                          ? grandTotal.toFixed(2)
                          : grandTotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">{"00"}</td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 18
                        ? billdata.discount
                          ? ((grandTotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 18
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 18
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 18
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={4} className="">
                    <td className="border-r border-b px-3  pb-3 font-black">
                      {"GST 28.00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 28
                        ? billdata.discount
                          ? grandTotal.toFixed(2)
                          : grandTotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">{"00"}</td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 28
                        ? billdata.discount
                          ? ((grandTotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r border-b text-right px-3  pb-3">
                      {billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.gst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                  </tr>
                  <tr key={5} className="">
                    <td className="border-r px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {"TOTAL"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? billdata.discount
                          ? grandTotal.toFixed(2)
                          : grandTotal.toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {"00"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? billdata.discount
                          ? ((grandTotal * billdata.discount) / 100).toFixed(2)
                          : "00"
                        : "00"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.sgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
                                2
                              )) *
                              billdata.cgst) /
                            100
                          ).toFixed(2)
                        : "00"}
                    </td>
                    <td className="border-r text-right  px-3  pb-3 font-semibold" style={{backgroundColor:"#cfecf7"}}>
                      {billdata.gst === 5 ||
                      billdata.gst === 12 ||
                      billdata.gst === 18 ||
                      billdata.gst === 28
                        ? (
                            ((grandTotal -
                              ((grandTotal * billdata.discount) / 100).toFixed(
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
            <div className="w-[40%] space-y-3 pt-2 mt-3">
              <div className="flex justify-between px-7 text-sm">
                <div className="font-medium">SUB TOTAL</div>
                <div>
                  {billdata.gst === 5 ||
                  billdata.gst === 12 ||
                  billdata.gst === 18 ||
                  billdata.gst === 28
                    ? billdata.discount
                      ? (
                          grandTotal -
                          ((grandTotal * billdata.discount) / 100).toFixed(2)
                        ).toFixed(2)
                      : grandTotal.toFixed(2)
                    : grandTotal.toFixed(2)}
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
                          ((grandTotal -
                            ((grandTotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.cgst) /
                          100
                        ).toFixed(2)
                      : (
                          ((grandTotal -
                            ((grandTotal * billdata.discount) / 100).toFixed(
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
                          ((grandTotal -
                            ((grandTotal * billdata.discount) / 100).toFixed(
                              2
                            )) *
                            billdata.sgst) /
                          100
                        ).toFixed(2)
                      : (
                          ((grandTotal -
                            ((grandTotal * billdata.discount) / 100).toFixed(
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
              {/* <div className="flex justify-between px-7 text-sm " style={{}}>
                <div className="font-medium">Discount(%)</div>
                <div>
                  {billdata.discount?billdata.discount:"00"}
                </div>
              </div> */}
              <div
                className="w-[101.7%] flex justify-between items-center font-bold text-white bg-black px-4 py-[11px] "
                style={{ backgroundColor: "#cfecf7",borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black" }}
              >
                <div style={{ marginTop: "-14px", color: "black",paddingLeft:"10px" }}>
                  GRAND TOTAL
                </div>
                <div
                  style={{
                    marginTop: "-14px",
                    paddingRight: "19px",
                    color: "black",
                  }}
                >
                  ₹{Math.ceil(grandTotalWithTax).toFixed(2)}
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

                <td className="w-[30%] border p-2 align-top text-center relative">
                  <div className={`text-sm font-semibold italic underline mb-2`}
                  style={showStamp?{color:"lightgray"}:{color:"black"}}>
                    For SHRI JI ENTERPRISES
                  </div>
                  {showStamp&&<div className="w-[170px] h-[10px] absolute top-[10px] left-[60px]">
                    <img
                      src="/stamp1.png"
                      alt="sign"
                      
                    />
                  </div>}
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
  if (loggedIn && loginType !== "admin" && loginType !== "sales") {
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
