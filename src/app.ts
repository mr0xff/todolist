import { configDotenv } from "dotenv";
import express from "express";
import user from "@/views/user";
import task from "@/views/task";
import { whoIsUser } from "@/lib/jose";

configDotenv();
const app = express();
app.use(express.json());

// main middleware
app.use(async(req, res, next)=>{
  const requestedUrl = req.url;
  const auth = req.headers.authorization;

  if(requestedUrl === '/user/login' || (requestedUrl === '/user/register' && req.method === 'POST')){
    return next();
  }

  if(!auth)
    res.status(403).send({
      message: "Sem permissão",
      status: false,
      detail: "sem token"
    });
  else {
    const userId = (await whoIsUser(auth))?.userId;
   
    if(!userId){
      res.status(401).send({
        message: "Token espirado ou formato inválido!",
        status: false,
      });
      return;
    }
    req.headers.userId = userId;
    next();
  }
});

// rotas
app.use('/user', user);
app.use('/task', task);

app.listen(process.env.LISTEN_PORT, ()=>{
  console.log('[+] server listen to port %d', process.env.LISTEN_PORT)
});