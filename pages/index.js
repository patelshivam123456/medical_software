import Banner from '@/components/User/Banner'
import ContactUs from '@/components/User/ContactUs'
import FeatureSection from '@/components/User/FeatureSection'
import Footer from '@/components/User/Footer'
import Header from '@/components/User/Header'
import Product from '@/components/User/Product'
import React from 'react'

const index = (props) => {
  return (
    <div>
      <Header/>
      <Banner/>
      <Product/>
      <FeatureSection/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}


// export async function getServerSideProps(context) {
//   if (!context.req.cookies.userLoggedIn&&!context.query.userLoggedIn) {
//     return {
//       props: {},
//       redirect: { destination: '/user/login' },
//     }
//   }

  

//   return { props: {} }
// }
export default index