import { connectToDB } from "@/lib/mongodb";
import ClientUser from "@/models/ClientUser";

export default async function handler(req, res) {
  await connectToDB();

  // ✅ POST: Login
  if (req.method === "POST") {
    const { mobile, password } = req.body;
    const user = await ClientUser.findOne({ mobile });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const timestamp = new Date();         // ✅ current login time
    user.lastLogin = timestamp;           // ✅ store in DB
    await user.save();                    // ✅ save the update

    return res.json({
      message: "Login successful",
      user: {
        name: user.name,
        mobile: user.mobile,
        lastLogin: timestamp.toISOString(), // ✅ include timestamp
      },
    });
  }

  // ✅ GET: Return all users with login info
  if (req.method === "GET") {
    const users = await ClientUser.find().select("name mobile lastLogin"); // ✅ include lastLogin
    return res.json(users);
  }

  // ✅ Other methods not allowed
  res.status(405).end();
}
