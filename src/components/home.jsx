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

    function encodeBase62(n){
        const base62Chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        if (n === 0) return base62Chars[0]
        let result = ''
        while(Math.floor(n/62)>0){
            result = base62Chars[n%62] + result
            n = Math.floor(n/62)
        }
        return result
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