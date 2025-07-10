// ✅ /pages/api/users/[id].js
import { connectToDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export default async function handler(req, res) {
  await connectToDB()
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await User.findByIdAndDelete(id)
      return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
      return res.status(500).json({ message: 'Delete failed', error })
    }
  }

  if (req.method === 'PUT') {
    const { mobile, password, loginType } = req.body

    if (!mobile || !password || !loginType) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate mobile, excluding current user
    const existingUser = await User.findOne({ mobile, _id: { $ne: id } })
    if (existingUser) {
      return res.status(409).json({ message: 'Mobile already in use by another user' })
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { mobile, password, loginType },
        { new: true }
      )
      return res.status(200).json(updatedUser)
    } catch (error) {
      return res.status(500).json({ message: 'Update failed', error })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
