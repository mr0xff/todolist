import { Router } from "express";
import { 
  registerUser, 
  getUsers,
  signUser, 
  getUser,
  signOutUser,
  resetPassword
} from "@/controllers/user";
import type { User as UserType } from "@/lib/data";
import User from "@/models/user";
import { verify } from "argon2";

const user = Router();

user.get('/list', async(req, res)=>{
  res.send(await getUsers());
})

user.post('/register', async(req, res)=>{
  try{
    const params = req.body as UserType;

    if(!params.username || !params.pwd)
      throw new Error("preencha todos os campos!");

    const response = await registerUser({...params});

    if(!response)
      throw new Error("Falha no registro!");

    res.status(201).send({
      message: "conta registrada com sucesso!",
      status: true,
    })
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "Error, verifique as suas informações!",
      status: false,
      detail: err.message,
    });
  }
});

user.post('/login', async(req, res)=>{
  try{
    const body = req.body as UserType;
    const result = await signUser({...body});

    if(!result.status){
      res.status(404).send(result);
      return;
    }

    res.send(result);
  }catch(e: unknown){
    res.status(500).send({
      message: "Erro interno"
    });
  }
});

user.post('/logout', async(req, res)=>{
  try{
    const result = await signOutUser(req.headers.userId as string);
    
    console.log(result);

    res.send({
      message: "Sessão terminada!",
      status: true,
    });
  }catch(e: unknown){

  }
});

user.get('/my-profile', async(req, res)=>{
  try{
    const user = await getUser(req.headers.userId as string) as UserType;
    res.send(user);
  }catch(e: unknown){
    res.status(500).send({
      message: "Internal Error"
    })
  }
});

user.put('/p/reset', async(req, res)=>{
  try{
    const body = req.body as { current: string; new: string };

    if(!req.headers.userId || !body.current || !body.new)
      throw new Error("preecha todos os campos!");
    
    const exitUser = await User.findById({ _id: req.headers.userId }).select({pwd: 1});
    
    if(!exitUser) 
      throw new Error("conta inválida!");

    const currentPwdValid = await verify(exitUser.pwd as string, body.current);

    if(!currentPwdValid)
      throw new Error("senha invalida!");

    const wasReseted = await resetPassword({ pwd: body.new, userId: req.headers.userId as string });
    
    console.log(wasReseted);

    res.send({
      
    });
  }catch(e: unknown){
    const err = e as Error;

    res.status(400).send({
      message: "Erro, verifique as suas informações!",
      status: false,
      detail: err.message,
    });
  }
});

export default user;