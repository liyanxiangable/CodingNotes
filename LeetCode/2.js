/**
 * Created by liyanxiang on 2017/9/13.
 */
function second(IPs) {
    let IP2 = IPs[1].split('.');
    let IP3 = IPs[2].split('.');
    for (let i = 0; i < IP1.length; i++) {
        if (IP2[i] < IP3[i]) {
            return 'Overlap IP';
        } else if (IP2[i] > IP3[i]) {
            return 'No Overlap IP';
        } else if (IP2[i] === IP3[i]) {
            continue;
        }
    }
    return 'Overlap IP';
}