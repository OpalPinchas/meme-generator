'use strict'

var gImgs = creatImgs()

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'TEXT',
            size: 30,
            align: 'center',
            stroke: '#000000',
            fill: 'white',
            font: 'Impact',
            isDrag: false,

        }
    ]

}

var gSavedMemes

function setLineTxt(key) {
    let line = gMeme.lines[gMeme.selectedLineIdx]
    let txt = line.txt

    switch (key) {
        case 'Backspace':
            txt = txt.substring(0, txt.length - 1)
            break;
        default:
            txt += key
    }
    line.txt = txt
}

function setImg(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'TEXT',
                size: 30,
                align: 'center',
                stroke: '#000000',
                fill: 'white',
                font: 'Impact',
                isDrag: false,

            }
        ]

    }
}

function addLine() {
    const line = {
        txt: 'TEXT',
        size: 30,
        align: 'center',
        stroke: '#000000',
        fill: 'white',
        font: 'Impact',
        isDrag: false

    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0
}

function setFontSize(diff) {
    let line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += diff
}

function setColor(color) {
    let line = gMeme.lines[gMeme.selectedLineIdx]
    line.stroke = color
}

function switchLine() {
    const currLineIdx = gMeme.selectedLineIdx
    if (currLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0
    } else {
        gMeme.selectedLineIdx++
    }
}

function updateLinePos(idx, x, y) {
    gMeme.lines[idx].pos = { x, y }
}


function getMeme() {
    return gMeme
}

function creatImgs() {
    let imgs = []

    for (var i = 0; i < 18; i++) {
        imgs[i] = {
            id: i + 1,
            url: `meme-imgs/${i + 1}.jpg`
        }
    }
    return imgs
}

function getImgs() {
    return gImgs
}

function alignChange(val) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.align = val
}

function isLineClicked(pos) {
    gMeme.lines.forEach((line, idx) => {
        const lineHeight = line.size * 0.8
        const lineTopPos = line.pos.y - lineHeight / 2
        const lineBottomPos = line.pos.y + lineHeight / 2

        if (pos.y >= lineTopPos && pos.y <= lineBottomPos) {
            let lineStartPos = line.pos.x - (line.size * line.txt.length * 0.25)
            let lineEndPos = line.pos.x + (line.size * line.txt.length * 0.25)
            switch (line.align) {
                case 'center':
                    lineStartPos = line.pos.x - (line.size * line.txt.length * 0.25)
                    lineEndPos = line.pos.x + (line.size * line.txt.length * 0.25)
                    break;
                case 'left':
                    lineStartPos = line.pos.x
                    lineEndPos = line.pos.x + (line.size * line.txt.length * 0.5)
                    break;
                case 'right':
                    lineStartPos = line.pos.x - (line.size * line.txt.length * 0.5)
                    lineEndPos = line.pos.x
                    break;
            }
            if (pos.x >= lineStartPos && pos.x <= lineEndPos) {
                gMeme.selectedLineIdx = idx
                setLineDrag(true)
            }
        }
    })
    return gMeme.lines[gMeme.selectedLineIdx].isDrag
}


function setLineDrag(bool) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = bool
}


function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function moveLine(dx, dy) {
    const line = getLine()
    line.pos.x += dx
    line.pos.y += dy
}

function saveMeme(memeUrl) {
    gSavedMemes = loadFromStorage('memes')
    const meme = {
        id: makeId(),
        memeData: gMeme,
        memeUrl
    }
    gSavedMemes.push(meme)
    saveToStorage('memes', gSavedMemes)
}

function setMeme(id) {
    gSavedMemes = loadFromStorage('memes')
    gMeme = gSavedMemes.find(meme => meme.id === id).memeData
    console.log(gMeme)
}

