// Fonction qui supprime dynamiquement les images en dures HTML
function removePictureHTML(){
    const figures = document.querySelectorAll('.gallery figure')
    figures.forEach(figure => {
        figure.remove()
    });
    
}
removePictureHTML()

// Fonction qui récupère et génère les images de l'API
async function addPicture(){
    const response =  await fetch('http://localhost:5678/api/works')
    const pictures =  await response.json()
    console.log(pictures)
    const gallery = document.querySelector('.gallery')
    let figure = ''
    pictures.forEach(picture=>{
        figure += 
        `<figure>
            <img src=${picture.imageUrl} alt=${picture.title}>
            <figcaption>${picture.title}</figcaption>
        </figure>`
    })
    gallery.innerHTML= figure
}
addPicture()
