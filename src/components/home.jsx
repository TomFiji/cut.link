import {useState } from 'react';
import { supabase } from '../services/supabase.js'
import cutlinkLogo from '../assets/cut-link-logo.svg'
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'

function Home() {
    const navigate = useNavigate();
    const [longUrl, setLongUrl] = useState("")
    const [shortUrl, setShortUrl] = useState("")
    const [description, setDescription] = useState("")

    const handleChange = (e) => {
        setLongUrl(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const convertUrl = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            const headers = {
                'Content-Type': 'application/json',
            }
            if (session?.access_token){
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/urls/shorten`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ long_url: longUrl, description: description })
            });
            if(!response.ok) throw new Error('Failed to shorten url');
            const data = await response.json();
            console.log("Data: ", data)
            setShortUrl(data.short_url)
            setLongUrl("")
            setDescription("")
        }catch(error){
            console.error('Error shortening url: ', error);
        }
    }

    return(
        <div className="home">
            <h1><img src={cutlinkLogo}></img></h1>
            <label className="url-input-label" for="url-input">Enter the link you'd like to shorten: </label>
            <form className='url-form'>
                <div className='url-input-row'>
                    <input
                        type="url"
                        className="url-input"
                        id='url-input'
                        value={longUrl}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <button type='button' onClick={convertUrl} className='convert-button'>Convert</button>
                </div>

                <input
                    type="text"
                    className="description-input"
                    id='description-input'
                    placeholder="Description (optional)"
                    value={description}
                    onChange={handleDescriptionChange}
                    autoComplete="off"
                />
            </form>
            <output id='short-url'>{shortUrl && <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>}</output>
        </div>
    )
}

export default Home