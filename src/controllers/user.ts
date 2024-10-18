import userModel from "@/models/user";
import Token from "@/models/token";
import type { User as UserType } from "@/lib/data";
import { hash, verify } from "argon2";
import { generateToken, whoIsUser } from "@/lib/jose";

async function registerUser({
  username,
  pwd,
  bio,
}: UserType){
  try{
    const user = new userModel({
      username,
      pwd: await hash(pwd),
      bio,
    });

    await user.save();

    return true;
  }catch(e: unknown){
    return false;
  }
}

async function signUser({ username, pwd }: UserType){
  try{
    if(!username || !pwd)
      throw new Error("empty");

    const user = await userModel.findOne({ username });
    
    if(!user)
      throw new Error("user not found");

    const correctLogin = await verify(user.pwd as string, pwd);

    if(!correctLogin)
      throw new Error("password incorrect");

    return {
      message: "login feito com sucesso!",
      token: await generateToken(user._id.toString()),
      status: true,
    };
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: "falha no registro da conta!",
      detail: err.message,
      status: false,
    };
  }
}

async function signOutUser(token: string){
  try{
    const signOut = new Token({token, userId: (await whoIsUser(token))?.userId });
    await signOut.save();
    
    return true;
  }catch(e: unknown){
    return false;
  }
}

async function getUsers(){
  return await userModel.find().select({ pwd: 0 });
}

async function getUser(userId: string){
  return await userModel.findById({ _id: userId }).select({ pwd: 0 });
}

async function updateUser({ 
  userId, 
  username, 
  bio 
}:{ 
  userId: string; 
  pwd?: string 
} & UserType){
  try{
    await userModel.findByIdAndUpdate({ _id: userId }, { username, bio });
    return true;
  }catch(e: unknown){
    return false;
  }
}

async function resetPassword({ 
  pwd, 
  userId 
}:{ 
  userId: string; 
  pwd: string 
}){
  try{
    await userModel.findByIdAndUpdate({ _id: userId }, { pwd: await hash(pwd), });
    return true;
  }catch(e: unknown){
    return false;
  }
}

export {
  registerUser,
  getUsers,
  signUser,
  getUser,
  signOutUser,
  updateUser,
  resetPassword
};