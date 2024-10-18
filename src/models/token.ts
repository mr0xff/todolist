import db from "@/models/con";
import { taskSchema } from "@/models/schemas";

const Token =  db.model('Task', taskSchema);

export default Token;