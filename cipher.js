/**
 * ----------------------------------------------------------------
 * Base 4 加密/解密逻辑
 * 符号：是 (0), 你 (1), 奶奶 (2), ！ (3)
 * Base 256 <-> Base 4 转换
 * ----------------------------------------------------------------
 */

// 密文符号集 (对应 0, 1, 2, 3)
const ENCRYPT_MAPPING = ["是", "你", "奶奶", "！"];

// 密文符号到数字的逆向映射
const DECRYPT_MAPPING = new Map([
    ["是", 0],
    ["你", 1],
    ["奶奶", 2],
    ["！", 3]
]);

// 进制基数：BigInt(4)
const BASE = 4n; 

/**
 * 【私有方法】将 BigInt D 转换为四进制符号密文
 * @param {bigint} number - 待转换的大整数
 * @returns {string} 密文
 */
function bigIntToBase4Cipher(number) {
    if (number === 0n) {
        return ENCRYPT_MAPPING[0]; // 对应 BigInteger.ZERO 的特殊处理
    }

    let ciphertextBuilder = "";
    let tempNumber = number;

    while (tempNumber > 0n) {
        // 取余数 (0, 1, 2, or 3)
        const remainder = Number(tempNumber % BASE);

        // 将余数映射为密文符号，并插入到结果字符串的最前面
        ciphertextBuilder = ENCRYPT_MAPPING[remainder] + ciphertextBuilder;

        // D = D / 4
        tempNumber /= BASE;
    }

    return ciphertextBuilder;
}

/**
 * 【私有方法】将四进制符号密文转换为 BigInt D
 * @param {string} ciphertext - 密文
 * @returns {bigint} 大整数 D
 */
function base4CipherToBigInt(ciphertext) {
    let number = 0n;
    let i = 0;

    while (i < ciphertext.length) {
        let symbol = null;
        let value = null;

        // 1. 优先检查双字符符号 "奶奶"
        if (i + 2 <= ciphertext.length && ciphertext.substring(i, i + 2) === "奶奶") {
            symbol = "奶奶";
            value = DECRYPT_MAPPING.get("奶奶");
        } else {
            // 2. 检查单字符符号 "是", "你", "！"
            const charStr = ciphertext.charAt(i);
            value = DECRYPT_MAPPING.get(charStr);
            if (value !== undefined) {
                symbol = charStr;
            }
        }

        if (value === undefined) {
            // 🚨 遇到非法字符，抛出异常或返回错误信息
            throw new Error(`解密失败：密文中包含非法符号在位置 ${i}`);
        }

        // D = D * BASE + value
        // BigInt(value) 将数字转为 BigInt，以便进行 BigInt 运算
        number = number * BASE + BigInt(value);

        // 更新索引
        i += symbol.length; // "奶奶" 移动 2 位，其他符号移动 1 位
    }

    return number;
}


// =========================================================================
// 公共接口：绑定到 HTML 按钮
// =========================================================================

/**
 * 将任意明文加密为由 "是", "你", "奶奶", "！" 构成的密文。
 * 流程：明文(UTF-8) -> 字节数组 -> BigInt D -> 四进制字符串 -> 密文。
 */
function handleEncrypt() {
    try {
        const plaintext = document.getElementById('userInput').value;
        const output = document.getElementById('outputDisplay');

        if (!plaintext) {
            output.value = "";
            return;
        }

        // 1. 明文转字节数组（Uint8Array - UTF-8）
        const encoder = new TextEncoder();
        const bytes = encoder.encode(plaintext);

        // 2. 字节数组转 BigInt D (Base-256)
        // 模拟 Java BigInteger 构造函数，需要将字节流视为一个大数字。
        let number = 0n;
        
        // 我们从高位（左侧）字节开始累加，相当于 D = D * 256 + byteValue
        for (const byte of bytes) {
            number = number * 256n + BigInt(byte);
        }

        // 3. BigInt D 转四进制并映射到密文符号
        output.value = bigIntToBase4Cipher(number);

    } catch (e) {
        document.getElementById('outputDisplay').value = "加密出错：" + e.message;
        console.error("加密错误:", e);
    }
}

/**
 * 将由 "是", "你", "奶奶", "！" 构成的密文解密回明文。
 * 流程：密文 -> 四进制字符串 -> BigInt D -> 字节数组 -> 明文(UTF-8)。
 */
function handleDecrypt() {
    try {
        const ciphertext = document.getElementById('userInput').value;
        const output = document.getElementById('outputDisplay');

        if (!ciphertext) {
            output.value = "";
            return;
        }

        // 1. 密文符号转 BigInt D
        const number = base4CipherToBigInt(ciphertext);

        // 2. BigInt D 转字节数组 (Base-256)
        // D 到 Base 256 的转换：类似加密的逆过程
        const byteValues = [];
        let tempNumber = number;

        if (tempNumber === 0n) {
            // 如果数字是 0，说明原始输入是空（虽然不太可能，但保险起见）
            output.value = "";
            return;
        }

        while (tempNumber > 0n) {
            // 取余数 (0-255)
            const remainder = Number(tempNumber % 256n);
            byteValues.unshift(remainder); // 从低位到高位，所以要插在数组头部

            // D = D / 256
            tempNumber /= 256n;
        }
        
        // 3. 字节数组转明文
        const bytes = new Uint8Array(byteValues);
        const decoder = new TextDecoder('utf-8');
        output.value = decoder.decode(bytes);

    } catch (e) {
        document.getElementById('outputDisplay').value = "解密出错：" + e.message;
        console.error("解密错误:", e);
    }
}