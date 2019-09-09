const util = {
    //根据数组或对象内对象中的某个key获取该对象
    //支持格式[{},{}],{x:{},y:{}}
    //返回一个匹配的数组
    getObjByKey(target, keyName, matchValue) {
        let result = [];

        for (let key in target) {
            if (target[key][keyName] == matchValue) {
                result.push(target[key]);
            }
        }
        return result;
    },
    //随机一个数字,在前两个参数范围内,如果只传一个参数，则返回从0 到 该参数之间的随机整数
    randomNum(num1, num2) {
        if (num2) {
            let offset = Math.abs(num1 - num2),
                randomNum = Math.floor(Math.random() * offset);

            return num1 > num2 ? randomNum + num2 : randomNum + num1;
        } else {

            return Math.floor(Math.random() * num1);
        }
    }
}