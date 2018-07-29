/**
 * Created by liyanxiang on 2017/9/13.
 */
function third(str, n) {
    let objArr = [];
    let nums = str.split(' ');
    for (let num of nums) {
        let obj = {};
        obj.origin = num;
        let lastThree = '';
        let a = 3;
        num = num.split('');
        while (a--) {
            let letter = num.pop();
            if (typeof letter === 'undefined') {
                break;
            } else {
                lastThree = letter + lastThree;
            }
        }
        obj.lastThree = lastThree;
        objArr.push(obj);
    }
    objArr.sort(function (a, b) {
        return Number(a.lastThree) - Number(b.lastThree);
    });
    return Number(objArr[n - 1].origin);
}

console.log(third('61651981 12 56741981981 23 9374 2222', 4));