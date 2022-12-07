var images = ["Images\\PXL_20220911_185013174.jpg","Images\\PXL_20220911_190446050.jpg","Images\\PXL_20220911_190545120.jpg","Images\\PXL_20220911_185801600.jpg"];

function toggleImg(dir) {
    const imgEl = document.getElementById("imgCont");
    let path = imgEl.getAttribute("src");
    let index = images.indexOf(path.replace('../../',''));
    console.log(index)
    let newPath = images[((index + dir) > -1? (index + dir):3)%images.length];
    imgEl.setAttribute("src",`../../${newPath}`);
}