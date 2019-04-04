(function() {
    let file
    const asciiEl = document.getElementById('ascii')
    const aEl = document.createElement('a')
    const aElText = document.createTextNode("Download ascii"); 
    aEl.appendChild(aElText)
})();

var capture = (function() {
    file = new Blob([asciiEl.innerHTML], {type: 'text/plain'})
    aEl.href = URL.createObjectURL(file)
    aEl.download = 'myfilename.txt'
    document.querySelectorAll('body')[0].appendChild(aEl)
})();