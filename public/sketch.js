document.body.style.margin   = 0
document.body.style.overflow = `hidden`

function setup () {
   createCanvas (innerWidth, innerHeight)
}

function  draw () {
   background (`magenta`)
   fill('turquoise')
   square (width / 2, height / 2, 100)
}
