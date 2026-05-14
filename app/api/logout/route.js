import { getLoggedInUser } from "@/lib/auth";
import { Session } from "@/models/sessionModel";
import { cookies } from "next/headers";


export async function POST(){

    const user = await getLoggedInUser();

    if(user instanceof Response){
        return user;
    }

    const cookieStore = await cookies();

    const [sessionId, sessionSignature] = cookieStore.get('sid')?.value.split(".");

    if(!sessionId){
        return Response.json({
            msg: "Login Kar Le Bsdk!"
        }, {
            status: 401
        })
    }

    await Session.deleteOne({
        _id: sessionId,
        user: user._id
    })

    // clearing the cookie.
    cookieStore.delete('sid');

    return Response.json({
        msg: "Logged Out Successfully"
    }, {
        status: 200
    })

}