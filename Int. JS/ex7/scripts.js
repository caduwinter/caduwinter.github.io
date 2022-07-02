const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', total);

function total(){
    var i = parseInt(document.getElementById("input1").value);
    var j = parseInt(document.getElementById("input2").value);
    var x = parseInt(document.getElementById("input3").value);
    var y = parseInt(document.getElementById("input4").value);
    
    i = (i * y) + x + (j * 0.05);
    result.innerHTML = i;
}