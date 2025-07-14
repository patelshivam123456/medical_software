import Header from '@/components/User/Header'
import React from 'react'

const OnlineOrder = () => {
  return (
    <div>
      <Header/>
      <div>Online Order</div>
    </div>
  )
}

export async function getServerSideProps(context) {
    if (!context.req.cookies.userLoggedIn&&!context.query.userLoggedIn) {
      return {
        props: {},
        redirect: { destination: '/user/login' },
      }
    } 
    return { props: {} }
  }

export default OnlineOrder
