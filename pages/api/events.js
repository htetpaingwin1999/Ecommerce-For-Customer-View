import { mongooseConnect } from "../../lib/mongoose";
import { Event } from "../../models/Event";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    const activeEvent = await Event.findOne({ onStatus: 1 });

    if (activeEvent) {
      res.json({ image_path: activeEvent.image_path, background_image_path: activeEvent.background_image_path, besideOrUp: activeEvent.besideOrUp, name: activeEvent.name });
    } else {
      res.status(404).json({ error: "No active event found" });
    }
  }
}
