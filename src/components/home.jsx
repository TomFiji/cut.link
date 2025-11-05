import {useState } from 'react';
import cutlinkLogo from '../assets/cut-link-logo.svg'

function Home() {
    const [url, setUrl] = useState("")

    const handleChange = (e) => {
        setUrl(e.target.value)
    }

    function convertUrl(e){
        e.preventDefault();
        document.getElementById('short-url').innerText = url
    }

    return(
        <div className="home">
            <h1><img src={cutlinkLogo}></img></h1>
            <form className='url-form'>
                <label for="url-input">Enter the link you'd like to shorten: </label>
                <input 
                    type="url"
                    className="url-input"
                    id='url-input'
                    onChange={handleChange}
                    autoComplete="off"
                />
                <button type='button' onClick={convertUrl}>Convert</button>
            </form>
            <p id='short-url'></p>
        </div>
    )
}

export default Home