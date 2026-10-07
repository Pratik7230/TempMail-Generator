import { connectDB } from "../../../../lib/db";

export async function GET() {
    try {
        await connectDB();

        return Response.json(
            {
                message: "DataBase Connected....",
            }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                message: "DataBase Connection Failed......",
            },
            { status: 500 },
        )
    }
}