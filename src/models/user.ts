import db from "@/models/con";
import { userSchema } from "@/models/schemas";

const userModel =  db.model('User', userSchema);

export default userModel;