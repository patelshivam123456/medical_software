
import { connectToDB } from '@/lib/mongodb'
import { User } from '@/models/User'


export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { mobile, password } = req.body
  await connectToDB()

  const user = await User.findOne({ mobile, password })

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  return res.status(200).json({ success: true })
}
