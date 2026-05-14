import { connectDB } from "@/lib/connectdb";
import { User } from "@/models/userModel";
import { cookies } from "next/headers";
import crypto from "crypto";
import { signCookie } from "../../../lib/auth";
import { Session } from "@/models/sessionModel";
import bcrypt from "bcrypt";


export async function POST(request){
    await connectDB();

    const { email, password } = await request.json();

    const cookieStore = await cookies();

    try{

        const foundUser = await User.findOne({ email: email });

        console.log("Found User: ",foundUser);

        if(!foundUser){
            return Response.json({ msg: "Invalid Credentials" }, {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 400
            })
        }

        const isPasswordMatching = await bcrypt.compare(password, foundUser.password);

        if(!isPasswordMatching){
            return Response.json({ msg: "Invalid Credentials" }, {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 400
            })
        }

        // const userId = foundUser._id.toString();
        
        // console.log('User ID: ', foundUser._id.toString());

        // const signedCookie = signCookie(userId);

        // console.log("Signed Cookie: ", signedCookie);

        const newSession = new Session({
            user: foundUser._id
        });

        const savedSession = await newSession.save();

        const signedCookie = signCookie(savedSession._id.toString());

        console.log("Signed Cookie: ", signedCookie);

        cookieStore.set('sid', signedCookie, {
            httpOnly: true,
            maxAge: 24 * 60 * 60
        })

        return Response.json({name: foundUser.name, email: foundUser.email}, {
            headers: {
                "Content-Type": "application/json"
            },
            status: 200
        })

    }catch(err){
        console.log("Error: ", err);

        return new Response(JSON.stringify({
            msg: "Something went wrong."
        }), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 500
        })
    }
}