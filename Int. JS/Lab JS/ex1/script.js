const button = document.getElementById('button');
const res = document.getElementById('res');


button.addEventListener('click', fatorial)
function fatorial(){
    var input = document.getElementById('input1').value;
    var x = parseInt(input)
    var y = x;
    console.log(x);
    for(var i = 1; i < x; i++){
        console.log(i);
        y *= i;
        console.log(y);
        
    }
    res.innerHTML = y;
} 