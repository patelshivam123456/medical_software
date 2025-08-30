// import { IncomingForm } from "formidable";
// import fs from "fs";
// import path from "path";
// import { connectToDB } from "@/lib/mongodb";
// import ItemList from "@/models/ItemList";

// export const config = {
//   api: {
//     bodyParser: false, // disable Next.js default body parser
//   },
// };

// export default async function handler(req, res) {
//   await connectToDB();

//   if (req.method === "POST") {
//     const uploadDir = path.join(process.cwd(), "public/uploads");

//     // ensure uploads dir exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const form = new IncomingForm({
//       multiples: false,
//       uploadDir,
//       keepExtensions: true,
//     });

//     form.parse(req, async (err, fields, files) => {
//       if (err) return res.status(500).json({ error: "Upload failed" });

//       try {
//         const product = await ItemList.create({
//           productName: Array.isArray(fields.productName) ? fields.productName[0] : fields.productName,
//           company: Array.isArray(fields.company) ? fields.company[0] : fields.company,
//           mrp: Array.isArray(fields.mrp) ? Number(fields.mrp[0]) : Number(fields.mrp),
//           rate: Array.isArray(fields.rate) ? Number(fields.rate[0]) : Number(fields.rate),
//           salt: Array.isArray(fields.salt) ? fields.salt[0] : fields.salt,
//           image: files.image
//             ? "/uploads/" + (Array.isArray(files.image) ? files.image[0].newFilename : files.image.newFilename)
//             : null,
//         });

//         res.status(201).json(product);
//       } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: e.message });
//       }
//     });
//   }

//   else if (req.method === "GET") {
//     try {
//       const products = await ItemList.find().sort({ createdAt: -1 });
//       res.status(200).json(products);
//     } catch (e) {
//       res.status(500).json({ error: e.message });
//     }
//   }

//   else if (req.method === "PUT") {
//     const uploadDir = path.join(process.cwd(), "public/uploads");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const form = new IncomingForm({
//       multiples: false,
//       uploadDir,
//       keepExtensions: true,
//     });

//     form.parse(req, async (err, fields, files) => {
//       if (err) return res.status(500).json({ error: "Update parse failed" });

//       try {
//         const { id } = fields;
//         if (!id) return res.status(400).json({ error: "ID is required" });

//         const updateData = {
//           productName: Array.isArray(fields.productName) ? fields.productName[0] : fields.productName,
//           company: Array.isArray(fields.company) ? fields.company[0] : fields.company,
//           mrp: Array.isArray(fields.mrp) ? Number(fields.mrp[0]) : Number(fields.mrp),
//           rate: Array.isArray(fields.rate) ? Number(fields.rate[0]) : Number(fields.rate),
//           salt: Array.isArray(fields.salt) ? fields.salt[0] : fields.salt,
//         };

//         if (files.image) {
//           updateData.image =
//             "/uploads/" +
//             (Array.isArray(files.image) ? files.image[0].newFilename : files.image.newFilename);
//         }

//         const updated = await ItemList.findByIdAndUpdate(id, updateData, { new: true });
//         if (!updated) return res.status(404).json({ error: "Item not found" });

//         res.status(200).json(updated);
//       } catch (e) {
//         res.status(500).json({ error: e.message });
//       }
//     });
//   }

//   else if (req.method === "DELETE") {
//     try {
//       const { id } = req.query;
//       if (!id) return res.status(400).json({ error: "ID is required" });

//       const deleted = await ItemList.findByIdAndDelete(id);
//       if (!deleted) return res.status(404).json({ error: "Item not found" });

//       res.status(200).json({ success: true });
//     } catch (e) {
//       res.status(500).json({ error: e.message });
//     }
//   }

//   else {
//     res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { connectToDB } from "@/lib/mongodb";
import ItemList from "@/models/ItemList";

// Disable Next.js bodyParser (important for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const form = new IncomingForm({ multiples: false, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed" });

      try {
        let imageUrl = null;

        if (files.image) {
          const filePath = Array.isArray(files.image)
            ? files.image[0].filepath
            : files.image.filepath;

          // Upload to Cloudinary
          const uploadRes = await cloudinary.uploader.upload(filePath, {
            folder: "medical_items",
          });
          imageUrl = uploadRes.secure_url;
        }

        const product = await ItemList.create({
          productName: Array.isArray(fields.productName) ? fields.productName[0] : fields.productName,
          company: Array.isArray(fields.company) ? fields.company[0] : fields.company,
          mrp: Array.isArray(fields.mrp) ? Number(fields.mrp[0]) : Number(fields.mrp),
          rate: Array.isArray(fields.rate) ? Number(fields.rate[0]) : Number(fields.rate),
          salt: Array.isArray(fields.salt) ? fields.salt[0] : fields.salt,
          image: imageUrl,
        });

        res.status(201).json(product);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
      }
    });
  }

  else if (req.method === "GET") {
    try {
      const products = await ItemList.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  else if (req.method === "PUT") {
    const form = new IncomingForm({ multiples: false, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Update parse failed" });

      try {
        const { id } = fields;
        if (!id) return res.status(400).json({ error: "ID is required" });

        const updateData = {
          productName: Array.isArray(fields.productName) ? fields.productName[0] : fields.productName,
          company: Array.isArray(fields.company) ? fields.company[0] : fields.company,
          mrp: Array.isArray(fields.mrp) ? Number(fields.mrp[0]) : Number(fields.mrp),
          rate: Array.isArray(fields.rate) ? Number(fields.rate[0]) : Number(fields.rate),
          salt: Array.isArray(fields.salt) ? fields.salt[0] : fields.salt,
        };

        if (files.image) {
          const filePath = Array.isArray(files.image)
            ? files.image[0].filepath
            : files.image.filepath;

          const uploadRes = await cloudinary.uploader.upload(filePath, {
            folder: "medical_items",
          });
          updateData.image = uploadRes.secure_url;
        }

        const updated = await ItemList.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ error: "Item not found" });

        res.status(200).json(updated);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  }

  else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID is required" });

      const deleted = await ItemList.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Item not found" });

      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
