import React from 'react'
import { Dialog } from "@headlessui/react";

const PaymentConfirmationModal = ({selectedBill,confirmPayment,paymentModalOpen,setPaymentModalOpen,setPaymentType,paymentType,customAmount,setCustomAmount}) => {
  return (
    <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
  <div className="fixed inset-0 bg-black/50" />
  <div className="fixed inset-0 flex items-center justify-center">
    <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
      <Dialog.Title className="text-lg font-bold mb-4">Confirm Payment</Dialog.Title>
      <div className='pb-1 text-base font-semibold'>Bill No.: {selectedBill?.oldbillNo}</div>
      <div className="space-y-4 text-sm pt-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={paymentType === "full"}
            onChange={() => setPaymentType("full")}
          />
          <span>Pay Full Amount (₹{Math.ceil(selectedBill?.grandtotal-selectedBill?.amountPaid)})</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={paymentType === "partial"}
            onChange={() => setPaymentType("partial")}
          />
          <span>Pay Other Amount</span>
        </label>

        {paymentType === "partial" && (
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter custom amount"
            className="border p-2 w-full rounded"
          />
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
          onClick={() => setPaymentModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={confirmPayment}
        >
          Confirm Payment
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

  )
}

export default PaymentConfirmationModal