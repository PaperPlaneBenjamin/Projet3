
function validateEmail(email){
    const regex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    if (!regex.test(email.value)){
        email.TextContent="Veuillez rentrer un format d'email valide, merci"
    }
}

async function login(event){
    event.preventDefault()
    const email = document.getElementById("email")
    const password = document.getElementById("password").value
    validateEmail(email)
    const identification = {
        email : email.value,
        password : password
    }
    try {
        const response = await fetch("http://localhost:5678/api/users/login",{
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(identification)
        })
        if (response.status ==200){
            console.log(response.status)
            const reponse = await response.json()
            localStorage.setItem("identification",reponse.token)
            window.location.replace("index.html")
        }
        else{
            alert("Accès non autorisé")
        }

    } catch (error) {
        alert (" Impossible de se connecter, veuillez réssayer utlérieurement")
    }
}

const buttonLogin = document.getElementById("button-form")
buttonLogin.addEventListener('click',login)