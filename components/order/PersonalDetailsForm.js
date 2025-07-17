'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PersonalDetailsForm = ({ onSave, initialData, registeredMobile }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
  });
  const [errors, setErrors] = useState({});
  const [useSaved, setUseSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedDetails, setSavedDetails] = useState([]);

  useEffect(() => {
    if (initialData && !useSaved) {
      setFormData(initialData);
    }
  }, [initialData, useSaved]);

  useEffect(() => {
    if (useSaved && registeredMobile) {
      axios
        .get(`/api/order?mobile=${registeredMobile}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          const seen = new Set();

          const uniqueDetails = data.filter((item) => {
            const pd = item?.personalDetails;
            if (!pd) return false;
            const key = JSON.stringify(pd);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          setSavedDetails(uniqueDetails);
          setShowModal(true);
        })
        .catch((err) => console.error('Error loading saved personal details', err));
    }
  }, [useSaved, registeredMobile]);

  const validate = () => {
    const errs = {};
    const requiredFields = ['name', 'mobile', 'address1',  'pincode', 'state'];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        errs[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleSelectSaved = (data) => {
    const d = data.personalDetails;
    setFormData({
      name: d.name || '',
      mobile: d.mobile || '',
      address1: d.address1 || '',
      address2: d.address2 || '',
      pincode: d.pincode || '',
      state: d.state || '',
    });
    setShowModal(false);
  };

  const handleAddNewAddress = () => {
    setUseSaved(false);
    setShowModal(false);
    setFormData({
      name: '',
      mobile: '',
      address1: '',
      address2: '',
      pincode: '',
      state: '',
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2">Personal Details</h2>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useSaved}
            onChange={(e) => setUseSaved(e.target.checked)}
          />
          <span>Use saved personal details</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['name', 'mobile', 'address1', 'address2', 'pincode', 'state'].map((field) => (
            <div key={field}>
              <label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className='flex justify-end'>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer">
            Save & Continue
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Saved Personal Details</h3>

            <div className="space-y-4">
              {savedDetails.length > 0 ? (
                savedDetails
                  .filter(detail => detail?.personalDetails)
                  .map((detail, index) => {
                    const d = detail.personalDetails;
                    return (
                      <label key={index} className="block p-4 border rounded cursor-pointer hover:bg-gray-100">
                        <input
                          type="radio"
                          name="selectedSaved"
                          className="mr-2"
                          onChange={() => handleSelectSaved(detail)}
                        />
                        <div>
                          <p><strong>Name:</strong> {d.name}</p>
                          <p><strong>Mobile:</strong> {d.mobile}</p>
                          <p><strong>Address:</strong> {d.address1}, {d.address2}</p>
                          {/* <p><strong>City:</strong> {d.city}</p> */}
                          <p><strong>State:</strong> {d.state}</p>
                          <p><strong>Pincode:</strong> {d.pincode}</p>
                        </div>
                      </label>
                    );
                  })
              ) : (
                <p>No saved details found.</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleAddNewAddress}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                + Add New Address
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setUseSaved(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDetailsForm;
