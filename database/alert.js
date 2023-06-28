import axios from "axios";


export default async function alert(type, details) {

    let message
    if (type === 'new user') {
        message = `New account generated ${details}`
    } else if (type === 'email subscription') {
        message = `New email subscription (Email: ${details})`
    } else if (type === 'new callbackURL') {
        message = `New callback URL: ${details.callbackURL}, adding ${details.wildcardDomain}`
    }

    // slack ping
    await axios.post('https://slack.com/api/chat.postMessage', { 
        channel: process.env.SLACK_CHANNEL_ID,
        text: message
    }, { headers: { 'Authorization': `Bearer ${process.env.SLACK_TOKEN}`, 'Content-Type': 'application/json' } })
    .catch(error => console.error(error));

    // telegram ping
    // const chatId = process.env.tg_chat_id
    // const token = process.env.tg_key
    // const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
    // fetch(url)
    // .then(response => response.json())
    // .catch(error => console.error(error));

}
