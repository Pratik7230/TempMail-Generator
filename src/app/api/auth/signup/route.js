import { connectDB } from "../../../../../lib/db";
import bcrypt from "bcrypt";
import { User } from "../../../entities/User";

export async function POST(request) {
    try {
        const body = await request.json();

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return Response.json(
                {
                    message: "All Fileds Required...",
                },
                { status: 400 }
            );
        }

        const db = await connectDB();
        const userRpository = db.getRepository(User);
        const existingUser = await userRpository.findOne({
            where: { email },
        });

        if (existingUser) {
            return ({
                message: "Email Already Registered...",
            },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRpository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRpository.save(user);

        return Response.json({
            message: "User Registered Successfully...",
        },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return Response.json({
            message: "Something Went Wrong...",
        },
            { status: 500 },
        );
    }
}