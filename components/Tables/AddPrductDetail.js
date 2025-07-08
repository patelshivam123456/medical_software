import React from 'react'

const AddPrductDetail = (props) => {
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-3 py-2 text-left">#</th>
          <th className="border px-3 py-2 text-left">Name</th>
          <th className="border px-3 py-2 text-left">Quantity</th>
          <th className="border px-3 py-2 text-left">Packing</th>
          <th className="border px-3 py-2 text-left">Batch</th>
          <th className="border px-3 py-2 text-left">Expiry</th>
          <th className="border px-3 py-2 text-left">MRP</th>
          <th className="border px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.tablets.map((t, i) => (
          <tr key={t._id || i}>
            <td className="border px-3 py-2">{i + 1}</td>
            <td className="border px-3 py-2">{t.name}</td>
            <td className="border px-3 py-2">{t.quantity}</td>
            <td className="border px-3 py-2">{t.packaging}</td>
            <td className="border px-3 py-2">{t.batch}</td>
            <td className="border px-3 py-2">{t.expiry}</td>
            <td className="border px-3 py-2">₹{t.price}</td>
            <td className="border px-3 py-2 space-x-2">
              <button
                onClick={() => props.handleEdit(t)}
                className="text-blue-600 underline"
              >
                Edit
              </button>
              <button
                onClick={() => props.handleDelete(t._id)}
                className="text-red-600 underline"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default AddPrductDetail