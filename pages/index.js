import Header from '@/components/User/Header'
import React from 'react'

const index = (props) => {
  return (
    <div>
      <Header/>
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