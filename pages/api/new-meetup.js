// the code defined here will never end up on the client side
// so it remains a safe place for credentials

import { MongoClient } from "mongodb";
// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
    if(req.method === "POST"){
        const data = req.body;

        // mongeDB noSQL db that works with collections full of documents
        // collections would be similar to tables, and documents would be similar to
        // entries in those tables in an SQL db
        const client = await MongoClient.connect('mongodb+srv://lynskey123:test123@cluster0.mkv0aai.mongodb.net/meetups?retryWrites=true&w=majority');
        const db = client.db();

        const meetupsCollection = db.collection('meetups');
        const result = await meetupsCollection.insertOne(data);

        console.log(result);
        client.close();

        res.status(201).json({message:'Meetup Inserted!'});
    }
    
}
export default handler;
