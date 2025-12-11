import express from "express";
import cors from "cors";
import 'dotenv/config'
import supabase from './config/supabase.js'
import { authenticateUser } from './middleware/auth.js'
import logClick from "./utils/logClick.js";

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors([
    "http://localhost:5000",
    "http://localhost:5173"
]))
app.use(express.json());

function encodeBase62(n){
        const base62Chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        if (n === 0) return base62Chars[0]
        let result = ''
        while(n>0){
            result = base62Chars[n%62] + result
            n = Math.floor(n/62)
        }
        return result
    }

app.post('/api/urls/shorten', authenticateUser, async(req, res) =>{
    const { long_url } = req.body

    if (!long_url){
        return res.status(400).json({ error: "Must input a url" })
    }

    try{
        const { data, error } = await supabase
            .from("links")
            .insert({
                user_id: req.user.id,
                long_url: long_url,
            })
            .select()
            .single()
        if (error) { throw error }
        const id = data.id;
        const shortCode = encodeBase62(id)
        const shortUrl = `${process.env.VITE_API_URL}/${shortCode}`
        const { data: updatedData, error: updateError } = await supabase
            .from("links")
            .update({
                short_code: shortCode,
                short_url: shortUrl
            })
            .eq('id', id)
            .select()
            .single()
        if (updateError) throw updateError

        res.status(201).json(updatedData)
    }catch(error){
        console.log('Error creating short url: ', error)
        res.status(500).json({ error: 'Database error' });
    }
})

app.get('/:shortCode', async(req, res) => {
    const { shortCode } = req.params;
    try{
        const {data, error} = await supabase
            .from('links')
            .select('*')
            .eq('short_code', shortCode)
            .single()

        if (error || !data) { throw error || "URL not found"}
        await supabase
            .rpc('increment_clicks', { short_code_param: shortCode })
            .then(() => {})
            .catch(err => console.error('Failed to increment clicks:', err));
        logClick(shortCode, req).catch(error =>
            console.error('Click logging failed: ', error)
        )
        res.redirect(302, data.long_url)
    }catch(error){
        console.error('Error get the long url: ', error);
        res.status(500).json({ error: 'Database error' })
    }
})

app.get('/api/urls/allUrls', authenticateUser, async(req, res) =>{
    try{
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', req.user.id)
        if (error) { throw error || "Error getting your urls"}
        res.json(data)
        
    }catch(error){
        console.error('Error getting all your expenses: ', error);
        res.status(500).json({ error: 'Database error' })
    }
})



app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})