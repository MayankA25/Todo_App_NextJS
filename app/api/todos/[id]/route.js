import { Todo } from "@/models/todoModel";
import todosData from "../../../../todos.json";
import { writeFile } from "fs/promises";
import { connectDB } from "@/lib/connectdb";
import { getLoggedInUser } from "@/lib/auth";


export async function GET(_, { params }){
    await connectDB();
    const paramData = await params;
    const { id } = paramData;
    console.log("Todo ID: ", id);

    const user = await getLoggedInUser();

    if(user instanceof Response){
        return user;
    }

    const todo = await Todo.findOne({ _id: id, user: user._id });

    console.log("Found Todo: ", todo);

    if(!todo){
        // status code can also be sent here like "404"
        return Response.json({ msg: "Todo Not Found" }, {
            status: 404
        })
    }

    return Response.json(todo)
}


export async function PUT(request, { params }){
    await connectDB();

   const { id } = await params;

   const { text, todoStatus } = await request.json();

   console.log("ID: ", id);
   console.log("Text: ", text);

    const user = await getLoggedInUser();

    if(user instanceof Response){
        return user;
    }

    const foundTodo = await Todo.findOne({ _id: id, user: user._id });

    if(!foundTodo) return new Response(JSON.stringify({ msg: "Todo Not Found" }), {
        headers: {
            "Content-Type": "application/json"
        },
        status: 404
    })

    const updatedTodo = await Todo.updateOne({
        _id: id,
        userId: user._id
    }, {
        text: text,
        completed: todoStatus
    }, { 
        new: true,
        runValidators: true
    });
    
    console.log("Updated Todo: ", updatedTodo);

   return new Response(JSON.stringify({ msg: "Todo Updated Successfully" }), {
    headers: {
        "Content-Type":"application/json"
    },
    status: 200
   })

}


export async function DELETE(request, { params }){
    await connectDB();
    const { id } = await params;

    const user = await getLoggedInUser();

    if(user instanceof Response){
        return user;
    }

    const foundTodo = await Todo.deleteOne({
        _id: id,
        user: user._id
    });

    if(!foundTodo) return new Response(JSON.stringify({ msg: "Todo Not Found" }), {
        headers: {
            "Content-Type": "application/json"
        },
        status: 404
    })

    const deletedTodo = await Todo.updateOne({
        _id: id,
        user: user._id
    });

    console.log("Deleted Todo: ", deletedTodo);



    return new Response(null, {
        status: 204
    })

}