// token présent ? 
function presenceToken(){
    let bool = false
    document.addEventListener("DOMContentLoaded", function() {
        const token = localStorage.getItem("identification");
        if (token){
            bool=true
        }
    });
    return bool
}


// supprime les boutons
function deleteButton(){
    const deleteButton = document.querySelector(".flex")
    deleteButton.style.display="none"
    console.log(deleteButton)
}