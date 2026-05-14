import { connectDB } from "@/lib/connectdb";
import { User } from "@/models/userModel";
import bcrypt from "bcrypt";

export async function POST(request){
    await connectDB();

    const user = await request.json();

    try{

        const { name, email, password } = user;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();

        return Response.json({name: savedUser.name, email: savedUser.email}, {
        status: 201
    })
    }catch(err){
        console.log("Error: ", err);

        if(err.code == 11000){   
            return Response.json({ msg: "Email Already Exists." }, {
                // 409 is for conflicting data.
                status: 409
            })
        }else{
            return Response.json({ msg: "Something Went Wrong" }, {
                status: 500
            })
        }
    }

    
}