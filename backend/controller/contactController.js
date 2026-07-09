import validator from "validator";
import ContactMessage from "../model/contactMessageModel.js";

export const sendContactMessage = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (message.length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      contactMessage,
    });
  } catch (error) {
    console.log("Contact message error");
    return res.status(500).json({ message: `Contact message error ${error}` });
  }
};
export const getMessages= async (req,res)=>{
  try {
    const messages= await ContactMessage.find({}).sort({ createdAt: -1 });
    
    return res.status(200).json({messages})
  } catch (error) {
        return res.status(500).json({ message: `Get messages error ${error}` })

  }

}

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["new", "read"].includes(status)) {
      return res.status(400).json({ message: "Invalid message status" })
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    return res.status(200).json({ message: "Message status updated", contactMessage: message })
  } catch (error) {
    return res.status(500).json({ message: `Update message error ${error}` })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params
    const message = await ContactMessage.findByIdAndDelete(id)

    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    return res.status(200).json({ message: "Message deleted" })
  } catch (error) {
    return res.status(500).json({ message: `Delete message error ${error}` })
  }
}
