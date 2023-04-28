


export default async function alert(type, details) {
    const chatId = process.env.tg_chat_id

    let message
    if (type === 'new user') {
        message = `New account generated \n${details}`
    } else if (type === 'email subscription') {
        message = `New email subscription \nEmail: ${details}`
    }

    
    const token = process.env.tg_key
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
    fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));

}
