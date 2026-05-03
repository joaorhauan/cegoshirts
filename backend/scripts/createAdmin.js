import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) { 
    console.log('Define ADMIN_EMAIL and ADMIN_PASSWORD no .env')
    process.exit(1)
}

const hash = await bcrypt.hash(password, 10)
await prisma.admin.create({ data: { email, senha:hash } })

console.log('Created admin sucessfully')
await prisma.$disconnect()

