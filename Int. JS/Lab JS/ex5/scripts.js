const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', prime);

function prime(){
    var tudo = "2";
    var prime = false;
    for(var i = 2; i <= 1000; i++){
        for(var j=2; i > j && i % 2 != 0; j++){
            if(i % j != 0){
                prime = true;
            }
            else if(i % j == 0){
            prime = false;
            break;
            }
        }
        if(prime == true && i % 2 != 0){
            tudo = tudo + ' ' + i.toString();
        }
    }
    result.innerHTML = tudo;
}