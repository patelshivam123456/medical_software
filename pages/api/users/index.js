// ✅ /pages/api/users/index.js
import { connectToDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export default async function handler(req, res) {
  await connectToDB()

  if (req.method === 'GET') {
    const users = await User.find({}, 'mobile password loginType createdAt updatedAt').sort({ createdAt: -1 });
    return res.status(200).json(users)
  }

  if (req.method === 'POST') {
    const { mobile, password, loginType } = req.body

    const existing = await User.findOne({ mobile })
    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({ mobile, password, loginType })
    await user.save()
    return res.status(201).json({ message: 'User created' })
  }

  return res.status(405).end()
}
