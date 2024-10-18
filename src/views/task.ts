import { Task } from "@/lib/data";
import { Router } from "express";
import { 
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask 
} from "@/controllers/task";

const task = Router();

task.get('/list', async(req, res)=>{
  res.send(await getTasks());
});

task.post('/create', async(req, res)=>{
  try{
    const task = req.body as Task;
    if(!task.title || !task.description)
      throw new Error("preencha todos os campos!");
    
    const taskResult = await createTask({
      title: task.title,
      description: task.description,
      status: task.status?task.status:"pending",
      userId: req.headers.userId as string,
      createdAt: new Date,
    });

    if(!taskResult)
      throw new Error("falha na criação!");

    res.status(201).send({
      message: "tarefa criada com sucesso!",
      status: true,
    })
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "não foi possivel criar a tarefa!",
      status: false,
      detail: err.message,
    });
  }
});

task.route('/t/:taskId').get(async(req, res)=>{
  try{
    const taskId = req.params.taskId as string;
    if(!taskId)
      throw new Error("vazio");
    
    const task = await getTask(taskId);
    if(!task){
      res.status(404).send({
        message: "não foi encontrado nenhuma tarefa",
        status: false,
      });

      return;
    }

    res.send(task);
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "verifique as suas informações!",
      status: false,
      detail: err.message,
    });
  }
})
.put(async(req, res)=>{
  try{
    const task = req.body as Task;
    const taskId = req.params.taskId as string;

    if(!task.title || !task.description)
      throw new Error("preencha todos os campos!");

    if(!taskId)
      throw new Error("vazio");
    
    const taskUpdated = await updateTask({
      title: task.title,
      description: task.description,
      status: task.status?task.status:"pending",
      userId: req.headers.userId as string,
      createdAt: new Date,
      taskId,
    });

    if(!taskUpdated)
      throw new Error("falha na actualização!");

    res.send({
      message: "tarefa actualizada com sucesso!",
      status: true,
    });
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "não foi possivel actualizar a tarefa!",
      status: false,
      detail: err.message,
    });
  }
})
.delete(async(req, res)=>{
  try{
    const taskId = req.params.taskId as string;

    if(!taskId)
      throw new Error("vazio");
    const taskDeleted = await deleteTask(taskId);
    
    if(!taskDeleted)
      throw new Error("falha ao apagar a tarefa!");

    res.send({
      message: "tarefa apagada com sucesso!",
      status: true,
    });
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "não foi possivel apagar a tarefa!",
      status: false,
      detail: err.message,
    });
  }
});

task.get('/s/:status', async(req, res)=>{
  const status = req.params.status;
  const tasks = await getTasks();
  
  res.send(tasks.filter(item => status === 'doned'?
    item.status === status:item.status === 'pending'
  ));
});

task.get('/o/:type', async(req, res)=>{
  const type = req.params.type;
  const tasks = await getTasks();
  const ordenedTasks = [];

  switch(type){
    case "name": {
      const tempList = tasks.sort((a, b)=> (a?.title as string) > (b?.title as string)?1:-1);
      ordenedTasks.push(tempList);    
    };
    case "date": {
      const tempList = tasks.sort((a, b)=> (a?.createdAt as Date) > (b?.createdAt as Date)?1:-1);
      ordenedTasks.push(tempList);    
    }
  }

  res.send(ordenedTasks);
})

export default task;