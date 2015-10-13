(function() {
    var myEl = document.getElementById('button-next');
    myEl.addEventListener('click', function() {
        alert('Hello world');
    }, false);

    myEl.addEventListener('click', function() {
        alert('Hello world again!!!');
    }, false);
})();
