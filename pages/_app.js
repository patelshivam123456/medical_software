import "@/styles/globals.css";
import { useRouter } from "next/router";
import Header from "@/components/Header"; // Adjust path as needed
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      {!isLoginPage && <Header />}
      <Component {...pageProps} />
    </>
  );
}
