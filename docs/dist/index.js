const makeArray = (N, init = 0) => Array.from(Array(N), (v, i) => i + init)
const sum = arr => arr.reduce((prev, cur) => prev + cur, 0)
const min = arr => arr.reduce((prev, cur) => Math.min(prev, cur))
const max = arr => arr.reduce((prev, cur) => Math.max(prev, cur))

const diffColor = (color1, color2) => Math.sqrt(sum(['r', 'g', 'b'].map(v => Math.pow(color2[v] - color1[v], 2))))

const loadImage = url => new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
        resolve(img)
    }
    img.src = url
})

const convertCanvasToImage = canvas => {
    var img = new Image()
    img.src = canvas.toDataURL('image/png')
    return img
}

const convertImageToCanvas = (img) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    // $(document.body).append(canvas)
    $('#source').html('').append(canvas)

    return canvas
}

const generateCanvas = (imgData, size) => {
    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imgData, 0, 0)

    const img = convertCanvasToImage(canvas)
    // $(document.body).append(img)
    $('#target').html('').append(img)

    return canvas
}

const timeInfo = '抠图耗时'

$('button').click(() => {
    console.time(timeInfo)
    const url = $('select').val()
    loadImage(url)
    .then(img => {
        const {width, height} = img
        const ctx = convertImageToCanvas(img).getContext('2d')
        const imgData = ctx.getImageData(0, 0, width, height)

        console.time('时间1')
        console.time('时间2')
        // let imgDataList = makeArray(width * height).map(i => {
        window.imgDataList = makeArray(width * height).map(i => {
            const [r, g, b, a] = imgData.data.slice(i * 4, (i + 1) * 4)
            const y = Math.floor(i / width)
            const x = i - y * width
            return {r, g, b, a, x, y}
        })
        .filter(v => v.a === 255)
        .filter(v => sum(['r', 'g', 'b'].map(v2 => v[v2])) <= 240 * 3)
        // .filter(v => min(['r', 'g', 'b'].map(v2 => 255 - v[v2])) >= 10)
        // console.log(imgDataList)
        console.timeEnd('时间1')
        const pixelLeft = min(imgDataList.map(v => v.x))
        const pixelRight = max(imgDataList.map(v => v.x))
        const pixelTop = min(imgDataList.map(v => v.y))
        const pixelBottom = max(imgDataList.map(v => v.y))
        console.timeEnd('时间2')

        // console.log(pixelLeft, pixelRight, pixelTop, pixelBottom)
        // console.log(pixelLeft, pixelRight - pixelLeft, pixelTop, pixelBottom - pixelTop)

        const imgData2 = ctx.getImageData(pixelLeft, pixelTop, pixelRight - pixelLeft + 1, pixelBottom - pixelTop + 1)


        generateCanvas(imgData2, {
            width: pixelRight - pixelLeft + 1,
            height: pixelBottom - pixelTop + 1
        })
        console.timeEnd(timeInfo)
    })
})
