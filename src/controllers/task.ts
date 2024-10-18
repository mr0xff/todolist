import { Task } from "@/lib/data";
import taskModel from "@/models/task";

async function createTask({ 
  title, 
  description,
  status,
  userId,
}: Task){
  try{
    if(!title || !description)
      throw new Error();

    const task = new taskModel({
      title,
      description,
      status,
      userId
    });

    await task.save();

    return true;
  }catch(e: unknown){
    return false;
  }
}

async function deleteTask(taskId: string){
  const taskDeletedState = await taskModel.findById({ _id: taskId });
  if(taskDeletedState?.isDeleted === true)
    await taskModel.findByIdAndDelete({ _id: taskId });

  await taskModel.findByIdAndUpdate({ _id: taskId }, { isDeleted: true });
  return true;
}

async function getTasks(){
  return await taskModel.find();
}

async function getTask(taskId: string){
  return await taskModel.findById({ _id: taskId });
}

async function updateTask({
  title,
  description,
  status,
  taskId
}: Task & { taskId: string }){
  try{
    if(!title || !description)
      throw new Error();
    
    await taskModel.findByIdAndUpdate({ _id: taskId }, {
      title,
      status,
      description,
    });

    return true;
  }catch(e: unknown){
    return false;
  }
}

export {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask
}