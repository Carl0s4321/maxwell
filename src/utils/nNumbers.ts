export function pickNNumbersFromRange(n: number, max: number) {

var arr = [];
while(arr.length < n){
    var r = Math.floor(Math.random() * max) + 1;
    if(arr.indexOf(r) === -1) arr.push(r);
}
  return arr;
}