import express from "express";
import cors from "cors";
import { drawTitle } from "./title"

const app = express();
const port = 3000;

app.use(cors({origin: "*"}))
app.get(/\/title\/(.*)\.png$/,
    async (req, res) => {
        try {
            const title = req.params[0];
            console.log({title});
            
            const imageBuffer = drawTitle(title);
            return res.type("png").send(imageBuffer);
        } catch(err) {
            console.error(err);
            res.status(500).send("Something went wrong, please try again later.");
        }
    })

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
})
