// Fonction qui supprime dynamiquement les images du HTML
function removePictureHTML(){
    const figures = document.querySelectorAll('.gallery figure')
    figures.forEach(figure => {
        figure.remove()
    })
    
}

// Fonction qui génère dynamiquement les images de l'API
function addPicture(pictures){
    const gallery = document.querySelector('.gallery')
    pictures.forEach(picture=>{
        const figure = document.createElement("figure")
        gallery.appendChild(figure)
        const img = document.createElement("img")
        img.alt=`${picture.title}`
        img.src=`${picture.imageUrl}`
        let figcaption = document.createElement("figcaption")
        figcaption.textContent=`${picture.title}`
        figure.appendChild(img)
        figure.appendChild(figcaption)
    })
}

// Fonction qui crée les boutons de tri  
function addButton (categories,pictures){
    const ListH2 = document.querySelectorAll("#portfolio h2")
    const h2 = ListH2[0]
    const div =document.createElement("div")
    div.className="flex"
    h2.insertAdjacentElement("afterend",div)
    const tous = document.createElement("div")
    tous.className="item"
    const textAll = document.createElement("p")
    textAll.className="title"
    textAll.innerText="Tous"
    div.appendChild(tous)
    tous.appendChild(textAll)
    tous.addEventListener('click',function(){
        ActiveButton(tous)
        filterPictures("Tous",pictures)
    })
    categories.forEach((categorie)=>{
        const button =document.createElement("div")
        button.className="item"
        div.appendChild(button)
        const text = document.createElement("p")
        text.className="title"
        text.innerText=categorie
        button.appendChild(text)
        button.addEventListener('click',function(){
            ActiveButton(button)
            filterPictures(categorie,pictures)
        })
    })


}

// Fonction qui gère le mode CSS actif du bouton sélectionné
function ActiveButton(button){
    const allitems = document.querySelectorAll(".item")
    allitems.forEach(item=>{
        item.classList.contains("active-item") && item.classList.remove("active-item")
        let titleItem= item.querySelector(".title")
        titleItem.style.color="#1D6154"
    })
    button.classList.add('active-item')
    const title = button.querySelector(".title")
    title.style.color='white'
    
}

// Fonction qui filtre les images en fonction de la catégorie choisie 
function filterPictures(category,pictures){
    const picturesFiltered = category === "Tous" ? pictures : pictures.filter(picture=>picture.category.name===category)
    removePictureHTML()
    addPicture(picturesFiltered)
}


//Fonction principale qui appelle toutes les fonctions
async function principal(){
    removePictureHTML()
    const response =  await fetch('http://localhost:5678/api/works')
    const pictures =  await response.json()
    addPicture(pictures)
    const categories = [...new Set(pictures.map(picture=>picture.category.name))]
    addButton(categories,pictures)
}

principal();