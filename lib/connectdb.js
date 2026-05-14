import mongoose from "mongoose";




export const connectDB = async()=>{

    const readyState = mongoose.connection.readyState;
    console.log("Ready State: ", readyState);

    if(readyState == 1){
        return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'todoApp'
    }).then(()=>{
        console.log("Ready State: ", mongoose.connection.readyState);
        console.log("Connected To MongoDB.");
    }).catch((e)=>{
        console.log(e);
        console.log("Error While Connecting To MongoDB")
        process.exit(1);
    })

    
}
