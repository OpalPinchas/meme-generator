'use strict'



function renderGallery() {
    const elGallery = document.querySelector('.gallery')
    const elEditor = document.querySelector('.editor-container')
    elEditor.classList.remove('flex')
    elEditor.hidden = true

    const imgs = getImgs()

    let strHTML = imgs.map(img => `
<img data-img-id="${img.id}" onclick="onImgSelect(${img.id})" src="${img.url}" alt="">
`)

    elGallery.innerHTML = strHTML.join('')
    document.querySelector('.main').hidden = false
}
