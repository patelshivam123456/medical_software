import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Header from "@/components/User/Header";
import PersonalDetailsForm from "@/components/order/PersonalDetailsForm";
import PaymentForm from "@/components/order/PaymentForm";
import SuccessModal from "@/components/Modal/SuccessModal";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { ArrowLongRightIcon, ForwardIcon } from "@heroicons/react/24/outline";
import LoaderComp from "@/components/User/LoaderComp";

const OrderPage = () => {
  const [step, setStep] = useState(1);
  // const [cart, setCart] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  // const [mobile, setMobile] = useState('');
  const [personalDetails, setPersonalDetails] = useState(null);
  const [orderRefresh, setOrderRefresh] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedProducts, setSubmittedProducts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const { cart, removeFromCart, mobile, cartLoading } = useCart();

  const router = useRouter();

  const handleCheckboxChange = (item) => {
    setSelectedCartItems((prev) => {
      const exists = prev.some((x) => x._id === item._id);
      if (exists) {
        return prev.filter((x) => x._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  // const removeFromCart = async (index) => {
  //   const product = cart[index];
  //   try {
  //     await axios.delete('/api/order/cart', {
  //       data: { productId: product._id, mobile },
  //     });
  //     setCart((prev) => prev.filter((_, i) => i !== index));
  //     setSelectedCartItems((prev) => prev.filter((item) => item._id !== product._id));
  //   } catch (err) {
  //     toast.error('Failed to remove item');
  //   }
  // };
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setSelectedCartItems((prev) =>
        prev.filter((item) => item._id !== productId)
      );
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };
  const saveStep1 = async () => {
    if (selectedCartItems.length === 0 || !mobile) {
      toast.error("Please select at least one item.");
      return;
    }

    const updatedItems = selectedCartItems.map((item) => ({
      ...item,
      productId: item._id,
    }));

    try {
      const res = await axios.post("/api/order", {
        products: updatedItems,
        registeredMobile: mobile,
      });

      setOrderId(res.data._id);
      setSubmittedProducts(res.data.products);
      toast.success("Products saved");
      setStep(2);
    } catch (err) {
      toast.error("Error saving products");
    }
  };

  const saveStep2 = async (details) => {
    const registeredMobile = Cookies.get("mobile");

    await axios.patch("/api/order/draft", {
      orderId,
      registeredMobile,
      data: {
        personalDetails: {
          ...details,
          registeredMobile,
        },
      },
    });

    setPersonalDetails({
      ...details,
      registeredMobile,
    });

    setStep(3);
  };

  const saveStep3 = async (payment) => {
    try {
      const itemsToSubmit =
        submittedProducts.length > 0 ? submittedProducts : cart;

      const grandTotal = itemsToSubmit.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      const gst = grandTotal * 0.12;
      const cgst = gst / 2;
      const sgst = gst / 2;
      const finalAmount = grandTotal + gst;
      const submitstatus = "Pending";
      const registeredMobile = Cookies.get("mobile");

      const orderRes = await axios.get(`/api/order/${orderId}`);
      const order = orderRes.data;

      await axios.patch("/api/order/draft", {
        registeredMobile,
        orderId,
        data: {
          products: itemsToSubmit,
          personalDetails: order.personalDetails,
          paymentDetails: payment,
          grandTotal,
          cgst,
          sgst,
          finalAmount,
          submitstatus,
        },
      });

      const productIdsToDelete = itemsToSubmit.map((item) => item.productId);
      await axios.delete("/api/order/cart", {
        data: {
          mobile: registeredMobile,
          productIds: productIdsToDelete,
        },
      });

      toast.success("Order placed successfully");
      setSelectedCartItems([]);
      setSubmittedProducts([]);
      setSuccessOpen(true);
      setStep(1);
      setOrderRefresh(true);
      setLoadingState(true);
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  const categoryImages = {
    TAB: "/category/med.jpg",
    CREME: "/category/creme.jpg",
    "DRY SYP": "/category/drysyp.jpg",
    INJ: "/category/inj.jpg",
    OIL: "/category/oil.jpg",
    GEL: "/category/gel.jpg",
  };

  return (
    <>
      <Header losdingState={loadingState} orderRefresh={orderRefresh} />
      <div className="p-4 md:max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

        <div className="flex flex-col sm:flex-row justify-center items-center mb-1 gap-2 sm:gap-0">
          {[1, 2, 3].map((num, index) => (
            <div key={num} className="flex flex-col sm:flex-row items-center">
              {/* Step circle */}
              <button
                onClick={() => step >= num && setStep(num)}
                disabled={step < num}
                className={`w-10 h-10 rounded-full border text-sm font-bold flex items-center justify-center 
          transition-colors duration-500 ease-in-out
          ${
            step === num
              ? "bg-green-600 text-white border-green-600"
              : "bg-green-200 text-gray-700 border-green-200"
          }
          ${
            step < num
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-300 cursor-pointer"
          }
        `}
              >
                {num}
              </button>

              {/* Connector line (responsive and animated) */}
              {index < 2 && (
                <div
                  className={`
            transition-all duration-100 ease-in-out 
            ${step > num ? "bg-green-600" : "bg-gray-300"}
            mx-0 sm:mx-0 my-2 sm:my-0
            ${"h-10 sm:h-0.5 sm:w-50 w-0.5"}
          `}
                ></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            {cartLoading ? (
              <div className="flex justify-center items-center mt-[15%]">
                <LoaderComp />
              </div>
            ) : (
              <section class="bg-white py-8 w-full text-black md:flex gap-5">
                <div className="md:w-[60%] space-y-2 overflow-y-scroll max-h-[400px]">
                  {cart.length === 0 ? (
                    <div className="flex justify-between">
                      <p>No items in cart</p>
                      <a
                        href="/user/product/product-list"
                        className="text-green-800 text-base font-semibold flex gap-2 items-center"
                      >
                        Add Product
                        <ArrowLongRightIcon className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div class="flex gap-10 ">
                        <div class="rounded-lg border h-[20%] w-full  border-gray-200 bg-white py-2 px-4 shadow-sm ">
                          <div class="">
                            <div className="flex justify-between items-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={selectedCartItems.some(
                                    (x) => x._id === item._id
                                  )}
                                  onChange={() => handleCheckboxChange(item)}
                                />
                              </div>
                              <div className="text-green-600 italic font-semibold">
                                {item.category}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div>
                                <a href="#" class="">
                                  {/* <img class="h-20 w-20 dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" /> */}
                                  <img
                                    class="hidden h-16 w-20 dark:block"
                                    src={
                                      categoryImages[
                                        item?.category?.toUpperCase()
                                      ] || "/category/default.jpg"
                                    }
                                    alt="imac image"
                                  />
                                </a>
                              </div>
                              <div>
                                <div className="text-sm md:text-lg font-semibold">
                                  {item.name.toUpperCase()}
                                </div>
                                <div className="text-sm md:font-medium">
                                  {item.company}
                                </div>
                                <div className="text-xs md:font-medium">
                                  {item.salt}
                                </div>
                              </div>
                            </div>
                            {/* <div className='border border-gray-200 my-2'></div> */}
                            <div className="flex justify-between mt-5">
                              <div>
                                <span className="text-sm font-semibold">
                                  QTY{" "}
                                </span>
                                <span className="border px-3 py-1 text-sm border-gray-200">
                                  {item.strips}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-semibold">
                                  PACK
                                </span>
                                <span className="px-3 py-1 text-sm border-gray-200">
                                  {item.packaging}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-semibold">
                                  Expiry
                                </span>
                                <span className="px-3 py-1 text-sm border-gray-200">
                                  {item.expiry}
                                </span>
                              </div>
                            </div>

                            <div className="border border-gray-200 h-0.5 mt-4 mb-2"></div>

                            <div class="flex items-center justify-between">
                              <div>
                                ₹{" "}
                                <span className=" font-semibold">
                                  {item.price}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="font-semibold">
                                  Total-&nbsp;<span>₹{item.total}</span>
                                </div>
                                <div className="border border-gray-200 h-6 w-0.5"></div>
                                <button
                                  onClick={() => handleRemove(item._id)}
                                  class="cursor-pointer inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                >
                                  <svg
                                    class="me-1.5 h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div class="mx-auto  md:w-[40%]">
                  <div class="space-y-4 text-black rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                    <p class="text-xl font-semibold text-gray-900 ">
                      Order summary
                    </p>

                    <div class="space-y-4">
                      <div class="space-y-2">
                        <dl class="flex items-center justify-between gap-4">
                          <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                            Original price
                          </dt>
                          <dd class="text-base font-medium text-gray-900 ">
                            ₹
                            {selectedCartItems
                              .reduce((s, i) => s + i.total, 0)
                              .toFixed(2)}
                          </dd>
                        </dl>

                        <dl class="flex items-center justify-between gap-4">
                          <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                            Savings
                          </dt>
                          <dd class="text-base font-medium text-green-600">
                            -₹00.00
                          </dd>
                        </dl>

                        <dl class="flex items-center justify-between gap-4">
                          <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                            Store Pickup
                          </dt>
                          <dd class="text-base font-medium text-gray-900 ">
                            -₹00.00
                          </dd>
                        </dl>

                        <dl class="flex items-center justify-between gap-4">
                          <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                            Tax (CGST+SGST)
                          </dt>
                          <dd class="text-base font-medium text-gray-900 ">
                            ₹
                            {(
                              selectedCartItems.reduce(
                                (sum, item) => sum + (item.total || 0),
                                0
                              ) * 0.12
                            ).toFixed(2)}
                          </dd>
                        </dl>
                      </div>

                      <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt class="text-base font-bold text-gray-900 ">
                          Grand Total
                        </dt>
                        <dd class="text-base font-bold text-gray-900 ">
                          {(
                            selectedCartItems.reduce((s, i) => s + i.total, 0) *
                            1.12
                          ).toFixed(2)}
                        </dd>
                      </dl>
                    </div>

                    <button
                      onClick={saveStep1}
                      disabled={selectedCartItems.length === 0}
                      className={`bg-green-600 text-white px-6 w-full ${
                        selectedCartItems.length === 0
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } py-2 rounded disabled:bg-gray-400`}
                    >
                      Proceed to Checkout
                    </button>

                    <div class="flex items-center justify-center gap-2">
                      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {" "}
                        or{" "}
                      </span>
                      <a
                        href="/user/product/product-list"
                        title=""
                        class="inline-flex items-center gap-2 text-sm font-medium text-blue-700 underline hover:no-underline dark:text-blue-500"
                      >
                        Continue Shopping
                        <svg
                          class="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {/* <div className="bg-white shadow-md p-4 rounded">
            {cart.length === 0 ? (
              <div className='flex justify-between'>
              <p>No items in cart</p>
              <a href="/user/product/product-list" className='text-green-800 text-base font-semibold flex gap-2 items-center'>Add Product<ArrowLongRightIcon className='w-4 h-4'/></a>
              </div>
            ) : (
              <>
                <table className="w-full text-sm border mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-center">Select</th>
                      <th className="border p-2">Product</th>
                      <th className="border p-2">Company</th>
                      <th className="border p-2">Batch</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Rate</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCartItems.some((x) => x._id === item._id)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                        </td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.company}</td>
                        <td className="border p-2">{item.batch}</td>
                        <td className="border p-2 text-center">{item.quantity}</td>
                        <td className="border p-2 text-right">₹{item.price}</td>
                        <td className="border p-2 text-right">₹{item.total?.toFixed(2)}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


                <div className="text-right space-y-1">
                  <p>Subtotal: ₹{selectedCartItems.reduce((s, i) => s + i.total, 0).toFixed(2)}</p>
                  <p>CGST (6%): ₹{(selectedCartItems.reduce((s, i) => s + i.total, 0) * 0.06).toFixed(2)}</p>
                  <p>SGST (6%): ₹{(selectedCartItems.reduce((s, i) => s + i.total, 0) * 0.06).toFixed(2)}</p>
                  <p className="font-semibold text-lg">
                    Total: ₹
                    {(selectedCartItems.reduce((s, i) => s + i.total, 0) * 1.12).toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={saveStep1}
                    disabled={selectedCartItems.length === 0}
                    className="bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
                  >
                    Save & Continue
                  </button>
                </div>
              </>
            )}
          </div> */}
          </>
        )}

        {step === 2 && (
          <PersonalDetailsForm
            onSave={saveStep2}
            initialData={personalDetails}
            registeredMobile={mobile}
          />
        )}

        {step === 3 && <PaymentForm onSave={saveStep3} />}
        <SuccessModal
          confirmDeleteId={successOpen}
          setConfirmDeleteId={setSuccessOpen}
          confirmDelete=""
          title="Your Order has been Successfully Completed"
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!context.req.cookies.userLoggedIn && !context.query.userLoggedIn) {
    return {
      props: {},
      redirect: { destination: "/user/login" },
    };
  }
  return { props: {} };
}

export default OrderPage;
