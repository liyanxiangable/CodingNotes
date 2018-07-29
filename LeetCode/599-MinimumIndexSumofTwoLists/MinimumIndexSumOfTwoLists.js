/**
 * Created by liyanxiang on 2017/8/21.
 */
/**
 * @param {string[]} list1
 * @param {string[]} list2
 * @return {string[]}
 */
var findRestaurant = function(list1, list2) {
    let common = [];
    let newList1 = [], newList2 = [];
    list1.forEach((restaurant, index) => {
        newList1.push({name: restaurant, ranking: index});
    });
    list2.forEach((restaurant, index) => {
        newList2.push({name: restaurant, ranking: index});
    });
    newList1.forEach(item1 => {
        for (let item2 of newList2) {
            if (item1.name === item2.name) {
                common.push({name: item2.name, ranking: item2.ranking + item1.ranking});
            }
        }
    });
    common.sort(function (a, b) { return a.ranking - b.ranking });
    let someName = [];
    for (let item of common) {
        if (item.ranking === common[0].ranking) {
            someName.push(item.name);
        } else {
            break;
        }
    }
    return someName;
};