function validateEmail(email){
    const regex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    let verif = true ;
    if (!regex.test(email.value)){
        messageError("Adresse email non valide, veuillez rentrer un format valide");
        verif = false;
    }
    return verif;
};

function messageError (type){
    const existMessage = document.querySelector(".error-message");
    if(existMessage){
        existMessage.remove();
    }
    const h2Login = document.querySelector(".h2-login");
    h2Login.style.marginBottom="16px";
    const message = document.createElement("p");
    if (type===401 || type===404){
        message.innerText="Accès refusé car utilisateur non trouvé ou non autorisé";
    }
    else if ((typeof type)==="string"){
        message.innerText=type;
    }
    message.style.color ="red";
    message.className="error-message";
    h2Login.insertAdjacentElement("afterend",message);
};

async function login(event){
    event.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password").value;
    if(!validateEmail(email)){return}
    const identification = {
        email : email.value,
        password : password
    };
    try {
        const response = await fetch("http://localhost:5678/api/users/login",{
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(identification)
        });
        if (response.status ==200){
            console.log(response.status);
            const reponse = await response.json();
            localStorage.setItem("identification",reponse.token);
            window.location.replace("index.html");
        }
        else{
            messageError(response.status);
        }

    } catch (error) {
         messageError(" Impossible de se connecter, veuillez réssayer utlérieurement");
    };
};

const buttonLogin = document.getElementById("button-form");
buttonLogin.addEventListener('click',login);