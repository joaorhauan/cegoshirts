import bcrypt from "bcryptjs";
import { getPrisma } from '../lib/prisma.js'
import dotenv from 'dotenv';

dotenv.config();

const prisma = getPrisma()

const emailF = process.env.ADMIN_EMAIL_F;
const passwordF = process.env.ADMIN_PASSWORD_F;

const emailS = process.env.ADMIN_EMAIL_S;
const passwordS = process.env.ADMIN_PASSWORD_S;

try {

    if (!emailF || !passwordF || !emailS || !passwordS) { 
        throw new Error('Define first and second ADMIN_EMAIL and ADMIN_PASSWORD in .env')
        
    }

} catch(err) {

    console.log(err)
    process.exit(1)

}


const hashF = await bcrypt.hash(passwordF, 10)
const hashS = await bcrypt.hash(passwordS, 10)

await prisma.admin.create({ data: { email: emailF, password:hashF } })
await prisma.admin.create({ data: { email: emailS, password:hashS } })

console.log('Created admins sucessfully')
await prisma.$disconnect()

