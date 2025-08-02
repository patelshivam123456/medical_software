import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toWords } from "number-to-words";
import { XCircleIcon } from "@heroicons/react/24/outline";

const CreateOnlineBillModal = ({ data,onClick,date }) => {
  const [downloading, setDownloading] = useState(false);

  // Construct billdata from data prop
  const billdata = {
    ...data,
    clientName: data.personalDetails?.name || "",
    address1: data.personalDetails?.address1 || "",
    address2: data.personalDetails?.address2 || "",
    mobile: data.personalDetails?.mobile || "",
    state: data.personalDetails?.state || "",
    pinCode: data.personalDetails?.pincode || "",
    salesperson: data.personalDetails?.salesperson||"",
    paymenttype: data.paymentDetails?.type || "N/A",
    gst: 12, // static or make dynamic based on product if needed
    discount: 0, // static unless available in data
    cgst: data.cgst ? 6 : 0,
    sgst: data.sgst ? 6 : 0,
    tablets: data.products.map((item) => ({
      ...item,
      lessquantity: item.quantity,
      free: 0,
      packing: item.packaging,
      strips: 0,
      rate: item.price,
      discount: 0,
      hsm: "",
      total: item.total,
    })),
  };

  const grandTotal = data.grandTotal || 0;
  const grandTotalWithTax = data.finalAmount || grandTotal;
  const totalInWords = toWords(Math.ceil(grandTotalWithTax));

  const handleDownloadPDF = () => {
    setDownloading(true);
    const input = document.getElementById("bill-content");

    html2canvas(input, {
      backgroundColor: "#ffffff",
      scale: 2,
      ignoreElements: (el) => el.classList?.contains("no-print"),
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-SJ000${billdata.billNo}.pdf`);
      setDownloading(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-10 overflow-auto">
      <div className="bg-white w-full max-w-7xl p-6 rounded shadow relative">
        <div
          id="bill-content"
          className="relative p-6 mx-auto bg-white overflow-x-auto"
          style={{
            width: "100%",         // responsive width
            maxWidth: "1200px",    // keep within screen
            minHeight: "700px",
            padding: "40px",
            boxSizing: "border-box",
            color: "black",
          }}
        >
          {/* Watermark */}
          <img
            src="/sriji.png"
            alt="Watermark"
            className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none w-[300px]"
            style={{ zIndex: 10 }}
          />

          {/* Download Button */}
          <div className="mb-6 -mt-6 no-print relative z-10 gap-4 flex justify-end">
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "📥 Download PDF"}
            </button>
            <div onClick={onClick} className="cursor-pointer"><XCircleIcon className="w-8 h-8 "/></div>
          </div>

          {/* Header Info */}
          <div className="relative z-10 border px-2 py-2">
            <div className="flex">
              {/* Company Info */}
              <div className="w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <img src="/sriji.png" alt="logo" className="h-12 w-12" />
                  <div>
                    <div className="text-lg font-bold">SHRI JI ENTERPRISES</div>
                    <div className="text-xs font-semibold italic -mt-1">
                      GST Not Applicable
                    </div>
                  </div>
                </div>
                <div>Pratap market, Kamla Market, Aminabad Rd</div>
                <div>Aminabad, Lucknow, Uttar Pradesh - 122001</div>
                <div className="text-base">Mobile: +91-8707868591</div>
              </div>

              {/* Client Info */}
              <div className="w-1/2">
                <div className="text-lg font-bold">
                  {billdata.clientName}
                </div>
                <div>{billdata.address1}</div>
                <div>{billdata.address2}</div>
                <div>{`${billdata.state}, ${billdata.pinCode}`}</div>
                <div className="text-base">
                  Mobile: +91-{billdata.mobile}
                </div>
                <div>GST: N/A</div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex gap-2 border mt-2 px-3">
                <div>
              <div className="w-[35%] text-sm">
                Payment Method: {billdata.paymenttype}
              </div>
              <div className="w-[35%] text-sm">
                Order Id: {billdata.orderid}
              </div>
              </div>
              <div className="w-[65%] flex gap-4">
                <div
                  className="w-[35%] text-xl font-semibold text-center pb-4 pt-2 px-2"
                  style={{ backgroundColor: "#f5b13d" }}
                >
                  GST INVOICE
                </div>
                <div className="w-[65%] flex justify-between pb-4 text-sm">
                  <div>
                    <div>Invoice No.: SJ000{billdata.billNo}</div>
                    <div>Salesman: {billdata.salesperson}</div>
                  </div>
                  <div>
                    <div>
                      Date:&nbsp;
                      {new Date(data.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div>
                      Dispatch Date:&nbsp;
                      {date}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="relative border mt-4">
              <table className="min-w-full text-sm border-collapse">
                <thead style={{ backgroundColor: "#60b16b", color: "black" }}>
                  <tr>
                    <th className="border px-2 py-1">Sn.</th>
                    <th className="border px-2 py-1">Qty.</th>
                    <th className="border px-2 py-1">Free</th>
                    <th className="border px-2 py-1">Pack</th>
                    <th className="border px-2 py-1">Strips</th>
                    <th className="border px-2 py-1">Product</th>
                    <th className="border px-2 py-1">Batch</th>
                    <th className="border px-2 py-1">Exp.</th>
                    <th className="border px-2 py-1">HSN</th>
                    <th className="border px-2 py-1">MRP</th>
                    <th className="border px-2 py-1">Rate</th>
                    <th className="border px-2 py-1">Dis.</th>
                    <th className="border px-2 py-1">SGST</th>
                    <th className="border px-2 py-1">CGST</th>
                    <th className="border px-2 py-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billdata.tablets.map((t, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{i + 1}</td>
                      <td className="border px-2 py-1 text-right">{t.lessquantity}</td>
                      <td className="border px-2 py-1 text-right">{t.free}</td>
                      <td className="border px-2 py-1">{t.packing}</td>
                      <td className="border px-2 py-1">{t.strips}</td>
                      <td className="border px-2 py-1">{t.name}</td>
                      <td className="border px-2 py-1">{t.batch}</td>
                      <td className="border px-2 py-1">{t.expiry}</td>
                      <td className="border px-2 py-1">{t.hsm}</td>
                      <td className="border px-2 py-1 text-right">{Number(t.mrp).toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{Number(t.rate).toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{Number(t.discount).toFixed(2)}</td>
                      <td className="border px-2 py-1">{billdata.sgst}</td>
                      <td className="border px-2 py-1">{billdata.cgst}</td>
                      <td className="border px-2 py-1 text-right">{Number(t.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total Footer */}
            <div className="flex items-center mb-2">
      <div className="w-[60%]">
        <table className="min-w-full border pb-60 text-sm mt-3">
          <thead style={{ backgroundColor: "yellowgreen" }}>
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
            <tr>
              <td className="border px-3 pt-1 pb-2 font-semibold">GST 12.00</td>
              <td className="border px-3 pt-1 pb-2">{grandTotal.toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2">00</td>
              <td className="border px-3 pt-1 pb-2">00</td>
              <td className="border px-3 pt-1 pb-2">{((grandTotal * billdata.cgst) / 100).toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2">{((grandTotal * billdata.sgst) / 100).toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2">{((grandTotal * billdata.gst) / 100).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-3 pt-1 pb-2 font-semibold">TOTAL</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">{grandTotal.toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">00</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">00</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">{((grandTotal * billdata.cgst) / 100).toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">{((grandTotal * billdata.sgst) / 100).toFixed(2)}</td>
              <td className="border px-3 pt-1 pb-2 font-semibold">{((grandTotal * billdata.gst) / 100).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-[40%] space-y-3 pt-5">
        <div className="flex justify-between px-7 text-sm">
          <div className="font-medium">SUB TOTAL</div>
          <div>{grandTotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between  px-7 text-sm">
          <div className="font-medium">SGST PAYBLE</div>
          <div>{((grandTotal * billdata.cgst) / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between  px-7 text-sm">
          <div className="font-medium">CGST PAYBLE</div>
          <div>{((grandTotal * billdata.sgst) / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between  px-7 text-sm">
          <div className="font-medium">ADD/LESS</div>
          <div>00</div>
        </div>
        <div className="flex justify-between px-7 text-sm">
          <div className="font-medium">CR/DR/NOTE</div>
          <div>00</div>
        </div>
        <div
          className="w-[98%] ml-2 flex justify-between items-center font-bold border text-white bg-black px-4 py-3"
          style={{
            borderWidth: "2px",
            fontSize: "16px",
            backgroundColor: "skyblue",
            color: "#00000",
          }}
        >
          <div style={{ marginTop: "-14px", color: "black" }}>GRAND TOTAL</div>
          <div style={{ marginTop: "-14px", paddingRight: "8px", color: "black" }}>
            ₹{Math.ceil(grandTotalWithTax).toFixed(2)}
          </div>
        </div>
      </div>
    </div>

            {/* Total in Words */}
            <div className="font-medium italic text-xs pt-2">
              Rs {totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1)} Rupees Only
            </div>

            {/* Signature Section */}
            <table className="w-full mt-4 border">
              <tbody>
                <tr>
                  <td className="w-[40%] border p-2 align-top">
                    <div className="text-xl font-semibold italic underline mb-1">
                      Terms & Conditions
                    </div>
                    <div className="text-sm">Goods once sold will not be taken back or exchanged.</div>
                    <div className="text-sm">Bills not paid by due date will attract 24% interest.</div>
                  </td>
                  <td className="w-[30%] border p-2 align-top text-center">
                    <div className="text-xl font-semibold italic underline mb-10">Receiver</div>
                  </td>
                  <td className="w-[30%] border p-2 align-top">
                    <div className="text-sm font-semibold italic underline mb-2">
                      For SHRI JI ENTERPRISES
                    </div>
                    <img src="/shivamsign.jpeg" alt="sign" className="w-42 h-16" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOnlineBillModal;
