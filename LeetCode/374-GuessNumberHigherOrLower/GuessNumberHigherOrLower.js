/**
 * Created by liyanxiang on 2017/8/29.
 */
// Forward declaration of guess API.
// @param num, your guess
// @return -1 if my number is lower, 1 if my number is higher, otherwise return 0
int guess(int num);

class Solution {
    public:
        int guessNumber(int n) {
    int begin = 1;
    int end = n;
    int number;
    while (begin <= end) {
    number = begin + ((end - begin) >> 2);
    int answer = guess(number);
    if (answer == -1) {
    end = number - 1;
} else if (answer == 1) {
    begin = number + 1;
} else if (answer == 0) {
    return number;
}
}
return number;
}
};