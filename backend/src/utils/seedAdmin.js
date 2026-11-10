import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

await mongoose.connect(process.env.MONGO_URI)
const email = process.env.ADMIN_EMAIL || 'admin@zelit.com'
const exists = await User.findOne({ email })
if (exists) {
  console.log('The admin already exists:', email)
} else {
  await User.create({
    name: 'Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin1234',
    role: 'admin'
  })
  console.log('Admin created:', email)
}
await mongoose.disconnect()
