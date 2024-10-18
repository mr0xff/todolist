import { SignJWT, jwtVerify } from "jose";
import { configDotenv } from "dotenv";

configDotenv();

const SECRET_TEXT = new TextEncoder().encode(process.env.SECRET_JWT);
const alg = "HS256";

async function generateToken(userId: string){
  try{
    return await new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME as string)
    .sign(SECRET_TEXT);
  }catch(e: unknown){
    console.log(e);
  }
}

async function decodeToken(token: string){
  try{
    return (await jwtVerify(token, SECRET_TEXT)).payload;
  }catch(e: unknown){
    console.log('error on decoded');
    const err = e as Error;
    return err;
  }
}

async function whoIsUser(token: string){
  const tokenPayload = await decodeToken(token) ;
  if('message' in tokenPayload)
    return;
  return tokenPayload as { userId: string };
}

export {
  generateToken,
  decodeToken,
  whoIsUser
}