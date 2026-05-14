import { connectDB } from "@/lib/connectdb";
import todosData from "../../../todos.json";
import { readFile, writeFile } from "fs/promises";
import { Todo } from "@/models/todoModel";
import { cookies } from "next/headers";
import { User } from "@/models/userModel";
import { getLoggedInUser } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const user = await getLoggedInUser();
  if(user instanceof Response){
    return user
  }

  const allTodos = await Todo.find({ user: user._id });

  console.log("Todos: ", allTodos);

  return new Response(
    JSON.stringify(
      allTodos.map(({ _id, text, completed }) => {
        return { id: _id, text: text, completed: completed };
      }),
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
      statusText: "Mayank...",
    },
  );
}

export async function POST(request) {
  await connectDB();

  // const cookieStore = await cookies();

  // const userId = cookieStore.get("userId")?.value;

  // console.log("User ID: ", userId);

  const user = await getLoggedInUser();

  if(user instanceof Response){
    return user;
  } 

  const userId = user._id;

  if (!userId) {
    return Response.json(
      { msg: "Login Kar Bsdk!" },
      {
        status: 401,
      },
    );
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return Response.json(
      { msg: "Login Kar Bsdk!" },
      {
        status: 401,
      },
    );
  }

  const todo = await request.json();

  const newTodo = new Todo({
    text: todo.text,
    user: userId,
  });

  const savedTodo = await newTodo.save();

  console.log("Saved Todo: ", {
    id: savedTodo._id,
    ...savedTodo,
    _id: undefined,
  });

  return Response.json(newTodo);
}
