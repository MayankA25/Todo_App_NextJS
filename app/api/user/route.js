import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectdb";


export async function GET(){
    await connectDB();
    const user = await getLoggedInUser();

    if(user instanceof Response){
        return user;
    }

    return Response.json(user, {
        status: 200
    });
}