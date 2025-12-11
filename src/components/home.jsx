import {useState } from 'react';
import { supabase } from '../services/supabase.js'
import cutlinkLogo from '../assets/cut-link-logo.svg'
import '../css/Home.css'

function Home() {
    const [longUrl, setLongUrl] = useState("")
    const [shortUrl, setShortUrl] = useState("")

    const handleChange = (e) => {
        setLongUrl(e.target.value)
    }

    const convertUrl = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if(!session) throw new Error('No active session');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/urls/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,

                },
                body: JSON.stringify({ long_url: longUrl })
            });
            if(!response.ok) throw new Error('Failed to shorten url');
            const data = await response.json();
            console.log("Data: ", data)
            setShortUrl(data.short_url)
        }catch(error){
            console.error('Error shortening url: ', error);
        }
    }

    const getAllUrls = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if(!session) throw new Error('No active session');
            console.log(session)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/urls/allUrls`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,

                },
            })
            if(!response.ok) throw new Error("This is what you're seeing");
            const data = await response.json();
            console.log("Data: ", data)
        }catch(error){
            console.error('Error fetching all urls: ', error);
        }
    }

    return(
        <div className="home">
            <h1><img src={cutlinkLogo}></img></h1>
            <label className="url-input-label" for="url-input">Enter the link you'd like to shorten: </label>
            <form className='url-form'>
                
                <input 
                    type="url"
                    className="url-input"
                    id='url-input'
                    onChange={handleChange}
                    autoComplete="off"
                />
                <button type='button' onClick={convertUrl} className='convert-button'>Convert</button>
            </form>
            <button type='button' onClick={getAllUrls} className='convert-button'>All URLs</button>
            <output id='short-url'><a>{shortUrl}</a></output>
        </div>
    )
}

export default Home