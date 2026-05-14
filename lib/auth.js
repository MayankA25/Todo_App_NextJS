import { User } from "@/models/userModel";
import { cookies } from "next/headers"
import crypto from "crypto";
import { Session } from "@/models/sessionModel";


const preventMultiTabAccess = async(userId)=>{
    const numberOfSessions = await Session.countDocuments({ user: userId });

    console.log("Number Of Sessions: ", numberOfSessions);

    if(numberOfSessions > 2){
        await Session.deleteOne({
            user: userId
        }, {
            $sort:{
                createdAt: 1
            }
        })
    }
}

export const getLoggedInUser = async()=>{
    const cookieStore = await cookies();

    const errorResponse = Response.json({
        msg: "Login Kar Le Bsdk!"
    }, {
        status: 401
    })

    const cookie = cookieStore.get('sid')?.value;

    console.log("Cookie: ", cookie);

    if(!cookie){
        return errorResponse;
    }

    const sessionId = verifyCookie(cookie);

    console.log("Session Id: ", sessionId);

    if(!sessionId){
        return errorResponse
    }

    const foundSession = await Session.findById(sessionId);

    if(!foundSession){
        return errorResponse;
    }

    const userId = foundSession.user;
    console.log("User Id: ", userId);

    if(!userId){
        return errorResponse;
    }

    const foundUser = await User.findById(userId).select("-password -__v");

    if(!foundUser){
        return errorResponse;
    }

    // Prevents multiple tab access if more than 2 tabs login detected then the oldest one will be deleted and the new one will be added.
    await preventMultiTabAccess(userId);

    return foundUser;
}

export const signCookie = (data)=>{
    const signedData = crypto.createHmac('sha256', process.env.COOKIE_SECRET).update(data).digest('hex');

    const signedCookie = `${data}.${signedData}`;

    return signedCookie;
}

export const verifyCookie = (signedCookie)=>{
    const [ sessionId, cookieSignature ] = signedCookie.split(".");
    const generatedSignature = signCookie(sessionId);

    console.log("Generated Sig: ", generatedSignature);

    if(signedCookie === generatedSignature){
        return sessionId;
    }

    return false;
}