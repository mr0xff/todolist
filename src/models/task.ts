import db from "@/models/con";
import { taskSchema } from "@/models/schemas";

const taskModel =  db.model('Task', taskSchema);

export default taskModel;