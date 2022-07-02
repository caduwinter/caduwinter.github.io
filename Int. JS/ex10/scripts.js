const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', total);

function total(){
    var i = parseInt(document.getElementById("input1").value);
    if(i < 12){
        i = (i * 1.3)
    }
    result.innerHTML = Number(i).toFixed(2);
}