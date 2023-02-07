class HugeNumber {
    constructor(arrSize) {
        this.neg = false;
        this.num = new Uint32Array(arrSize);
    }

    static fromString(str) {
        // I want to thank: https://stackoverflow.com/questions/11006844/convert-a-very-large-number-from-decimal-string-to-binary-representation
        let stack = "";
        while (str != "0") {
            stack = (~~str[str.length - 1] % 2 == 0 ? 0 : 1).toString() + stack;
            str = this.divByTwo(str);
        }
        let arrSize = Math.ceil(stack.length / 32);
        let h = new HugeNumber(arrSize);
        let i = 0;
        while (stack.length > 0) {
            let n = stack.slice(-32);
            stack = stack.slice(0, -32);
            h.num[i] = parseInt(n, 2);
            i++;
        }
        return h;
    }

    static divByTwo(s) {
        let new_s = "";
        let add = 0;
        for (let i = 0; i < s.length; i++) {
            let new_dgt = ~~(s[i] / 2) + add;
            new_s += new_dgt.toString();
            add = ~~s[i] % 2 == 0 ? 0 : 5;
        }
        if (new_s != "0" && new_s.startsWith("0")) new_s = new_s.slice(1);
        return new_s;
    }

    toBinary() {
        let s = "";
        for (let i = 0; i < this.num.length; i++) {
            s = this.num[i].toString(2).padStart(32, "0") + s;
        }
        return s;
    }

    addition() {}

    multiply() {}

    exponent() {}
}

let h = HugeNumber.fromString("9223372036854775818");
console.log(h);
console.log(h.toBinary());

let h2 = HugeNumber.fromString(
    "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010" // 4 uint64s
);
console.log(h2);
console.log(h2.toBinary());
