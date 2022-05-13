import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import ShoutOut from "../models/ShoutOutsModel";

const routes = express.Router();
 
routes.get('/shoutouts', async (req, res)=> {
    try{
        const client = await getClient();
        console.log('Client', client);
        const results = await client.db()
                                .collection<ShoutOut>('shoutouts')
                                .find().toArray();
        console.log('results', results)
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

routes.get('/shoutouts/:id', async (req, res)=> {
    const id = req.params.id;
    try{
        const client = await getClient();
        const shoutOut = await client.db()
                                .collection<ShoutOut>('shoutouts')
                                .findOne({ _id: new ObjectId(id) });
       if(shoutOut){
           res.json(shoutOut);
       }else{
           res.status(404).json({message: "Not Found"});
       }
    } catch(err) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

routes.post('/shoutouts', async (req, res)=> {
    const shoutOut = req.body as ShoutOut;
    try{
        const client = await getClient();
        await client.db()
            .collection<ShoutOut>('shoutouts')
            .insertOne(shoutOut);
        res.status(201).json(shoutOut);
    } catch(err) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

export default routes;