'use strict'


function renderMyMemes(){
    const memes = loadFromStorage('memes')
    const elGallery = document.querySelector('.gallery')
    const elEditor = document.querySelector('.editor-container')
    elEditor.classList.remove('flex')
    elEditor.hidden = true

    let strHTML = memes.map(meme => `
    <img onclick="onMemeSelect('${meme.id}')" src="${meme.memeUrl}" alt="">
    `)
    
        elGallery.innerHTML = strHTML.join('')
        document.querySelector('.main').hidden = false
    
    
}