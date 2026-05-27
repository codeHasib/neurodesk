import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteTask = async (id: string) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    if (!token) {
      throw new Error("Unauthorized");
    }
    const user = await verifyToken(token);
    if (!user) {
      throw new Error("Unauthorized");
    }
    const deleteTask = await Task.deleteOne({ _id: id });
    if (deleteTask.deletedCount > 0) {
      revalidatePath(`/dashboard/tasks`);
    }
    return Response.json(deleteTask, { status: 200 });
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
