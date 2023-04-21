// get rid of the default document padding
document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const cnv = document.getElementById (`example_canvas`)
cnv.style.background = "turquoise"

const ctx = cnv.getContext (`2d`)

resize_canvas ()

window.onresize = resize_canvas

let x_pos = 0

requestAnimationFrame (draw_frame)

function draw_frame () {
    ctx.fillStyle = `turquoise`
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    ctx.fillStyle = `deeppink`
    ctx.fillRect(x_pos % 1 * cnv.width, 150, 100, 100)

    x_pos += .001;

    if(x_pos > cnv.width){
        x_pos = 0;
    }
    requestAnimationFrame (draw_frame)
}

function resize_canvas() {
    cnv.width = innerWidth
    cnv.height = innerHeight
}
