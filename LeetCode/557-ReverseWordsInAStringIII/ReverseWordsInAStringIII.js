/**
 * Created by liyanxiang on 2017/8/13.
 */
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    // 首先进行字符串以空格分隔转为若干小字符串
    let arrs = s.split(' ');
    console.log(arrs);
    let sentence = [];
    // 遍历每个单词
    for (let arr of arrs) {
        // 单词现在为字符串格式，需要将他先转换为数组格式，才能调用reverse方法
        arr = arr.split('').reverse();
        // 然后需要将数组转为字符串，使用join函数，单词变为字符串之后加入数组
        let word = arr.join('');
        sentence.push(word);
        console.log(arr);
    }
    // 最后将总的数组以空格字符合并成字符串
    return sentence.join(' ').toString();
};
reverseWords("hello, gakki! I'm lyx");