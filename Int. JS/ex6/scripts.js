const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', total);

function total(){
    var i = parseInt(document.getElementById("input1").value);
    i = i + (i * 0.28) + (i*0.45);
    result.innerHTML = i;
}