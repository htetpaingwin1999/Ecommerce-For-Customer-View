import {mongooseConnect} from "@/lib/mongoose";
import {Client} from "@/models/Client";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  if(req.method === "POST")
  {
    if(!req.body) return res.status(400).json({error: "Data is missing"})
    const {fullName, email, password }= req.body;
    const userExists = await Client.findOne({ email})

    if(userExists){
        return res.status(409).json({error: "User Already exists"})
    }else{
        if(password.legth < 6)
        {
            return res.status(409).json({error: "Password should be 6 characters long"})
        }
        const hashedPassword = await hash(password, 12)

        User.create({
            fullName,
            email,
            password: hashedPassword
        }, (error))

    }
  }
}