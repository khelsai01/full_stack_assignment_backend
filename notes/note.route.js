const express = require("express");
const { NoteModel } = require("./note.model");
const { auth } = require("../middleware/auth.middleware");


const noteRouter = express.Router();


noteRouter.get("/", auth, async (req, res) => {
    try {

        const note = await NoteModel.find({ username: req.body.username });
        return res.status(200).send(note)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

noteRouter.post("/add", auth, async (req, res) => {
    try {
        const newNote = new NoteModel(req.body);
        await newNote.save();
        return res.status(200).send({ message: "new note has been added", "newNote": newNote })
    } catch (error) {
        res.status(400).send({ error: error.message })

    }
});

noteRouter.patch("/update/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await NoteModel.findOne({ _id: id })
        // console.log(req.body.userId)
        if (req.body.userId == note.userId) {
            await NoteModel.findByIdAndUpdate({ _id: id }, req.body);
            return res.status(200).send({ msg: ` Note  of id ${id}has been updated ` })
        }
        else {
            return res.status(400).send({ msg: "Note has been not updated" })
        }

    } catch (error) {
        res.status(400).send({ error: error.message })

    }
});


noteRouter.delete("/delete/:id", auth, async (req, res) => {
    const { id } = req.params;
    const note = await NoteModel.findOne({ _id: id })
    try {
        if (req.body.userId == note.userId) {
            await NoteModel.findByIdAndDelete({ _id: id });
            return res.status(200).send({ msg: ` Note  of id ${id}has been deleted ` })
        }
        else {
            return res.status(400).send({ msg: "Note has been not deleted" })
        }

    } catch (error) {
        res.status(400).send({ error: error.message })

    }
});
module.exports = { noteRouter };