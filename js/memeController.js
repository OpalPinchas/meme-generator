'use strict'

var gElCanvas
var gCtx
var gStartPos
var gRect


const gTouchEvs = ['touchstart', 'touchmove', 'touchend']





function renderMeme() {
    const meme = getMeme()
    var img = new Image()
    const imgId = meme.selectedImgId
    const line = meme.lines[meme.selectedLineIdx]
    img.src = `meme-imgs/${imgId}.jpg`

    

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        const lines = meme.lines
        if (lines.length === 0) return
        lines.forEach((line, idx) => {
            const linePos = (line.pos) ? line.pos :
                (idx === 0) ? { x: gElCanvas.width / 2, y: 50 } :
                    (idx === 1) ? { x: gElCanvas.width / 2, y: gElCanvas.height - 50 } : { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
            drawText(line, linePos)
            updateLinePos(idx, linePos.x, linePos.y)
        })

        drawRect()
        document.querySelector('.color').value = line.stroke
        const elInput = document.querySelector('.txt-input')
        elInput.value = ''
        elInput.value = line.txt
    }

}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function onSaveMeme() {
    saveMeme(getCanvasDataUrl())
}

function getCanvasDataUrl() {
    return gElCanvas.toDataURL()
}


function onImgSelect(imgId) {
    setImg(imgId)
    renderEditor()
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (isLineClicked(pos)) {
        gStartPos = pos
    }
}

function onUp() {
    setLineDrag(false)
}

function onAlignChange(val) {
    alignChange(val)
    renderMeme()


}

function onMove(ev) {
    const line = getLine();
    if (!line || !line.isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onFontSizeChange(diff) {
    setFontSize(diff)
    renderMeme()
}

function onColorChange() {
    setColor(this.value)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    const length = Math.min(elContainer.clientWidth, elContainer.clientHeight) * 0.8
    gElCanvas.width = length
    gElCanvas.height = length
}

function onLineChange(ev) {
    setLineTxt(ev.key)
    renderMeme()
}


function drawText(line, linePos) {

    const font = `${line.size}px ${line.font}`
    const align = line.align
    const stroke = line.stroke
    const fill = line.fill
    const txt = line.txt

    gCtx.font = font
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = align
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.lineWidth = 2;

    gCtx.fillText(txt, linePos.x, linePos.y)
    gCtx.strokeText(txt, linePos.x, linePos.y)

}



function drawRect() {
    const line = getLine()
    const y = line.pos.y - line.size * 1.3 / 2
    const x = line.pos.x - (line.size * line.txt.length * 0.5)
    gCtx.beginPath()
    gCtx.rect(x, y, (line.size * line.txt.length), line.size * 1.3)
    gCtx.strokeStyle = '#181b1bd6'
    gCtx.closePath()
    gCtx.stroke()
}


function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onMemeSelect(id) {
    setMeme(id)
    renderEditor()
}

function onDownloadCanvas(elLink){
  const data = getCanvasDataUrl()
  elLink.href = data
  elLink.download = 'canvas.jpg'
}


function renderEditor(){
    document.querySelector('.main').hidden = true
    document.querySelector('.editor-container').classList.add('flex')
    document.querySelector('.color').addEventListener('change', onColorChange)
    gElCanvas = document.querySelector('#canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()
    addListeners()
    renderMeme()
}




function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        document.querySelector('.share-container').innerHTML = `
        <a id="my-share" hidden class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`

        const shareEl = document.querySelector('#my-share')
        shareEl.click()

    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}







