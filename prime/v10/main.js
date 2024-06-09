const lang_data = {
    "ja": {
        "isPrime": "素数です。",
        "isNotPrime": "素数ではありません。",
        "Over": "この値は計算可能な値の範囲外です。",
        "NaN": "数値が入力されていないため判定できませんでした。",
        "Calculating":"計算中...",
        "TestProgressing":"判定中...",
        "TestProgressingMlti":"マルチスレッドで判定中...",
    },
    "en": {
        "isPrime": "A prime number.",
        "isNotPrime": "Not a prime number.",
        "Over": "This value is outside the range of computable values.",
        "NaN": "The decision could not be made because no values were entered.",
        "Calculateing":"Calculating...",
        "TestProgressing":"Testing in progress...",
        "TestProgressingMlti":"Multithreaded testing in progress...",
    }
}

var lang = "ja";

function MultiLangDisp(type,locate,Number,NumberOfWorkers,time,resultStr) {
    var lang_data_ML = {
        "ja":{
            "GMLcalc1":"計算中",
            "GMLcalc2":"",
            "GMLcalc3":"スレッドで計算中",
            "GMLresu1t1": "",
            "GMLresu1t2":"桁の自然数",
            "GMLresu1t3":"の約数は",
            "GMLresult1":"計算結果",
            "GMLti1":"計算時間",
            "GMLti2":"",
            "GMLti3":"スレッドで計算"
        },
        "en":{
            "GMLcalc1":"Testing in progress",
            "GMLcalc2":"Calculating in ",
            "GMLcalc3":" threads.",
            "GMLresu1t1":"The divisor of the ",
            "GMLresu1t2":"-digit natural number ",
            "GMLresu1t3":" is",
            "GMLresult1":"Calculation results",
            "GMLti1":"Calculation time",
            "GMLti2":"Calculated with ",
            "GMLti3":" threads"
        }
    }
    if (type == "G") {
        //約数の場合
        switch (locate) {
            case "calculatingMLti" : {
                result.innerHTML = `${lang_data_ML[lang]["GMLcalc1"]}...(${lang_data_ML[lang]["GMLcalc2"]}${NumberOfWorkers}${lang_data_ML[lang]["GMLcalc3"]})`;
            };
                break;

            case "resu1t": {
                resu1t.innerHTML = `${lang_data_ML[lang]["GMLresu1t1"]}${Number.toString().length}${lang_data_ML[lang]["GMLresu1t2"]}${Number}${lang_data_ML[lang]["GMLresu1t3"]}`;
            }
                break;
            case "END": {
                resu1t.innerHTML = `${lang_data_ML[lang]["GMLresu1t1"]}${Number.toString().length}${lang_data_ML[lang]["GMLresu1t2"]}${Number}${lang_data_ML[lang]["GMLresu1t3"]}`;
                result.innerHTML = `${lang_data_ML[lang]["GMLresult1"]} : ${resultStr}`;
                ti.innerHTML = `${lang_data_ML[lang]["GMLti1"]} : ${time}ms (${lang_data_ML[lang]["GMLti2"]}${NumberOfWorkers}${lang_data_ML[lang]["GMLti3"]})`;
            }
                break;
        }
    }
}

function PRIME_v1(num) {
    if (num <= 1) return false;
    if (num == 2) return true;
    for (var i = 2; i < num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

function PRIME_v2(num) {
    if (num <= 1) {
        return false;
    }
    for (var i = 2; i * i <= num; i++) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}

function PRIME_v3(num) {
    if (num <= 1) {
        return false;
    } else if (num == 2 || num == 3) {
        return true;
    } else if (num % 2 == 0) {
        return false;
    } else {
        for (let i = 3; i * i <= num; i += 2) {
            if (num % i == 0) {
                return false;
            }
        }
        return true;
    }
}

function PRIME_v4(n) {
    if (n <= 1) return false;
    if (n % 2 == 0) { return (n == 2); }
    if (n % 3 == 0) { return (n == 3); }

    for (var i = 5; i * i <= n; i += 6) {
        if (n % i == 0) { return false; }
        if (n % (i + 2) == 0) { return false; }
    }
    return true;
}


function PRIME_v5(n) { if (n % 2 == 0) { return n == 2 }; if (n % 3 == 0) { return n == 3 }; if (n % 5 == 0) { return n == 5 }; if (n % 7 == 0) { return n == 7 }; if (n % 11 == 0) { return n == 11 }; if (n % 13 == 0) { return n == 13 }; if (n % 17 == 0) { return n == 17 }; if (n % 19 == 0) { return n == 19 }; if (n % 23 == 0) { return n == 23 }; if (n % 29 == 0) { return n == 29 }; for (var i = 30; i * i <= n; i += 30) { if (n % (i + 1) == 0 || n % (i + 7) == 0 || n % (i + 11) == 0 || n % (i + 13) == 0 || n % (i + 17) == 0 || n % (i + 19) == 0 || n % (i + 23) == 0 || n % (i + 29) == 0) { return false } }; return true }

function PRIME_v6(n) {
    if (n <= 1) {
        return false
    }

    var p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];

    for (var i = 0; i < p.length; i++) {
        if (n % p[i] == 0) {
            return (n == p[i]);
        }
    }

    for (var i = 211; i * i <= n; i += 210) {
        if (
            n % i == 0 || n % (i + 10) == 0 || n % (i + 12) == 0 || n % (i + 16) == 0 || n % (i + 18) == 0 || n % (i + 22) == 0 || n % (i + 28) == 0 || n % (i + 30) == 0 || n % (i + 36) == 0 || n % (i + 40) == 0 || n % (i + 42) == 0 || n % (i + 46) == 0 || n % (i + 52) == 0 || n % (i + 58) == 0 || n % (i + 60) == 0 || n % (i + 66) == 0 || n % (i + 70) == 0 || n % (i + 72) == 0 || n % (i + 78) == 0 || n % (i + 82) == 0 || n % (i + 88) == 0 || n % (i + 96) == 0 || n % (i + 100) == 0 || n % (i + 102) == 0 || n % (i + 106) == 0 || n % (i + 108) == 0 || n % (i + 112) == 0 || n % (i + 120) == 0 || n % (i + 126) == 0 || n % (i + 130) == 0 || n % (i + 136) == 0 || n % (i + 138) == 0 || n % (i + 142) == 0 || n % (i + 148) == 0 || n % (i + 150) == 0 || n % (i + 156) == 0 || n % (i + 162) == 0 || n % (i + 166) == 0 || n % (i + 168) == 0 || n % (i + 172) == 0 || n % (i + 178) == 0 || n % (i + 180) == 0 || n % (i + 186) == 0 || n % (i + 190) == 0 || n % (i + 192) == 0 || n % (i + 196) == 0 || n % (i + 198) == 0 || n % (i + 208) == 0
        ) { return false; }
    }
    return true;
}

function PRIME_v7(n) { if (n <= 1) { return false }; var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309]; for (var i = 0; i < 343; i++) { if (n % P[i] == 0) { return (n == P[i]); } }; for (var i = 2310; i * i <= n; i += 2310) { if (n % (i + 1) == 0 || n % (i + 13) == 0 || n % (i + 17) == 0 || n % (i + 19) == 0 || n % (i + 23) == 0 || n % (i + 29) == 0 || n % (i + 31) == 0 || n % (i + 37) == 0 || n % (i + 41) == 0 || n % (i + 43) == 0 || n % (i + 47) == 0 || n % (i + 53) == 0 || n % (i + 59) == 0 || n % (i + 61) == 0 || n % (i + 67) == 0 || n % (i + 71) == 0 || n % (i + 73) == 0 || n % (i + 79) == 0 || n % (i + 83) == 0 || n % (i + 89) == 0 || n % (i + 97) == 0 || n % (i + 101) == 0 || n % (i + 103) == 0 || n % (i + 107) == 0 || n % (i + 109) == 0 || n % (i + 113) == 0 || n % (i + 127) == 0 || n % (i + 131) == 0 || n % (i + 137) == 0 || n % (i + 139) == 0 || n % (i + 149) == 0 || n % (i + 151) == 0 || n % (i + 157) == 0 || n % (i + 163) == 0 || n % (i + 167) == 0 || n % (i + 169) == 0 || n % (i + 173) == 0 || n % (i + 179) == 0 || n % (i + 181) == 0 || n % (i + 191) == 0 || n % (i + 193) == 0 || n % (i + 197) == 0 || n % (i + 199) == 0 || n % (i + 211) == 0 || n % (i + 221) == 0 || n % (i + 223) == 0 || n % (i + 227) == 0 || n % (i + 229) == 0 || n % (i + 233) == 0 || n % (i + 239) == 0 || n % (i + 241) == 0 || n % (i + 247) == 0 || n % (i + 251) == 0 || n % (i + 257) == 0 || n % (i + 263) == 0 || n % (i + 269) == 0 || n % (i + 271) == 0 || n % (i + 277) == 0 || n % (i + 281) == 0 || n % (i + 283) == 0 || n % (i + 289) == 0 || n % (i + 293) == 0 || n % (i + 299) == 0 || n % (i + 307) == 0 || n % (i + 311) == 0 || n % (i + 313) == 0 || n % (i + 317) == 0 || n % (i + 323) == 0 || n % (i + 331) == 0 || n % (i + 337) == 0 || n % (i + 347) == 0 || n % (i + 349) == 0 || n % (i + 353) == 0 || n % (i + 359) == 0 || n % (i + 361) == 0 || n % (i + 367) == 0 || n % (i + 373) == 0 || n % (i + 377) == 0 || n % (i + 379) == 0 || n % (i + 383) == 0 || n % (i + 389) == 0 || n % (i + 391) == 0 || n % (i + 397) == 0 || n % (i + 401) == 0 || n % (i + 403) == 0 || n % (i + 409) == 0 || n % (i + 419) == 0 || n % (i + 421) == 0 || n % (i + 431) == 0 || n % (i + 433) == 0 || n % (i + 437) == 0 || n % (i + 439) == 0 || n % (i + 443) == 0 || n % (i + 449) == 0 || n % (i + 457) == 0 || n % (i + 461) == 0 || n % (i + 463) == 0 || n % (i + 467) == 0 || n % (i + 479) == 0 || n % (i + 481) == 0 || n % (i + 487) == 0 || n % (i + 491) == 0 || n % (i + 493) == 0 || n % (i + 499) == 0 || n % (i + 503) == 0 || n % (i + 509) == 0 || n % (i + 521) == 0 || n % (i + 523) == 0 || n % (i + 527) == 0 || n % (i + 529) == 0 || n % (i + 533) == 0 || n % (i + 541) == 0 || n % (i + 547) == 0 || n % (i + 551) == 0 || n % (i + 557) == 0 || n % (i + 559) == 0 || n % (i + 563) == 0 || n % (i + 569) == 0 || n % (i + 571) == 0 || n % (i + 577) == 0 || n % (i + 587) == 0 || n % (i + 589) == 0 || n % (i + 593) == 0 || n % (i + 599) == 0 || n % (i + 601) == 0 || n % (i + 607) == 0 || n % (i + 611) == 0 || n % (i + 613) == 0 || n % (i + 617) == 0 || n % (i + 619) == 0 || n % (i + 629) == 0 || n % (i + 631) == 0 || n % (i + 641) == 0 || n % (i + 643) == 0 || n % (i + 647) == 0 || n % (i + 653) == 0 || n % (i + 659) == 0 || n % (i + 661) == 0 || n % (i + 667) == 0 || n % (i + 673) == 0 || n % (i + 677) == 0 || n % (i + 683) == 0 || n % (i + 689) == 0 || n % (i + 691) == 0 || n % (i + 697) == 0 || n % (i + 701) == 0 || n % (i + 703) == 0 || n % (i + 709) == 0 || n % (i + 713) == 0 || n % (i + 719) == 0 || n % (i + 727) == 0 || n % (i + 731) == 0 || n % (i + 733) == 0 || n % (i + 739) == 0 || n % (i + 743) == 0 || n % (i + 751) == 0 || n % (i + 757) == 0 || n % (i + 761) == 0 || n % (i + 767) == 0 || n % (i + 769) == 0 || n % (i + 773) == 0 || n % (i + 779) == 0 || n % (i + 787) == 0 || n % (i + 793) == 0 || n % (i + 797) == 0 || n % (i + 799) == 0 || n % (i + 809) == 0 || n % (i + 811) == 0 || n % (i + 817) == 0 || n % (i + 821) == 0 || n % (i + 823) == 0 || n % (i + 827) == 0 || n % (i + 829) == 0 || n % (i + 839) == 0 || n % (i + 841) == 0 || n % (i + 851) == 0 || n % (i + 853) == 0 || n % (i + 857) == 0 || n % (i + 859) == 0 || n % (i + 863) == 0 || n % (i + 871) == 0 || n % (i + 877) == 0 || n % (i + 881) == 0 || n % (i + 883) == 0 || n % (i + 887) == 0 || n % (i + 893) == 0 || n % (i + 899) == 0 || n % (i + 901) == 0 || n % (i + 907) == 0 || n % (i + 911) == 0 || n % (i + 919) == 0 || n % (i + 923) == 0 || n % (i + 929) == 0 || n % (i + 937) == 0 || n % (i + 941) == 0 || n % (i + 943) == 0 || n % (i + 947) == 0 || n % (i + 949) == 0 || n % (i + 953) == 0 || n % (i + 961) == 0 || n % (i + 967) == 0 || n % (i + 971) == 0 || n % (i + 977) == 0 || n % (i + 983) == 0 || n % (i + 989) == 0 || n % (i + 991) == 0 || n % (i + 997) == 0 || n % (i + 1003) == 0 || n % (i + 1007) == 0 || n % (i + 1009) == 0 || n % (i + 1013) == 0 || n % (i + 1019) == 0 || n % (i + 1021) == 0 || n % (i + 1027) == 0 || n % (i + 1031) == 0 || n % (i + 1033) == 0 || n % (i + 1037) == 0 || n % (i + 1039) == 0 || n % (i + 1049) == 0 || n % (i + 1051) == 0 || n % (i + 1061) == 0 || n % (i + 1063) == 0 || n % (i + 1069) == 0 || n % (i + 1073) == 0 || n % (i + 1079) == 0 || n % (i + 1081) == 0 || n % (i + 1087) == 0 || n % (i + 1091) == 0 || n % (i + 1093) == 0 || n % (i + 1097) == 0 || n % (i + 1103) == 0 || n % (i + 1109) == 0 || n % (i + 1117) == 0 || n % (i + 1121) == 0 || n % (i + 1123) == 0 || n % (i + 1129) == 0 || n % (i + 1139) == 0 || n % (i + 1147) == 0 || n % (i + 1151) == 0 || n % (i + 1153) == 0 || n % (i + 1157) == 0 || n % (i + 1159) == 0 || n % (i + 1163) == 0 || n % (i + 1171) == 0 || n % (i + 1181) == 0 || n % (i + 1187) == 0 || n % (i + 1189) == 0 || n % (i + 1193) == 0 || n % (i + 1201) == 0 || n % (i + 1207) == 0 || n % (i + 1213) == 0 || n % (i + 1217) == 0 || n % (i + 1219) == 0 || n % (i + 1223) == 0 || n % (i + 1229) == 0 || n % (i + 1231) == 0 || n % (i + 1237) == 0 || n % (i + 1241) == 0 || n % (i + 1247) == 0 || n % (i + 1249) == 0 || n % (i + 1259) == 0 || n % (i + 1261) == 0 || n % (i + 1271) == 0 || n % (i + 1273) == 0 || n % (i + 1277) == 0 || n % (i + 1279) == 0 || n % (i + 1283) == 0 || n % (i + 1289) == 0 || n % (i + 1291) == 0 || n % (i + 1297) == 0 || n % (i + 1301) == 0 || n % (i + 1303) == 0 || n % (i + 1307) == 0 || n % (i + 1313) == 0 || n % (i + 1319) == 0 || n % (i + 1321) == 0 || n % (i + 1327) == 0 || n % (i + 1333) == 0 || n % (i + 1339) == 0 || n % (i + 1343) == 0 || n % (i + 1349) == 0 || n % (i + 1357) == 0 || n % (i + 1361) == 0 || n % (i + 1363) == 0 || n % (i + 1367) == 0 || n % (i + 1369) == 0 || n % (i + 1373) == 0 || n % (i + 1381) == 0 || n % (i + 1387) == 0 || n % (i + 1391) == 0 || n % (i + 1399) == 0 || n % (i + 1403) == 0 || n % (i + 1409) == 0 || n % (i + 1411) == 0 || n % (i + 1417) == 0 || n % (i + 1423) == 0 || n % (i + 1427) == 0 || n % (i + 1429) == 0 || n % (i + 1433) == 0 || n % (i + 1439) == 0 || n % (i + 1447) == 0 || n % (i + 1451) == 0 || n % (i + 1453) == 0 || n % (i + 1457) == 0 || n % (i + 1459) == 0 || n % (i + 1469) == 0 || n % (i + 1471) == 0 || n % (i + 1481) == 0 || n % (i + 1483) == 0 || n % (i + 1487) == 0 || n % (i + 1489) == 0 || n % (i + 1493) == 0 || n % (i + 1499) == 0 || n % (i + 1501) == 0 || n % (i + 1511) == 0 || n % (i + 1513) == 0 || n % (i + 1517) == 0 || n % (i + 1523) == 0 || n % (i + 1531) == 0 || n % (i + 1537) == 0 || n % (i + 1541) == 0 || n % (i + 1543) == 0 || n % (i + 1549) == 0 || n % (i + 1553) == 0 || n % (i + 1559) == 0 || n % (i + 1567) == 0 || n % (i + 1571) == 0 || n % (i + 1577) == 0 || n % (i + 1579) == 0 || n % (i + 1583) == 0 || n % (i + 1591) == 0 || n % (i + 1597) == 0 || n % (i + 1601) == 0 || n % (i + 1607) == 0 || n % (i + 1609) == 0 || n % (i + 1613) == 0 || n % (i + 1619) == 0 || n % (i + 1621) == 0 || n % (i + 1627) == 0 || n % (i + 1633) == 0 || n % (i + 1637) == 0 || n % (i + 1643) == 0 || n % (i + 1649) == 0 || n % (i + 1651) == 0 || n % (i + 1657) == 0 || n % (i + 1663) == 0 || n % (i + 1667) == 0 || n % (i + 1669) == 0 || n % (i + 1679) == 0 || n % (i + 1681) == 0 || n % (i + 1691) == 0 || n % (i + 1693) == 0 || n % (i + 1697) == 0 || n % (i + 1699) == 0 || n % (i + 1703) == 0 || n % (i + 1709) == 0 || n % (i + 1711) == 0 || n % (i + 1717) == 0 || n % (i + 1721) == 0 || n % (i + 1723) == 0 || n % (i + 1733) == 0 || n % (i + 1739) == 0 || n % (i + 1741) == 0 || n % (i + 1747) == 0 || n % (i + 1751) == 0 || n % (i + 1753) == 0 || n % (i + 1759) == 0 || n % (i + 1763) == 0 || n % (i + 1769) == 0 || n % (i + 1777) == 0 || n % (i + 1781) == 0 || n % (i + 1783) == 0 || n % (i + 1787) == 0 || n % (i + 1789) == 0 || n % (i + 1801) == 0 || n % (i + 1807) == 0 || n % (i + 1811) == 0 || n % (i + 1817) == 0 || n % (i + 1819) == 0 || n % (i + 1823) == 0 || n % (i + 1829) == 0 || n % (i + 1831) == 0 || n % (i + 1843) == 0 || n % (i + 1847) == 0 || n % (i + 1849) == 0 || n % (i + 1853) == 0 || n % (i + 1861) == 0 || n % (i + 1867) == 0 || n % (i + 1871) == 0 || n % (i + 1873) == 0 || n % (i + 1877) == 0 || n % (i + 1879) == 0 || n % (i + 1889) == 0 || n % (i + 1891) == 0 || n % (i + 1901) == 0 || n % (i + 1907) == 0 || n % (i + 1909) == 0 || n % (i + 1913) == 0 || n % (i + 1919) == 0 || n % (i + 1921) == 0 || n % (i + 1927) == 0 || n % (i + 1931) == 0 || n % (i + 1933) == 0 || n % (i + 1937) == 0 || n % (i + 1943) == 0 || n % (i + 1949) == 0 || n % (i + 1951) == 0 || n % (i + 1957) == 0 || n % (i + 1961) == 0 || n % (i + 1963) == 0 || n % (i + 1973) == 0 || n % (i + 1979) == 0 || n % (i + 1987) == 0 || n % (i + 1993) == 0 || n % (i + 1997) == 0 || n % (i + 1999) == 0 || n % (i + 2003) == 0 || n % (i + 2011) == 0 || n % (i + 2017) == 0 || n % (i + 2021) == 0 || n % (i + 2027) == 0 || n % (i + 2029) == 0 || n % (i + 2033) == 0 || n % (i + 2039) == 0 || n % (i + 2041) == 0 || n % (i + 2047) == 0 || n % (i + 2053) == 0 || n % (i + 2059) == 0 || n % (i + 2063) == 0 || n % (i + 2069) == 0 || n % (i + 2071) == 0 || n % (i + 2077) == 0 || n % (i + 2081) == 0 || n % (i + 2083) == 0 || n % (i + 2087) == 0 || n % (i + 2089) == 0 || n % (i + 2099) == 0 || n % (i + 2111) == 0 || n % (i + 2113) == 0 || n % (i + 2117) == 0 || n % (i + 2119) == 0 || n % (i + 2129) == 0 || n % (i + 2131) == 0 || n % (i + 2137) == 0 || n % (i + 2141) == 0 || n % (i + 2143) == 0 || n % (i + 2147) == 0 || n % (i + 2153) == 0 || n % (i + 2159) == 0 || n % (i + 2161) == 0 || n % (i + 2171) == 0 || n % (i + 2173) == 0 || n % (i + 2179) == 0 || n % (i + 2183) == 0 || n % (i + 2197) == 0 || n % (i + 2201) == 0 || n % (i + 2203) == 0 || n % (i + 2207) == 0 || n % (i + 2209) == 0 || n % (i + 2213) == 0 || n % (i + 2221) == 0 || n % (i + 2227) == 0 || n % (i + 2231) == 0 || n % (i + 2237) == 0 || n % (i + 2239) == 0 || n % (i + 2243) == 0 || n % (i + 2249) == 0 || n % (i + 2251) == 0 || n % (i + 2257) == 0 || n % (i + 2263) == 0 || n % (i + 2267) == 0 || n % (i + 2269) == 0 || n % (i + 2273) == 0 || n % (i + 2279) == 0 || n % (i + 2281) == 0 || n % (i + 2287) == 0 || n % (i + 2291) == 0 || n % (i + 2293) == 0 || n % (i + 2297) == 0 || n % (i + 2309) == 0) { return false } } return true; };


function factor_isPRIME_v1(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v2(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v3(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    if (Number.isInteger(num / 2)) return num == 2;
    for (let i = 3; i * i <= num; i += 2) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v4(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    if (Number.isInteger(num / 2)) return num == 2;
    if (Number.isInteger(num / 3)) return num == 3;
    for (let i = 5; i * i <= num; i += 6) {
        if (Number.isInteger(num / i) || Number.isInteger(num / (i + 2))) return false;
    }
    return true;
}

function factor_isPRIME_v5(n) {
    let num = parseInt(n);
    if (num == 2 || num == 3 || num == 5 || num == 7 || num == 11 || num == 13 || num == 17 || num == 19 || num == 23 || num == 29) {
        return true
    }
    if (num <= 1 || Number.isInteger(num / 2) || Number.isInteger(num / 3) || Number.isInteger(num / 5) || Number.isInteger(num / 7) || Number.isInteger(num / 11) || Number.isInteger(num / 13) || Number.isInteger(num / 17) || Number.isInteger(num / 19) || Number.isInteger(num / 23) || Number.isInteger(num / 29)) { return false };
    for (i = 30; i * i <= num; i += 30) {
        if (Number.isInteger(n / (i + 1)) || Number.isInteger(n / (i + 7)) || Number.isInteger(n / (i + 11)) || Number.isInteger(n / (i + 13)) || Number.isInteger(n / (i + 17)) || Number.isInteger(n / (i + 19)) || Number.isInteger(n / (i + 23)) || Number.isInteger(n / (i + 29))) { return false }
    }
    return true
}

function factor_isPRIME_v6(n) {
    let num = parseInt(n);
    if (num == 2 || num == 3 || num == 5 || num == 7 || num == 11 || num == 13 || num == 17 || num == 19 || num == 23 || num == 29 || num == 31 || num == 37 || num == 41 || num == 43 || num == 47 || num == 53 || num == 59 || num == 61 || num == 67 || num == 71 || num == 73 || num == 79 || num == 83 || num == 89 || num == 97 || num == 101 || num == 103 || num == 107 || num == 109 || num == 113 || num == 127 || num == 131 || num == 137 || num == 139 || num == 149 || num == 151 || num == 157 || num == 163 || num == 167 || num == 173 || num == 179 || num == 181 || num == 191 || num == 193 || num == 197 || num == 199) { return true }
    if (num <= 1 || Number.isInteger(num / 2) || Number.isInteger(num / 3) || Number.isInteger(num / 5) || Number.isInteger(num / 7) || Number.isInteger(num / 11) || Number.isInteger(num / 13) || Number.isInteger(num / 17) || Number.isInteger(num / 19) || Number.isInteger(num / 23) || Number.isInteger(num / 29) || Number.isInteger(num / 31) || Number.isInteger(num / 37) || Number.isInteger(num / 41) || Number.isInteger(num / 43) || Number.isInteger(num / 47) || Number.isInteger(num / 53) || Number.isInteger(num / 59) || Number.isInteger(num / 61) || Number.isInteger(num / 67) || Number.isInteger(num / 71) || Number.isInteger(num / 73) || Number.isInteger(num / 79) || Number.isInteger(num / 83) || Number.isInteger(num / 89) || Number.isInteger(num / 97) || Number.isInteger(num / 101) || Number.isInteger(num / 103) || Number.isInteger(num / 107) || Number.isInteger(num / 109) || Number.isInteger(num / 113) || Number.isInteger(num / 127) || Number.isInteger(num / 131) || Number.isInteger(num / 137) || Number.isInteger(num / 139) || Number.isInteger(num / 149) || Number.isInteger(num / 151) || Number.isInteger(num / 157) || Number.isInteger(num / 163) || Number.isInteger(num / 167) || Number.isInteger(num / 173) || Number.isInteger(num / 179) || Number.isInteger(num / 181) || Number.isInteger(num / 191) || Number.isInteger(num / 193) || Number.isInteger(num / 197) || Number.isInteger(num / 199)) { return false };
    for (i = 210; i * i <= num; i += 210) {
        if (Number.isInteger(num / (i + 1)) || Number.isInteger(num / (i + 11)) || Number.isInteger(num / (i + 13)) || Number.isInteger(num / (i + 17)) || Number.isInteger(num / (i + 19)) || Number.isInteger(num / (i + 23)) || Number.isInteger(num / (i + 29)) || Number.isInteger(num / (i + 31)) || Number.isInteger(num / (i + 37)) || Number.isInteger(num / (i + 41)) || Number.isInteger(num / (i + 43)) || Number.isInteger(num / (i + 47)) || Number.isInteger(num / (i + 53)) || Number.isInteger(num / (i + 59)) || Number.isInteger(num / (i + 61)) || Number.isInteger(num / (i + 67)) || Number.isInteger(num / (i + 71)) || Number.isInteger(num / (i + 73)) || Number.isInteger(num / (i + 79)) || Number.isInteger(num / (i + 83)) || Number.isInteger(num / (i + 89)) || Number.isInteger(num / (i + 97)) || Number.isInteger(num / (i + 101)) || Number.isInteger(num / (i + 103)) || Number.isInteger(num / (i + 107)) || Number.isInteger(num / (i + 109)) || Number.isInteger(num / (i + 113)) || Number.isInteger(num / (i + 121)) || Number.isInteger(num / (i + 127)) || Number.isInteger(num / (i + 131)) || Number.isInteger(num / (i + 137)) || Number.isInteger(num / (i + 139)) || Number.isInteger(num / (i + 143)) || Number.isInteger(num / (i + 149)) || Number.isInteger(num / (i + 151)) || Number.isInteger(num / (i + 157)) || Number.isInteger(num / (i + 163)) || Number.isInteger(num / (i + 167)) || Number.isInteger(num / (i + 169)) || Number.isInteger(num / (i + 173)) || Number.isInteger(num / (i + 179)) || Number.isInteger(num / (i + 181)) || Number.isInteger(num / (i + 187)) || Number.isInteger(num / (i + 191)) || Number.isInteger(num / (i + 193)) || Number.isInteger(num / (i + 197)) || Number.isInteger(num / (i + 199)) || Number.isInteger(num / (i + 209))) { return false }
    }
    return true
}

function factor_isPRIME_v7(n) {
    let num = parseInt(n);
    if (num == 2 || num == 3 || num == 5 || num == 7 || num == 11 || num == 13 || num == 17 || num == 19 || num == 23 || num == 29 || num == 31 || num == 37 || num == 41 || num == 43 || num == 47 || num == 53 || num == 59 || num == 61 || num == 67 || num == 71 || num == 73 || num == 79 || num == 83 || num == 89 || num == 97 || num == 101 || num == 103 || num == 107 || num == 109 || num == 113 || num == 127 || num == 131 || num == 137 || num == 139 || num == 149 || num == 151 || num == 157 || num == 163 || num == 167 || num == 173 || num == 179 || num == 181 || num == 191 || num == 193 || num == 197 || num == 199 || num == 211 || num == 223 || num == 227 || num == 229 || num == 233 || num == 239 || num == 241 || num == 251 || num == 257 || num == 263 || num == 269 || num == 271 || num == 277 || num == 281 || num == 283 || num == 293 || num == 307 || num == 311 || num == 313 || num == 317 || num == 331 || num == 337 || num == 347 || num == 349 || num == 353 || num == 359 || num == 367 || num == 373 || num == 379 || num == 383 || num == 389 || num == 397 || num == 401 || num == 409 || num == 419 || num == 421 || num == 431 || num == 433 || num == 439 || num == 443 || num == 449 || num == 457 || num == 461 || num == 463 || num == 467 || num == 479 || num == 487 || num == 491 || num == 499 || num == 503 || num == 509 || num == 521 || num == 523 || num == 541 || num == 547 || num == 557 || num == 563 || num == 569 || num == 571 || num == 577 || num == 587 || num == 593 || num == 599 || num == 601 || num == 607 || num == 613 || num == 617 || num == 619 || num == 631 || num == 641 || num == 643 || num == 647 || num == 653 || num == 659 || num == 661 || num == 673 || num == 677 || num == 683 || num == 691 || num == 701 || num == 709 || num == 719 || num == 727 || num == 733 || num == 739 || num == 743 || num == 751 || num == 757 || num == 761 || num == 769 || num == 773 || num == 787 || num == 797 || num == 809 || num == 811 || num == 821 || num == 823 || num == 827 || num == 829 || num == 839 || num == 853 || num == 857 || num == 859 || num == 863 || num == 877 || num == 881 || num == 883 || num == 887 || num == 907 || num == 911 || num == 919 || num == 929 || num == 937 || num == 941 || num == 947 || num == 953 || num == 967 || num == 971 || num == 977 || num == 983 || num == 991 || num == 997 || num == 1009 || num == 1013 || num == 1019 || num == 1021 || num == 1031 || num == 1033 || num == 1039 || num == 1049 || num == 1051 || num == 1061 || num == 1063 || num == 1069 || num == 1087 || num == 1091 || num == 1093 || num == 1097 || num == 1103 || num == 1109 || num == 1117 || num == 1123 || num == 1129 || num == 1151 || num == 1153 || num == 1163 || num == 1171 || num == 1181 || num == 1187 || num == 1193 || num == 1201 || num == 1213 || num == 1217 || num == 1223 || num == 1229 || num == 1231 || num == 1237 || num == 1249 || num == 1259 || num == 1277 || num == 1279 || num == 1283 || num == 1289 || num == 1291 || num == 1297 || num == 1301 || num == 1303 || num == 1307 || num == 1319 || num == 1321 || num == 1327 || num == 1361 || num == 1367 || num == 1373 || num == 1381 || num == 1399 || num == 1409 || num == 1423 || num == 1427 || num == 1429 || num == 1433 || num == 1439 || num == 1447 || num == 1451 || num == 1453 || num == 1459 || num == 1471 || num == 1481 || num == 1483 || num == 1487 || num == 1489 || num == 1493 || num == 1499 || num == 1511 || num == 1523 || num == 1531 || num == 1543 || num == 1549 || num == 1553 || num == 1559 || num == 1567 || num == 1571 || num == 1579 || num == 1583 || num == 1597 || num == 1601 || num == 1607 || num == 1609 || num == 1613 || num == 1619 || num == 1621 || num == 1627 || num == 1637 || num == 1657 || num == 1663 || num == 1667 || num == 1669 || num == 1693 || num == 1697 || num == 1699 || num == 1709 || num == 1721 || num == 1723 || num == 1733 || num == 1741 || num == 1747 || num == 1753 || num == 1759 || num == 1777 || num == 1783 || num == 1787 || num == 1789 || num == 1801 || num == 1811 || num == 1823 || num == 1831 || num == 1847 || num == 1861 || num == 1867 || num == 1871 || num == 1873 || num == 1877 || num == 1879 || num == 1889 || num == 1901 || num == 1907 || num == 1913 || num == 1931 || num == 1933 || num == 1949 || num == 1951 || num == 1973 || num == 1979 || num == 1987 || num == 1993 || num == 1997 || num == 1999 || num == 2003 || num == 2011 || num == 2017 || num == 2027 || num == 2029 || num == 2039 || num == 2053 || num == 2063 || num == 2069 || num == 2081 || num == 2083 || num == 2087 || num == 2089 || num == 2099 || num == 2111 || num == 2113 || num == 2129 || num == 2131 || num == 2137 || num == 2141 || num == 2143 || num == 2153 || num == 2161 || num == 2179 || num == 2203 || num == 2207 || num == 2213 || num == 2221 || num == 2237 || num == 2239 || num == 2243 || num == 2251 || num == 2267 || num == 2269 || num == 2273 || num == 2281 || num == 2287 || num == 2293 || num == 2297 || num == 2309) { return true }
    if (num <= 1 || Number.isInteger(num / 2) || Number.isInteger(num / 3) || Number.isInteger(num / 5) || Number.isInteger(num / 7) || Number.isInteger(num / 11) || Number.isInteger(num / 13) || Number.isInteger(num / 17) || Number.isInteger(num / 19) || Number.isInteger(num / 23) || Number.isInteger(num / 29) || Number.isInteger(num / 31) || Number.isInteger(num / 37) || Number.isInteger(num / 41) || Number.isInteger(num / 43) || Number.isInteger(num / 47) || Number.isInteger(num / 53) || Number.isInteger(num / 59) || Number.isInteger(num / 61) || Number.isInteger(num / 67) || Number.isInteger(num / 71) || Number.isInteger(num / 73) || Number.isInteger(num / 79) || Number.isInteger(num / 83) || Number.isInteger(num / 89) || Number.isInteger(num / 97) || Number.isInteger(num / 101) || Number.isInteger(num / 103) || Number.isInteger(num / 107) || Number.isInteger(num / 109) || Number.isInteger(num / 113) || Number.isInteger(num / 127) || Number.isInteger(num / 131) || Number.isInteger(num / 137) || Number.isInteger(num / 139) || Number.isInteger(num / 149) || Number.isInteger(num / 151) || Number.isInteger(num / 157) || Number.isInteger(num / 163) || Number.isInteger(num / 167) || Number.isInteger(num / 173) || Number.isInteger(num / 179) || Number.isInteger(num / 181) || Number.isInteger(num / 191) || Number.isInteger(num / 193) || Number.isInteger(num / 197) || Number.isInteger(num / 199) || Number.isInteger(num / 211) || Number.isInteger(num / 223) || Number.isInteger(num / 227) || Number.isInteger(num / 229) || Number.isInteger(num / 233) || Number.isInteger(num / 239) || Number.isInteger(num / 241) || Number.isInteger(num / 251) || Number.isInteger(num / 257) || Number.isInteger(num / 263) || Number.isInteger(num / 269) || Number.isInteger(num / 271) || Number.isInteger(num / 277) || Number.isInteger(num / 281) || Number.isInteger(num / 283) || Number.isInteger(num / 293) || Number.isInteger(num / 307) || Number.isInteger(num / 311) || Number.isInteger(num / 313) || Number.isInteger(num / 317) || Number.isInteger(num / 331) || Number.isInteger(num / 337) || Number.isInteger(num / 347) || Number.isInteger(num / 349) || Number.isInteger(num / 353) || Number.isInteger(num / 359) || Number.isInteger(num / 367) || Number.isInteger(num / 373) || Number.isInteger(num / 379) || Number.isInteger(num / 383) || Number.isInteger(num / 389) || Number.isInteger(num / 397) || Number.isInteger(num / 401) || Number.isInteger(num / 409) || Number.isInteger(num / 419) || Number.isInteger(num / 421) || Number.isInteger(num / 431) || Number.isInteger(num / 433) || Number.isInteger(num / 439) || Number.isInteger(num / 443) || Number.isInteger(num / 449) || Number.isInteger(num / 457) || Number.isInteger(num / 461) || Number.isInteger(num / 463) || Number.isInteger(num / 467) || Number.isInteger(num / 479) || Number.isInteger(num / 487) || Number.isInteger(num / 491) || Number.isInteger(num / 499) || Number.isInteger(num / 503) || Number.isInteger(num / 509) || Number.isInteger(num / 521) || Number.isInteger(num / 523) || Number.isInteger(num / 541) || Number.isInteger(num / 547) || Number.isInteger(num / 557) || Number.isInteger(num / 563) || Number.isInteger(num / 569) || Number.isInteger(num / 571) || Number.isInteger(num / 577) || Number.isInteger(num / 587) || Number.isInteger(num / 593) || Number.isInteger(num / 599) || Number.isInteger(num / 601) || Number.isInteger(num / 607) || Number.isInteger(num / 613) || Number.isInteger(num / 617) || Number.isInteger(num / 619) || Number.isInteger(num / 631) || Number.isInteger(num / 641) || Number.isInteger(num / 643) || Number.isInteger(num / 647) || Number.isInteger(num / 653) || Number.isInteger(num / 659) || Number.isInteger(num / 661) || Number.isInteger(num / 673) || Number.isInteger(num / 677) || Number.isInteger(num / 683) || Number.isInteger(num / 691) || Number.isInteger(num / 701) || Number.isInteger(num / 709) || Number.isInteger(num / 719) || Number.isInteger(num / 727) || Number.isInteger(num / 733) || Number.isInteger(num / 739) || Number.isInteger(num / 743) || Number.isInteger(num / 751) || Number.isInteger(num / 757) || Number.isInteger(num / 761) || Number.isInteger(num / 769) || Number.isInteger(num / 773) || Number.isInteger(num / 787) || Number.isInteger(num / 797) || Number.isInteger(num / 809) || Number.isInteger(num / 811) || Number.isInteger(num / 821) || Number.isInteger(num / 823) || Number.isInteger(num / 827) || Number.isInteger(num / 829) || Number.isInteger(num / 839) || Number.isInteger(num / 853) || Number.isInteger(num / 857) || Number.isInteger(num / 859) || Number.isInteger(num / 863) || Number.isInteger(num / 877) || Number.isInteger(num / 881) || Number.isInteger(num / 883) || Number.isInteger(num / 887) || Number.isInteger(num / 907) || Number.isInteger(num / 911) || Number.isInteger(num / 919) || Number.isInteger(num / 929) || Number.isInteger(num / 937) || Number.isInteger(num / 941) || Number.isInteger(num / 947) || Number.isInteger(num / 953) || Number.isInteger(num / 967) || Number.isInteger(num / 971) || Number.isInteger(num / 977) || Number.isInteger(num / 983) || Number.isInteger(num / 991) || Number.isInteger(num / 997) || Number.isInteger(num / 1009) || Number.isInteger(num / 1013) || Number.isInteger(num / 1019) || Number.isInteger(num / 1021) || Number.isInteger(num / 1031) || Number.isInteger(num / 1033) || Number.isInteger(num / 1039) || Number.isInteger(num / 1049) || Number.isInteger(num / 1051) || Number.isInteger(num / 1061) || Number.isInteger(num / 1063) || Number.isInteger(num / 1069) || Number.isInteger(num / 1087) || Number.isInteger(num / 1091) || Number.isInteger(num / 1093) || Number.isInteger(num / 1097) || Number.isInteger(num / 1103) || Number.isInteger(num / 1109) || Number.isInteger(num / 1117) || Number.isInteger(num / 1123) || Number.isInteger(num / 1129) || Number.isInteger(num / 1151) || Number.isInteger(num / 1153) || Number.isInteger(num / 1163) || Number.isInteger(num / 1171) || Number.isInteger(num / 1181) || Number.isInteger(num / 1187) || Number.isInteger(num / 1193) || Number.isInteger(num / 1201) || Number.isInteger(num / 1213) || Number.isInteger(num / 1217) || Number.isInteger(num / 1223) || Number.isInteger(num / 1229) || Number.isInteger(num / 1231) || Number.isInteger(num / 1237) || Number.isInteger(num / 1249) || Number.isInteger(num / 1259) || Number.isInteger(num / 1277) || Number.isInteger(num / 1279) || Number.isInteger(num / 1283) || Number.isInteger(num / 1289) || Number.isInteger(num / 1291) || Number.isInteger(num / 1297) || Number.isInteger(num / 1301) || Number.isInteger(num / 1303) || Number.isInteger(num / 1307) || Number.isInteger(num / 1319) || Number.isInteger(num / 1321) || Number.isInteger(num / 1327) || Number.isInteger(num / 1361) || Number.isInteger(num / 1367) || Number.isInteger(num / 1373) || Number.isInteger(num / 1381) || Number.isInteger(num / 1399) || Number.isInteger(num / 1409) || Number.isInteger(num / 1423) || Number.isInteger(num / 1427) || Number.isInteger(num / 1429) || Number.isInteger(num / 1433) || Number.isInteger(num / 1439) || Number.isInteger(num / 1447) || Number.isInteger(num / 1451) || Number.isInteger(num / 1453) || Number.isInteger(num / 1459) || Number.isInteger(num / 1471) || Number.isInteger(num / 1481) || Number.isInteger(num / 1483) || Number.isInteger(num / 1487) || Number.isInteger(num / 1489) || Number.isInteger(num / 1493) || Number.isInteger(num / 1499) || Number.isInteger(num / 1511) || Number.isInteger(num / 1523) || Number.isInteger(num / 1531) || Number.isInteger(num / 1543) || Number.isInteger(num / 1549) || Number.isInteger(num / 1553) || Number.isInteger(num / 1559) || Number.isInteger(num / 1567) || Number.isInteger(num / 1571) || Number.isInteger(num / 1579) || Number.isInteger(num / 1583) || Number.isInteger(num / 1597) || Number.isInteger(num / 1601) || Number.isInteger(num / 1607) || Number.isInteger(num / 1609) || Number.isInteger(num / 1613) || Number.isInteger(num / 1619) || Number.isInteger(num / 1621) || Number.isInteger(num / 1627) || Number.isInteger(num / 1637) || Number.isInteger(num / 1657) || Number.isInteger(num / 1663) || Number.isInteger(num / 1667) || Number.isInteger(num / 1669) || Number.isInteger(num / 1693) || Number.isInteger(num / 1697) || Number.isInteger(num / 1699) || Number.isInteger(num / 1709) || Number.isInteger(num / 1721) || Number.isInteger(num / 1723) || Number.isInteger(num / 1733) || Number.isInteger(num / 1741) || Number.isInteger(num / 1747) || Number.isInteger(num / 1753) || Number.isInteger(num / 1759) || Number.isInteger(num / 1777) || Number.isInteger(num / 1783) || Number.isInteger(num / 1787) || Number.isInteger(num / 1789) || Number.isInteger(num / 1801) || Number.isInteger(num / 1811) || Number.isInteger(num / 1823) || Number.isInteger(num / 1831) || Number.isInteger(num / 1847) || Number.isInteger(num / 1861) || Number.isInteger(num / 1867) || Number.isInteger(num / 1871) || Number.isInteger(num / 1873) || Number.isInteger(num / 1877) || Number.isInteger(num / 1879) || Number.isInteger(num / 1889) || Number.isInteger(num / 1901) || Number.isInteger(num / 1907) || Number.isInteger(num / 1913) || Number.isInteger(num / 1931) || Number.isInteger(num / 1933) || Number.isInteger(num / 1949) || Number.isInteger(num / 1951) || Number.isInteger(num / 1973) || Number.isInteger(num / 1979) || Number.isInteger(num / 1987) || Number.isInteger(num / 1993) || Number.isInteger(num / 1997) || Number.isInteger(num / 1999) || Number.isInteger(num / 2003) || Number.isInteger(num / 2011) || Number.isInteger(num / 2017) || Number.isInteger(num / 2027) || Number.isInteger(num / 2029) || Number.isInteger(num / 2039) || Number.isInteger(num / 2053) || Number.isInteger(num / 2063) || Number.isInteger(num / 2069) || Number.isInteger(num / 2081) || Number.isInteger(num / 2083) || Number.isInteger(num / 2087) || Number.isInteger(num / 2089) || Number.isInteger(num / 2099) || Number.isInteger(num / 2111) || Number.isInteger(num / 2113) || Number.isInteger(num / 2129) || Number.isInteger(num / 2131) || Number.isInteger(num / 2137) || Number.isInteger(num / 2141) || Number.isInteger(num / 2143) || Number.isInteger(num / 2153) || Number.isInteger(num / 2161) || Number.isInteger(num / 2179) || Number.isInteger(num / 2203) || Number.isInteger(num / 2207) || Number.isInteger(num / 2213) || Number.isInteger(num / 2221) || Number.isInteger(num / 2237) || Number.isInteger(num / 2239) || Number.isInteger(num / 2243) || Number.isInteger(num / 2251) || Number.isInteger(num / 2267) || Number.isInteger(num / 2269) || Number.isInteger(num / 2273) || Number.isInteger(num / 2281) || Number.isInteger(num / 2287) || Number.isInteger(num / 2293) || Number.isInteger(num / 2297) || Number.isInteger(num / 2309)) { return false };
    for (i = 2310; i * i <= num; i += 2310) {
        if (Number.isInteger(num / (i + 1)) || Number.isInteger(num / (i + 13)) || Number.isInteger(num / (i + 17)) || Number.isInteger(num / (i + 19)) || Number.isInteger(num / (i + 23)) || Number.isInteger(num / (i + 29)) || Number.isInteger(num / (i + 31)) || Number.isInteger(num / (i + 37)) || Number.isInteger(num / (i + 41)) || Number.isInteger(num / (i + 43)) || Number.isInteger(num / (i + 47)) || Number.isInteger(num / (i + 53)) || Number.isInteger(num / (i + 59)) || Number.isInteger(num / (i + 61)) || Number.isInteger(num / (i + 67)) || Number.isInteger(num / (i + 71)) || Number.isInteger(num / (i + 73)) || Number.isInteger(num / (i + 79)) || Number.isInteger(num / (i + 83)) || Number.isInteger(num / (i + 89)) || Number.isInteger(num / (i + 97)) || Number.isInteger(num / (i + 101)) || Number.isInteger(num / (i + 103)) || Number.isInteger(num / (i + 107)) || Number.isInteger(num / (i + 109)) || Number.isInteger(num / (i + 113)) || Number.isInteger(num / (i + 127)) || Number.isInteger(num / (i + 131)) || Number.isInteger(num / (i + 137)) || Number.isInteger(num / (i + 139)) || Number.isInteger(num / (i + 149)) || Number.isInteger(num / (i + 151)) || Number.isInteger(num / (i + 157)) || Number.isInteger(num / (i + 163)) || Number.isInteger(num / (i + 167)) || Number.isInteger(num / (i + 173)) || Number.isInteger(num / (i + 179)) || Number.isInteger(num / (i + 181)) || Number.isInteger(num / (i + 191)) || Number.isInteger(num / (i + 193)) || Number.isInteger(num / (i + 197)) || Number.isInteger(num / (i + 199)) || Number.isInteger(num / (i + 211)) || Number.isInteger(num / (i + 223)) || Number.isInteger(num / (i + 227)) || Number.isInteger(num / (i + 229)) || Number.isInteger(num / (i + 233)) || Number.isInteger(num / (i + 239)) || Number.isInteger(num / (i + 241)) || Number.isInteger(num / (i + 251)) || Number.isInteger(num / (i + 257)) || Number.isInteger(num / (i + 263)) || Number.isInteger(num / (i + 269)) || Number.isInteger(num / (i + 271)) || Number.isInteger(num / (i + 277)) || Number.isInteger(num / (i + 281)) || Number.isInteger(num / (i + 283)) || Number.isInteger(num / (i + 293)) || Number.isInteger(num / (i + 307)) || Number.isInteger(num / (i + 311)) || Number.isInteger(num / (i + 313)) || Number.isInteger(num / (i + 317)) || Number.isInteger(num / (i + 331)) || Number.isInteger(num / (i + 337)) || Number.isInteger(num / (i + 347)) || Number.isInteger(num / (i + 349)) || Number.isInteger(num / (i + 353)) || Number.isInteger(num / (i + 359)) || Number.isInteger(num / (i + 367)) || Number.isInteger(num / (i + 373)) || Number.isInteger(num / (i + 379)) || Number.isInteger(num / (i + 383)) || Number.isInteger(num / (i + 389)) || Number.isInteger(num / (i + 397)) || Number.isInteger(num / (i + 401)) || Number.isInteger(num / (i + 409)) || Number.isInteger(num / (i + 419)) || Number.isInteger(num / (i + 421)) || Number.isInteger(num / (i + 431)) || Number.isInteger(num / (i + 433)) || Number.isInteger(num / (i + 439)) || Number.isInteger(num / (i + 443)) || Number.isInteger(num / (i + 449)) || Number.isInteger(num / (i + 457)) || Number.isInteger(num / (i + 461)) || Number.isInteger(num / (i + 463)) || Number.isInteger(num / (i + 467)) || Number.isInteger(num / (i + 479)) || Number.isInteger(num / (i + 487)) || Number.isInteger(num / (i + 491)) || Number.isInteger(num / (i + 499)) || Number.isInteger(num / (i + 503)) || Number.isInteger(num / (i + 509)) || Number.isInteger(num / (i + 521)) || Number.isInteger(num / (i + 523)) || Number.isInteger(num / (i + 541)) || Number.isInteger(num / (i + 547)) || Number.isInteger(num / (i + 557)) || Number.isInteger(num / (i + 563)) || Number.isInteger(num / (i + 569)) || Number.isInteger(num / (i + 571)) || Number.isInteger(num / (i + 577)) || Number.isInteger(num / (i + 587)) || Number.isInteger(num / (i + 593)) || Number.isInteger(num / (i + 599)) || Number.isInteger(num / (i + 601)) || Number.isInteger(num / (i + 607)) || Number.isInteger(num / (i + 613)) || Number.isInteger(num / (i + 617)) || Number.isInteger(num / (i + 619)) || Number.isInteger(num / (i + 631)) || Number.isInteger(num / (i + 641)) || Number.isInteger(num / (i + 643)) || Number.isInteger(num / (i + 647)) || Number.isInteger(num / (i + 653)) || Number.isInteger(num / (i + 659)) || Number.isInteger(num / (i + 661)) || Number.isInteger(num / (i + 673)) || Number.isInteger(num / (i + 677)) || Number.isInteger(num / (i + 683)) || Number.isInteger(num / (i + 691)) || Number.isInteger(num / (i + 701)) || Number.isInteger(num / (i + 709)) || Number.isInteger(num / (i + 719)) || Number.isInteger(num / (i + 727)) || Number.isInteger(num / (i + 733)) || Number.isInteger(num / (i + 739)) || Number.isInteger(num / (i + 743)) || Number.isInteger(num / (i + 751)) || Number.isInteger(num / (i + 757)) || Number.isInteger(num / (i + 761)) || Number.isInteger(num / (i + 769)) || Number.isInteger(num / (i + 773)) || Number.isInteger(num / (i + 787)) || Number.isInteger(num / (i + 797)) || Number.isInteger(num / (i + 809)) || Number.isInteger(num / (i + 811)) || Number.isInteger(num / (i + 821)) || Number.isInteger(num / (i + 823)) || Number.isInteger(num / (i + 827)) || Number.isInteger(num / (i + 829)) || Number.isInteger(num / (i + 839)) || Number.isInteger(num / (i + 853)) || Number.isInteger(num / (i + 857)) || Number.isInteger(num / (i + 859)) || Number.isInteger(num / (i + 863)) || Number.isInteger(num / (i + 877)) || Number.isInteger(num / (i + 881)) || Number.isInteger(num / (i + 883)) || Number.isInteger(num / (i + 887)) || Number.isInteger(num / (i + 907)) || Number.isInteger(num / (i + 911)) || Number.isInteger(num / (i + 919)) || Number.isInteger(num / (i + 929)) || Number.isInteger(num / (i + 937)) || Number.isInteger(num / (i + 941)) || Number.isInteger(num / (i + 947)) || Number.isInteger(num / (i + 953)) || Number.isInteger(num / (i + 967)) || Number.isInteger(num / (i + 971)) || Number.isInteger(num / (i + 977)) || Number.isInteger(num / (i + 983)) || Number.isInteger(num / (i + 991)) || Number.isInteger(num / (i + 997)) || Number.isInteger(num / (i + 1009)) || Number.isInteger(num / (i + 1013)) || Number.isInteger(num / (i + 1019)) || Number.isInteger(num / (i + 1021)) || Number.isInteger(num / (i + 1031)) || Number.isInteger(num / (i + 1033)) || Number.isInteger(num / (i + 1039)) || Number.isInteger(num / (i + 1049)) || Number.isInteger(num / (i + 1051)) || Number.isInteger(num / (i + 1061)) || Number.isInteger(num / (i + 1063)) || Number.isInteger(num / (i + 1069)) || Number.isInteger(num / (i + 1087)) || Number.isInteger(num / (i + 1091)) || Number.isInteger(num / (i + 1093)) || Number.isInteger(num / (i + 1097)) || Number.isInteger(num / (i + 1103)) || Number.isInteger(num / (i + 1109)) || Number.isInteger(num / (i + 1117)) || Number.isInteger(num / (i + 1123)) || Number.isInteger(num / (i + 1129)) || Number.isInteger(num / (i + 1151)) || Number.isInteger(num / (i + 1153)) || Number.isInteger(num / (i + 1163)) || Number.isInteger(num / (i + 1171)) || Number.isInteger(num / (i + 1181)) || Number.isInteger(num / (i + 1187)) || Number.isInteger(num / (i + 1193)) || Number.isInteger(num / (i + 1201)) || Number.isInteger(num / (i + 1213)) || Number.isInteger(num / (i + 1217)) || Number.isInteger(num / (i + 1223)) || Number.isInteger(num / (i + 1229)) || Number.isInteger(num / (i + 1231)) || Number.isInteger(num / (i + 1237)) || Number.isInteger(num / (i + 1249)) || Number.isInteger(num / (i + 1259)) || Number.isInteger(num / (i + 1277)) || Number.isInteger(num / (i + 1279)) || Number.isInteger(num / (i + 1283)) || Number.isInteger(num / (i + 1289)) || Number.isInteger(num / (i + 1291)) || Number.isInteger(num / (i + 1297)) || Number.isInteger(num / (i + 1301)) || Number.isInteger(num / (i + 1303)) || Number.isInteger(num / (i + 1307)) || Number.isInteger(num / (i + 1319)) || Number.isInteger(num / (i + 1321)) || Number.isInteger(num / (i + 1327)) || Number.isInteger(num / (i + 1361)) || Number.isInteger(num / (i + 1367)) || Number.isInteger(num / (i + 1373)) || Number.isInteger(num / (i + 1381)) || Number.isInteger(num / (i + 1399)) || Number.isInteger(num / (i + 1409)) || Number.isInteger(num / (i + 1423)) || Number.isInteger(num / (i + 1427)) || Number.isInteger(num / (i + 1429)) || Number.isInteger(num / (i + 1433)) || Number.isInteger(num / (i + 1439)) || Number.isInteger(num / (i + 1447)) || Number.isInteger(num / (i + 1451)) || Number.isInteger(num / (i + 1453)) || Number.isInteger(num / (i + 1459)) || Number.isInteger(num / (i + 1471)) || Number.isInteger(num / (i + 1481)) || Number.isInteger(num / (i + 1483)) || Number.isInteger(num / (i + 1487)) || Number.isInteger(num / (i + 1489)) || Number.isInteger(num / (i + 1493)) || Number.isInteger(num / (i + 1499)) || Number.isInteger(num / (i + 1511)) || Number.isInteger(num / (i + 1523)) || Number.isInteger(num / (i + 1531)) || Number.isInteger(num / (i + 1543)) || Number.isInteger(num / (i + 1549)) || Number.isInteger(num / (i + 1553)) || Number.isInteger(num / (i + 1559)) || Number.isInteger(num / (i + 1567)) || Number.isInteger(num / (i + 1571)) || Number.isInteger(num / (i + 1579)) || Number.isInteger(num / (i + 1583)) || Number.isInteger(num / (i + 1597)) || Number.isInteger(num / (i + 1601)) || Number.isInteger(num / (i + 1607)) || Number.isInteger(num / (i + 1609)) || Number.isInteger(num / (i + 1613)) || Number.isInteger(num / (i + 1619)) || Number.isInteger(num / (i + 1621)) || Number.isInteger(num / (i + 1627)) || Number.isInteger(num / (i + 1637)) || Number.isInteger(num / (i + 1657)) || Number.isInteger(num / (i + 1663)) || Number.isInteger(num / (i + 1667)) || Number.isInteger(num / (i + 1669)) || Number.isInteger(num / (i + 1693)) || Number.isInteger(num / (i + 1697)) || Number.isInteger(num / (i + 1699)) || Number.isInteger(num / (i + 1709)) || Number.isInteger(num / (i + 1721)) || Number.isInteger(num / (i + 1723)) || Number.isInteger(num / (i + 1733)) || Number.isInteger(num / (i + 1741)) || Number.isInteger(num / (i + 1747)) || Number.isInteger(num / (i + 1753)) || Number.isInteger(num / (i + 1759)) || Number.isInteger(num / (i + 1777)) || Number.isInteger(num / (i + 1783)) || Number.isInteger(num / (i + 1787)) || Number.isInteger(num / (i + 1789)) || Number.isInteger(num / (i + 1801)) || Number.isInteger(num / (i + 1811)) || Number.isInteger(num / (i + 1823)) || Number.isInteger(num / (i + 1831)) || Number.isInteger(num / (i + 1847)) || Number.isInteger(num / (i + 1861)) || Number.isInteger(num / (i + 1867)) || Number.isInteger(num / (i + 1871)) || Number.isInteger(num / (i + 1873)) || Number.isInteger(num / (i + 1877)) || Number.isInteger(num / (i + 1879)) || Number.isInteger(num / (i + 1889)) || Number.isInteger(num / (i + 1901)) || Number.isInteger(num / (i + 1907)) || Number.isInteger(num / (i + 1913)) || Number.isInteger(num / (i + 1931)) || Number.isInteger(num / (i + 1933)) || Number.isInteger(num / (i + 1949)) || Number.isInteger(num / (i + 1951)) || Number.isInteger(num / (i + 1973)) || Number.isInteger(num / (i + 1979)) || Number.isInteger(num / (i + 1987)) || Number.isInteger(num / (i + 1993)) || Number.isInteger(num / (i + 1997)) || Number.isInteger(num / (i + 1999)) || Number.isInteger(num / (i + 2003)) || Number.isInteger(num / (i + 2011)) || Number.isInteger(num / (i + 2017)) || Number.isInteger(num / (i + 2027)) || Number.isInteger(num / (i + 2029)) || Number.isInteger(num / (i + 2039)) || Number.isInteger(num / (i + 2053)) || Number.isInteger(num / (i + 2063)) || Number.isInteger(num / (i + 2069)) || Number.isInteger(num / (i + 2081)) || Number.isInteger(num / (i + 2083)) || Number.isInteger(num / (i + 2087)) || Number.isInteger(num / (i + 2089)) || Number.isInteger(num / (i + 2099)) || Number.isInteger(num / (i + 2111)) || Number.isInteger(num / (i + 2113)) || Number.isInteger(num / (i + 2129)) || Number.isInteger(num / (i + 2131)) || Number.isInteger(num / (i + 2137)) || Number.isInteger(num / (i + 2141)) || Number.isInteger(num / (i + 2143)) || Number.isInteger(num / (i + 2153)) || Number.isInteger(num / (i + 2161)) || Number.isInteger(num / (i + 2179)) || Number.isInteger(num / (i + 2203)) || Number.isInteger(num / (i + 2207)) || Number.isInteger(num / (i + 2213)) || Number.isInteger(num / (i + 2221)) || Number.isInteger(num / (i + 2237)) || Number.isInteger(num / (i + 2239)) || Number.isInteger(num / (i + 2243)) || Number.isInteger(num / (i + 2251)) || Number.isInteger(num / (i + 2267)) || Number.isInteger(num / (i + 2269)) || Number.isInteger(num / (i + 2273)) || Number.isInteger(num / (i + 2281)) || Number.isInteger(num / (i + 2287)) || Number.isInteger(num / (i + 2293)) || Number.isInteger(num / (i + 2297)) || Number.isInteger(num / (i + 2309))) { return false }
    } return true
}

function PFD_v4_1(num_1) {
    var results = "";
    var num = parseInt(num_1, 10);
    if (Number.isInteger(num / 2)) {
        let e = 0;
        while (Number.isInteger(num / 2)) {
            e++;
            num /= 2;
        }
        results += 2 + "^" + e + " × ";
    }
    if (Number.isInteger(num / 3)) {
        let e = 0;
        while (Number.isInteger(num / 3)) {
            e++;
            num /= 3;
        }
        results += 3 + "^" + e + " × ";
    }
    for (var i = 5; i * i <= num; i += 6) {
        if (Number.isInteger(num / i)) {
            let e = 0;
            while (Number.isInteger(num / i)) {
                e++;
                num /= i;
            }
            results += i + "^" + e + " × ";
        }
        if (Number.isInteger(num / (i + 2))) {
            let e = 0;
            while (Number.isInteger(num / (i + 2))) {
                e++;
                num /= i + 2;
            }
            results += (i + 2) + "^" + e + " × ";
        }
    }
    if (num != 1) {
        results += num + "^" + 1 + " × ";
    }
    var result = results.toString().replace(/,/g, " × ").replace(/\^1 × /g, " × ").slice(0, -3);
    if (result == num_1) {
        return num_1 + "は素数です。";
    } else {
        return result;
    }
}

const PFD = function (num_1) {
    var results = ""
    var num = parseInt(num_1, 10)
    var PRIME_NUMBERS = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
        101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199
    ];

    var LEN = PRIME_NUMBERS.length;

    for (var i = 0; i < LEN; i++) {
        if (num % PRIME_NUMBERS[i] == 0) {
            let e = 0
            while (num % PRIME_NUMBERS[i] == 0) {
                e++
                num /= PRIME_NUMBERS[i]
            }
            results += " " + PRIME_NUMBERS[i] + "^" + e + " ×";
        }
    }

    for (var i = 210; i * i <= num; i += 210) {
        if (num % (i + 1) == 0) { let e = 0; while (num % (i + 1) == 0) { e++; num /= (i + 1) }; results += " " + (i + 1) + "^" + e + " ×"; }; if (num % (i + 11) == 0) { let e = 0; while (num % (i + 11) == 0) { e++; num /= (i + 11) }; results += " " + (i + 11) + "^" + e + " ×"; }; if (num % (i + 13) == 0) { let e = 0; while (num % (i + 13) == 0) { e++; num /= (i + 13) }; results += " " + (i + 13) + "^" + e + " ×"; }; if (num % (i + 17) == 0) { let e = 0; while (num % (i + 17) == 0) { e++; num /= (i + 17) }; results += " " + (i + 17) + "^" + e + " ×"; }; if (num % (i + 19) == 0) { let e = 0; while (num % (i + 19) == 0) { e++; num /= (i + 19) }; results += " " + (i + 19) + "^" + e + " ×"; }; if (num % (i + 23) == 0) { let e = 0; while (num % (i + 23) == 0) { e++; num /= (i + 23) }; results += " " + (i + 23) + "^" + e + " ×"; }; if (num % (i + 29) == 0) { let e = 0; while (num % (i + 29) == 0) { e++; num /= (i + 29) }; results += " " + (i + 29) + "^" + e + " ×"; }; if (num % (i + 31) == 0) { let e = 0; while (num % (i + 31) == 0) { e++; num /= (i + 31) }; results += " " + (i + 31) + "^" + e + " ×"; }; if (num % (i + 37) == 0) { let e = 0; while (num % (i + 37) == 0) { e++; num /= (i + 37) }; results += " " + (i + 37) + "^" + e + " ×"; }; if (num % (i + 41) == 0) { let e = 0; while (num % (i + 41) == 0) { e++; num /= (i + 41) }; results += " " + (i + 41) + "^" + e + " ×"; }; if (num % (i + 43) == 0) { let e = 0; while (num % (i + 43) == 0) { e++; num /= (i + 43) }; results += " " + (i + 43) + "^" + e + " ×"; }; if (num % (i + 47) == 0) { let e = 0; while (num % (i + 47) == 0) { e++; num /= (i + 47) }; results += " " + (i + 47) + "^" + e + " ×"; }; if (num % (i + 53) == 0) { let e = 0; while (num % (i + 53) == 0) { e++; num /= (i + 53) }; results += " " + (i + 53) + "^" + e + " ×"; }; if (num % (i + 59) == 0) { let e = 0; while (num % (i + 59) == 0) { e++; num /= (i + 59) }; results += " " + (i + 59) + "^" + e + " ×"; }; if (num % (i + 61) == 0) { let e = 0; while (num % (i + 61) == 0) { e++; num /= (i + 61) }; results += " " + (i + 61) + "^" + e + " ×"; }; if (num % (i + 67) == 0) { let e = 0; while (num % (i + 67) == 0) { e++; num /= (i + 67) }; results += " " + (i + 67) + "^" + e + " ×"; }; if (num % (i + 71) == 0) { let e = 0; while (num % (i + 71) == 0) { e++; num /= (i + 71) }; results += " " + (i + 71) + "^" + e + " ×"; }; if (num % (i + 73) == 0) { let e = 0; while (num % (i + 73) == 0) { e++; num /= (i + 73) }; results += " " + (i + 73) + "^" + e + " ×"; }; if (num % (i + 79) == 0) { let e = 0; while (num % (i + 79) == 0) { e++; num /= (i + 79) }; results += " " + (i + 79) + "^" + e + " ×"; }; if (num % (i + 83) == 0) { let e = 0; while (num % (i + 83) == 0) { e++; num /= (i + 83) }; results += " " + (i + 83) + "^" + e + " ×"; }; if (num % (i + 89) == 0) { let e = 0; while (num % (i + 89) == 0) { e++; num /= (i + 89) }; results += " " + (i + 89) + "^" + e + " ×"; }; if (num % (i + 97) == 0) { let e = 0; while (num % (i + 97) == 0) { e++; num /= (i + 97) }; results += " " + (i + 97) + "^" + e + " ×"; }; if (num % (i + 101) == 0) { let e = 0; while (num % (i + 101) == 0) { e++; num /= (i + 101) }; results += " " + (i + 101) + "^" + e + " ×"; }; if (num % (i + 103) == 0) { let e = 0; while (num % (i + 103) == 0) { e++; num /= (i + 103) }; results += " " + (i + 103) + "^" + e + " ×"; }; if (num % (i + 107) == 0) { let e = 0; while (num % (i + 107) == 0) { e++; num /= (i + 107) }; results += " " + (i + 107) + "^" + e + " ×"; }; if (num % (i + 109) == 0) { let e = 0; while (num % (i + 109) == 0) { e++; num /= (i + 109) }; results += " " + (i + 109) + "^" + e + " ×"; }; if (num % (i + 113) == 0) { let e = 0; while (num % (i + 113) == 0) { e++; num /= (i + 113) }; results += " " + (i + 113) + "^" + e + " ×"; }; if (num % (i + 121) == 0) { let e = 0; while (num % (i + 121) == 0) { e++; num /= (i + 121) }; results += " " + (i + 121) + "^" + e + " ×"; }; if (num % (i + 127) == 0) { let e = 0; while (num % (i + 127) == 0) { e++; num /= (i + 127) }; results += " " + (i + 127) + "^" + e + " ×"; }; if (num % (i + 131) == 0) { let e = 0; while (num % (i + 131) == 0) { e++; num /= (i + 131) }; results += " " + (i + 131) + "^" + e + " ×"; }; if (num % (i + 137) == 0) { let e = 0; while (num % (i + 137) == 0) { e++; num /= (i + 137) }; results += " " + (i + 137) + "^" + e + " ×"; }; if (num % (i + 139) == 0) { let e = 0; while (num % (i + 139) == 0) { e++; num /= (i + 139) }; results += " " + (i + 139) + "^" + e + " ×"; }; if (num % (i + 143) == 0) { let e = 0; while (num % (i + 143) == 0) { e++; num /= (i + 143) }; results += " " + (i + 143) + "^" + e + " ×"; }; if (num % (i + 149) == 0) { let e = 0; while (num % (i + 149) == 0) { e++; num /= (i + 149) }; results += " " + (i + 149) + "^" + e + " ×"; }; if (num % (i + 151) == 0) { let e = 0; while (num % (i + 151) == 0) { e++; num /= (i + 151) }; results += " " + (i + 151) + "^" + e + " ×"; }; if (num % (i + 157) == 0) { let e = 0; while (num % (i + 157) == 0) { e++; num /= (i + 157) }; results += " " + (i + 157) + "^" + e + " ×"; }; if (num % (i + 163) == 0) { let e = 0; while (num % (i + 163) == 0) { e++; num /= (i + 163) }; results += " " + (i + 163) + "^" + e + " ×"; }; if (num % (i + 167) == 0) { let e = 0; while (num % (i + 167) == 0) { e++; num /= (i + 167) }; results += " " + (i + 167) + "^" + e + " ×"; }; if (num % (i + 169) == 0) { let e = 0; while (num % (i + 169) == 0) { e++; num /= (i + 169) }; results += " " + (i + 169) + "^" + e + " ×"; }; if (num % (i + 173) == 0) { let e = 0; while (num % (i + 173) == 0) { e++; num /= (i + 173) }; results += " " + (i + 173) + "^" + e + " ×"; }; if (num % (i + 179) == 0) { let e = 0; while (num % (i + 179) == 0) { e++; num /= (i + 179) }; results += " " + (i + 179) + "^" + e + " ×"; }; if (num % (i + 181) == 0) { let e = 0; while (num % (i + 181) == 0) { e++; num /= (i + 181) }; results += " " + (i + 181) + "^" + e + " ×"; }; if (num % (i + 187) == 0) { let e = 0; while (num % (i + 187) == 0) { e++; num /= (i + 187) }; results += " " + (i + 187) + "^" + e + " ×"; }; if (num % (i + 191) == 0) { let e = 0; while (num % (i + 191) == 0) { e++; num /= (i + 191) }; results += " " + (i + 191) + "^" + e + " ×"; }; if (num % (i + 193) == 0) { let e = 0; while (num % (i + 193) == 0) { e++; num /= (i + 193) }; results += " " + (i + 193) + "^" + e + " ×"; }; if (num % (i + 197) == 0) { let e = 0; while (num % (i + 197) == 0) { e++; num /= (i + 197) }; results += " " + (i + 197) + "^" + e + " ×"; }; if (num % (i + 199) == 0) { let e = 0; while (num % (i + 199) == 0) { e++; num /= (i + 199) }; results += " " + (i + 199) + "^" + e + " ×"; }; if (num % (i + 209) == 0) { let e = 0; while (num % (i + 209) == 0) { e++; num /= (i + 209) }; results += " " + (i + 209) + "^" + e + " ×"; };
    }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ")
    if (result_r == num_1) {
        return num_1 + "は素数です。";
    } else {
        return result_r;
    }
}

function newPFD_v1(value) {
    var divisorTable = [];
    for (var number = 2; number <= value; number++) {
        if (Number.isInteger(value / number)) {
            var exponent = 0;
            while (Number.isInteger(value / number)) {
                exponent++;
                value /= number;
            }
            divisorTable.push({ number, exponent });
        }
    }
    var ret = "";
    divisorTable.forEach((divisor, index) => {
        ret += `${divisor.number}^${divisor.exponent}`;
        if (index !== divisorTable.length - 1) ret += " * ";
    });
    if (ret == `${value}^1`) {
        return value + "は素数です。";
    } else {
        ret += " "
        return (
            ret.replace(/\^1 /g, " ").replace(/\*/g, "×").slice(0, -1)
        );
    }
}

function newPFD_v2(num_1) {
    var results = []
    var num = parseInt(num_1, 10)
    for (var i = 2; i * i <= num; i++) {
        if (Number.isInteger(num / i)) {
            let e = 0
            while (Number.isInteger(num / i)) {
                e++
                num /= i
            }
            results.push({ num: i, ex: e })
        }
    }
    if (num != 1) {
        results.push({ num: num, ex: 1 });
    }
    if (results.length == 1) return num + "は素数です。";
    var result = "";
    results.forEach((d, i) => {
        if (d.ex == 1) { result += `${d.num}` } else { result += `${d.num}^${d.ex}` };
        if (i !== results.length - 1) result += " × ";
    });
    return result;
}

function newPFD_v3(num_1) {
    var results = []
    var num = parseInt(num_1, 10)
    if (Number.isInteger(num / 2)) {
        let e = 0
        while (Number.isInteger(num / 2)) {
            e++
            num /= 2
        }
        results.push({ num: 2, ex: e })
    }
    for (var i = 3; i * i <= num; i += 2) {
        if (Number.isInteger(num / i)) {
            let e = 0
            while (Number.isInteger(num / i)) {
                e++
                num /= i
            }
            results.push({ num: i, ex: e })
        }
    }
    if (num != 1) {
        results.push({ num: num, ex: 1 })
    }
    if (results.length == 1) return num + "は素数です。";
    var result = "";
    results.forEach((d, i) => {
        if (d.ex == 1) { result += `${d.num}` } else { result += `${d.num}^${d.ex}` }
        if (i !== results.length - 1) result += " × ";
    });
    return result;
}

function newPFD_v4(num_1) {
    var results = []
    var num = parseInt(num_1, 10)
    if (Number.isInteger(num / 2)) {
        let e = 0
        while (Number.isInteger(num / 2)) {
            e++
            num /= 2
        }
        results.push({ num: 2, ex: e })
    }
    if (Number.isInteger(num / 3)) {
        let e = 0
        while (Number.isInteger(num / 3)) {
            e++
            num /= 3
        }
        results.push({ num: 3, ex: e })
    }
    for (var i = 5; i * i <= num; i += 6) {
        if (Number.isInteger(num / i)) {
            let e = 0
            while (Number.isInteger(num / i)) {
                e++
                num /= i
            }
            results.push({ num: i, ex: e })
        }
        if (Number.isInteger(num / (i + 2))) {
            let e = 0
            while (Number.isInteger(num / (i + 2))) {
                e++
                num /= (i + 2)
            }
            results.push({ num: (i + 2), ex: e })
        }
    }
    if (num != 1) {
        results.push({ num: num, ex: 1 })
    }
    if (results.length == 1) return num + "は素数です。";
    var result = "";
    results.forEach((d, i) => {
        if (d.ex == 1) { result += `${d.num}` } else { result += `${d.num}^${d.ex}` }
        if (i !== results.length - 1) result += " × ";
    });
    return result;
}

function newPFD_v5(num_1) {
    var results = ""
    var num = parseInt(num_1, 10)
    var P = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29
    ];

    for (var i = 0; i < 10; i++) { if (Number.isInteger(num / P[i])) { let e = 0; while (Number.isInteger(num / P[i])) { e++; num /= P[i]; }; results += " " + P[i] + "^" + e + " ×"; } };

    for (var i = 30; i * i <= num; i += 30) {
        if (Number.isInteger(num / (i + 1))) { let e = 0; while (Number.isInteger(num / (i + 1))) { e++; num /= (i + 1) }; results += (" " + (i + 1) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 7))) { let e = 0; while (Number.isInteger(num / (i + 7))) { e++; num /= (i + 7) }; results += (" " + (i + 7) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 11))) { let e = 0; while (Number.isInteger(num / (i + 11))) { e++; num /= (i + 11) }; results += (" " + (i + 11) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 13))) { let e = 0; while (Number.isInteger(num / (i + 13))) { e++; num /= (i + 13) }; results += (" " + (i + 13) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 17))) { let e = 0; while (Number.isInteger(num / (i + 17))) { e++; num /= (i + 17) }; results += (" " + (i + 17) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 19))) { let e = 0; while (Number.isInteger(num / (i + 19))) { e++; num /= (i + 19) }; results += (" " + (i + 19) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 23))) { let e = 0; while (Number.isInteger(num / (i + 23))) { e++; num /= (i + 23) }; results += (" " + (i + 23) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 29))) { let e = 0; while (Number.isInteger(num / (i + 29))) { e++; num /= (i + 29) }; results += (" " + (i + 29) + "^" + e + " ×") };
    }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ").slice(0, -1)
    if (result_r == num_1) {
        return num_1 + "は素数です。";
    } else {
        return result_r;
    }
}

function newPFD_v6(num_1) {
    var results = ""
    var num = parseInt(num_1, 10)
    var P = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
        101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199
    ];

    for (var i = 0; i < P.length; i++) {
        if (Number.isInteger(num / P[i])) {
            let e = 0
            while (Number.isInteger(num / P[i])) {
                e++
                num /= P[i]
            }
            results += " " + P[i] + "^" + e + " ×";
        }
    }

    for (var i = 210; i * i <= num; i += 210) {
        if (Number.isInteger(num / (i + 1))) { let e = 0; while (Number.isInteger(num / (i + 1))) { e++; num /= (i + 1) }; results += (" " + (i + 1) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 11))) { let e = 0; while (Number.isInteger(num / (i + 11))) { e++; num /= (i + 11) }; results += (" " + (i + 11) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 13))) { let e = 0; while (Number.isInteger(num / (i + 13))) { e++; num /= (i + 13) }; results += (" " + (i + 13) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 17))) { let e = 0; while (Number.isInteger(num / (i + 17))) { e++; num /= (i + 17) }; results += (" " + (i + 17) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 19))) { let e = 0; while (Number.isInteger(num / (i + 19))) { e++; num /= (i + 19) }; results += (" " + (i + 19) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 23))) { let e = 0; while (Number.isInteger(num / (i + 23))) { e++; num /= (i + 23) }; results += (" " + (i + 23) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 29))) { let e = 0; while (Number.isInteger(num / (i + 29))) { e++; num /= (i + 29) }; results += (" " + (i + 29) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 31))) { let e = 0; while (Number.isInteger(num / (i + 31))) { e++; num /= (i + 31) }; results += (" " + (i + 31) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 37))) { let e = 0; while (Number.isInteger(num / (i + 37))) { e++; num /= (i + 37) }; results += (" " + (i + 37) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 41))) { let e = 0; while (Number.isInteger(num / (i + 41))) { e++; num /= (i + 41) }; results += (" " + (i + 41) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 43))) { let e = 0; while (Number.isInteger(num / (i + 43))) { e++; num /= (i + 43) }; results += (" " + (i + 43) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 47))) { let e = 0; while (Number.isInteger(num / (i + 47))) { e++; num /= (i + 47) }; results += (" " + (i + 47) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 53))) { let e = 0; while (Number.isInteger(num / (i + 53))) { e++; num /= (i + 53) }; results += (" " + (i + 53) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 59))) { let e = 0; while (Number.isInteger(num / (i + 59))) { e++; num /= (i + 59) }; results += (" " + (i + 59) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 61))) { let e = 0; while (Number.isInteger(num / (i + 61))) { e++; num /= (i + 61) }; results += (" " + (i + 61) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 67))) { let e = 0; while (Number.isInteger(num / (i + 67))) { e++; num /= (i + 67) }; results += (" " + (i + 67) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 71))) { let e = 0; while (Number.isInteger(num / (i + 71))) { e++; num /= (i + 71) }; results += (" " + (i + 71) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 73))) { let e = 0; while (Number.isInteger(num / (i + 73))) { e++; num /= (i + 73) }; results += (" " + (i + 73) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 79))) { let e = 0; while (Number.isInteger(num / (i + 79))) { e++; num /= (i + 79) }; results += (" " + (i + 79) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 83))) { let e = 0; while (Number.isInteger(num / (i + 83))) { e++; num /= (i + 83) }; results += (" " + (i + 83) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 89))) { let e = 0; while (Number.isInteger(num / (i + 89))) { e++; num /= (i + 89) }; results += (" " + (i + 89) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 97))) { let e = 0; while (Number.isInteger(num / (i + 97))) { e++; num /= (i + 97) }; results += (" " + (i + 97) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 101))) { let e = 0; while (Number.isInteger(num / (i + 101))) { e++; num /= (i + 101) }; results += (" " + (i + 101) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 103))) { let e = 0; while (Number.isInteger(num / (i + 103))) { e++; num /= (i + 103) }; results += (" " + (i + 103) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 107))) { let e = 0; while (Number.isInteger(num / (i + 107))) { e++; num /= (i + 107) }; results += (" " + (i + 107) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 109))) { let e = 0; while (Number.isInteger(num / (i + 109))) { e++; num /= (i + 109) }; results += (" " + (i + 109) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 113))) { let e = 0; while (Number.isInteger(num / (i + 113))) { e++; num /= (i + 113) }; results += (" " + (i + 113) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 121))) { let e = 0; while (Number.isInteger(num / (i + 121))) { e++; num /= (i + 121) }; results += (" " + (i + 121) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 127))) { let e = 0; while (Number.isInteger(num / (i + 127))) { e++; num /= (i + 127) }; results += (" " + (i + 127) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 131))) { let e = 0; while (Number.isInteger(num / (i + 131))) { e++; num /= (i + 131) }; results += (" " + (i + 131) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 137))) { let e = 0; while (Number.isInteger(num / (i + 137))) { e++; num /= (i + 137) }; results += (" " + (i + 137) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 139))) { let e = 0; while (Number.isInteger(num / (i + 139))) { e++; num /= (i + 139) }; results += (" " + (i + 139) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 143))) { let e = 0; while (Number.isInteger(num / (i + 143))) { e++; num /= (i + 143) }; results += (" " + (i + 143) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 149))) { let e = 0; while (Number.isInteger(num / (i + 149))) { e++; num /= (i + 149) }; results += (" " + (i + 149) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 151))) { let e = 0; while (Number.isInteger(num / (i + 151))) { e++; num /= (i + 151) }; results += (" " + (i + 151) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 157))) { let e = 0; while (Number.isInteger(num / (i + 157))) { e++; num /= (i + 157) }; results += (" " + (i + 157) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 163))) { let e = 0; while (Number.isInteger(num / (i + 163))) { e++; num /= (i + 163) }; results += (" " + (i + 163) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 167))) { let e = 0; while (Number.isInteger(num / (i + 167))) { e++; num /= (i + 167) }; results += (" " + (i + 167) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 169))) { let e = 0; while (Number.isInteger(num / (i + 169))) { e++; num /= (i + 169) }; results += (" " + (i + 169) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 173))) { let e = 0; while (Number.isInteger(num / (i + 173))) { e++; num /= (i + 173) }; results += (" " + (i + 173) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 179))) { let e = 0; while (Number.isInteger(num / (i + 179))) { e++; num /= (i + 179) }; results += (" " + (i + 179) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 181))) { let e = 0; while (Number.isInteger(num / (i + 181))) { e++; num /= (i + 181) }; results += (" " + (i + 181) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 187))) { let e = 0; while (Number.isInteger(num / (i + 187))) { e++; num /= (i + 187) }; results += (" " + (i + 187) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 191))) { let e = 0; while (Number.isInteger(num / (i + 191))) { e++; num /= (i + 191) }; results += (" " + (i + 191) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 193))) { let e = 0; while (Number.isInteger(num / (i + 193))) { e++; num /= (i + 193) }; results += (" " + (i + 193) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 197))) { let e = 0; while (Number.isInteger(num / (i + 197))) { e++; num /= (i + 197) }; results += (" " + (i + 197) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 199))) { let e = 0; while (Number.isInteger(num / (i + 199))) { e++; num /= (i + 199) }; results += (" " + (i + 199) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 209))) { let e = 0; while (Number.isInteger(num / (i + 209))) { e++; num /= (i + 209) }; results += (" " + (i + 209) + "^" + e + " ×") };
    }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ").slice(0, -1)
    if (result_r == num_1) {
        return num_1 + "は素数です。";
    } else {
        return result_r;
    }
}

function newPFD_v7(num_1) {
    var results = ""
    var num = parseInt(num_1, 10)
    var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309];
    for (var i = 0; i < 343; i++) {
        if (num % P[i] == 0) {
            let e = 0
            while (num % P[i] == 0) {
                e++
                num /= P[i]
            }
            results += " " + P[i] + "^" + e + " ×";
        }
    }
    for (var i = 2310; i * i <= num; i += 2310) { if (Number.isInteger(num / (i + 1))) { let e = 0; while (Number.isInteger(num / (i + 1))) { e++; num /= (i + 1) }; results += (" " + (i + 1) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 13))) { let e = 0; while (Number.isInteger(num / (i + 13))) { e++; num /= (i + 13) }; results += (" " + (i + 13) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 17))) { let e = 0; while (Number.isInteger(num / (i + 17))) { e++; num /= (i + 17) }; results += (" " + (i + 17) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 19))) { let e = 0; while (Number.isInteger(num / (i + 19))) { e++; num /= (i + 19) }; results += (" " + (i + 19) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 23))) { let e = 0; while (Number.isInteger(num / (i + 23))) { e++; num /= (i + 23) }; results += (" " + (i + 23) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 29))) { let e = 0; while (Number.isInteger(num / (i + 29))) { e++; num /= (i + 29) }; results += (" " + (i + 29) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 31))) { let e = 0; while (Number.isInteger(num / (i + 31))) { e++; num /= (i + 31) }; results += (" " + (i + 31) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 37))) { let e = 0; while (Number.isInteger(num / (i + 37))) { e++; num /= (i + 37) }; results += (" " + (i + 37) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 41))) { let e = 0; while (Number.isInteger(num / (i + 41))) { e++; num /= (i + 41) }; results += (" " + (i + 41) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 43))) { let e = 0; while (Number.isInteger(num / (i + 43))) { e++; num /= (i + 43) }; results += (" " + (i + 43) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 47))) { let e = 0; while (Number.isInteger(num / (i + 47))) { e++; num /= (i + 47) }; results += (" " + (i + 47) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 53))) { let e = 0; while (Number.isInteger(num / (i + 53))) { e++; num /= (i + 53) }; results += (" " + (i + 53) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 59))) { let e = 0; while (Number.isInteger(num / (i + 59))) { e++; num /= (i + 59) }; results += (" " + (i + 59) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 61))) { let e = 0; while (Number.isInteger(num / (i + 61))) { e++; num /= (i + 61) }; results += (" " + (i + 61) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 67))) { let e = 0; while (Number.isInteger(num / (i + 67))) { e++; num /= (i + 67) }; results += (" " + (i + 67) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 71))) { let e = 0; while (Number.isInteger(num / (i + 71))) { e++; num /= (i + 71) }; results += (" " + (i + 71) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 73))) { let e = 0; while (Number.isInteger(num / (i + 73))) { e++; num /= (i + 73) }; results += (" " + (i + 73) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 79))) { let e = 0; while (Number.isInteger(num / (i + 79))) { e++; num /= (i + 79) }; results += (" " + (i + 79) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 83))) { let e = 0; while (Number.isInteger(num / (i + 83))) { e++; num /= (i + 83) }; results += (" " + (i + 83) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 89))) { let e = 0; while (Number.isInteger(num / (i + 89))) { e++; num /= (i + 89) }; results += (" " + (i + 89) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 97))) { let e = 0; while (Number.isInteger(num / (i + 97))) { e++; num /= (i + 97) }; results += (" " + (i + 97) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 101))) { let e = 0; while (Number.isInteger(num / (i + 101))) { e++; num /= (i + 101) }; results += (" " + (i + 101) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 103))) { let e = 0; while (Number.isInteger(num / (i + 103))) { e++; num /= (i + 103) }; results += (" " + (i + 103) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 107))) { let e = 0; while (Number.isInteger(num / (i + 107))) { e++; num /= (i + 107) }; results += (" " + (i + 107) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 109))) { let e = 0; while (Number.isInteger(num / (i + 109))) { e++; num /= (i + 109) }; results += (" " + (i + 109) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 113))) { let e = 0; while (Number.isInteger(num / (i + 113))) { e++; num /= (i + 113) }; results += (" " + (i + 113) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 127))) { let e = 0; while (Number.isInteger(num / (i + 127))) { e++; num /= (i + 127) }; results += (" " + (i + 127) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 131))) { let e = 0; while (Number.isInteger(num / (i + 131))) { e++; num /= (i + 131) }; results += (" " + (i + 131) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 137))) { let e = 0; while (Number.isInteger(num / (i + 137))) { e++; num /= (i + 137) }; results += (" " + (i + 137) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 139))) { let e = 0; while (Number.isInteger(num / (i + 139))) { e++; num /= (i + 139) }; results += (" " + (i + 139) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 149))) { let e = 0; while (Number.isInteger(num / (i + 149))) { e++; num /= (i + 149) }; results += (" " + (i + 149) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 151))) { let e = 0; while (Number.isInteger(num / (i + 151))) { e++; num /= (i + 151) }; results += (" " + (i + 151) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 157))) { let e = 0; while (Number.isInteger(num / (i + 157))) { e++; num /= (i + 157) }; results += (" " + (i + 157) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 163))) { let e = 0; while (Number.isInteger(num / (i + 163))) { e++; num /= (i + 163) }; results += (" " + (i + 163) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 167))) { let e = 0; while (Number.isInteger(num / (i + 167))) { e++; num /= (i + 167) }; results += (" " + (i + 167) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 169))) { let e = 0; while (Number.isInteger(num / (i + 169))) { e++; num /= (i + 169) }; results += (" " + (i + 169) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 173))) { let e = 0; while (Number.isInteger(num / (i + 173))) { e++; num /= (i + 173) }; results += (" " + (i + 173) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 179))) { let e = 0; while (Number.isInteger(num / (i + 179))) { e++; num /= (i + 179) }; results += (" " + (i + 179) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 181))) { let e = 0; while (Number.isInteger(num / (i + 181))) { e++; num /= (i + 181) }; results += (" " + (i + 181) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 191))) { let e = 0; while (Number.isInteger(num / (i + 191))) { e++; num /= (i + 191) }; results += (" " + (i + 191) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 193))) { let e = 0; while (Number.isInteger(num / (i + 193))) { e++; num /= (i + 193) }; results += (" " + (i + 193) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 197))) { let e = 0; while (Number.isInteger(num / (i + 197))) { e++; num /= (i + 197) }; results += (" " + (i + 197) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 199))) { let e = 0; while (Number.isInteger(num / (i + 199))) { e++; num /= (i + 199) }; results += (" " + (i + 199) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 211))) { let e = 0; while (Number.isInteger(num / (i + 211))) { e++; num /= (i + 211) }; results += (" " + (i + 211) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 221))) { let e = 0; while (Number.isInteger(num / (i + 221))) { e++; num /= (i + 221) }; results += (" " + (i + 221) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 223))) { let e = 0; while (Number.isInteger(num / (i + 223))) { e++; num /= (i + 223) }; results += (" " + (i + 223) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 227))) { let e = 0; while (Number.isInteger(num / (i + 227))) { e++; num /= (i + 227) }; results += (" " + (i + 227) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 229))) { let e = 0; while (Number.isInteger(num / (i + 229))) { e++; num /= (i + 229) }; results += (" " + (i + 229) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 233))) { let e = 0; while (Number.isInteger(num / (i + 233))) { e++; num /= (i + 233) }; results += (" " + (i + 233) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 239))) { let e = 0; while (Number.isInteger(num / (i + 239))) { e++; num /= (i + 239) }; results += (" " + (i + 239) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 241))) { let e = 0; while (Number.isInteger(num / (i + 241))) { e++; num /= (i + 241) }; results += (" " + (i + 241) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 247))) { let e = 0; while (Number.isInteger(num / (i + 247))) { e++; num /= (i + 247) }; results += (" " + (i + 247) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 251))) { let e = 0; while (Number.isInteger(num / (i + 251))) { e++; num /= (i + 251) }; results += (" " + (i + 251) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 257))) { let e = 0; while (Number.isInteger(num / (i + 257))) { e++; num /= (i + 257) }; results += (" " + (i + 257) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 263))) { let e = 0; while (Number.isInteger(num / (i + 263))) { e++; num /= (i + 263) }; results += (" " + (i + 263) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 269))) { let e = 0; while (Number.isInteger(num / (i + 269))) { e++; num /= (i + 269) }; results += (" " + (i + 269) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 271))) { let e = 0; while (Number.isInteger(num / (i + 271))) { e++; num /= (i + 271) }; results += (" " + (i + 271) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 277))) { let e = 0; while (Number.isInteger(num / (i + 277))) { e++; num /= (i + 277) }; results += (" " + (i + 277) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 281))) { let e = 0; while (Number.isInteger(num / (i + 281))) { e++; num /= (i + 281) }; results += (" " + (i + 281) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 283))) { let e = 0; while (Number.isInteger(num / (i + 283))) { e++; num /= (i + 283) }; results += (" " + (i + 283) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 289))) { let e = 0; while (Number.isInteger(num / (i + 289))) { e++; num /= (i + 289) }; results += (" " + (i + 289) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 293))) { let e = 0; while (Number.isInteger(num / (i + 293))) { e++; num /= (i + 293) }; results += (" " + (i + 293) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 299))) { let e = 0; while (Number.isInteger(num / (i + 299))) { e++; num /= (i + 299) }; results += (" " + (i + 299) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 307))) { let e = 0; while (Number.isInteger(num / (i + 307))) { e++; num /= (i + 307) }; results += (" " + (i + 307) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 311))) { let e = 0; while (Number.isInteger(num / (i + 311))) { e++; num /= (i + 311) }; results += (" " + (i + 311) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 313))) { let e = 0; while (Number.isInteger(num / (i + 313))) { e++; num /= (i + 313) }; results += (" " + (i + 313) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 317))) { let e = 0; while (Number.isInteger(num / (i + 317))) { e++; num /= (i + 317) }; results += (" " + (i + 317) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 323))) { let e = 0; while (Number.isInteger(num / (i + 323))) { e++; num /= (i + 323) }; results += (" " + (i + 323) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 331))) { let e = 0; while (Number.isInteger(num / (i + 331))) { e++; num /= (i + 331) }; results += (" " + (i + 331) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 337))) { let e = 0; while (Number.isInteger(num / (i + 337))) { e++; num /= (i + 337) }; results += (" " + (i + 337) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 347))) { let e = 0; while (Number.isInteger(num / (i + 347))) { e++; num /= (i + 347) }; results += (" " + (i + 347) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 349))) { let e = 0; while (Number.isInteger(num / (i + 349))) { e++; num /= (i + 349) }; results += (" " + (i + 349) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 353))) { let e = 0; while (Number.isInteger(num / (i + 353))) { e++; num /= (i + 353) }; results += (" " + (i + 353) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 359))) { let e = 0; while (Number.isInteger(num / (i + 359))) { e++; num /= (i + 359) }; results += (" " + (i + 359) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 361))) { let e = 0; while (Number.isInteger(num / (i + 361))) { e++; num /= (i + 361) }; results += (" " + (i + 361) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 367))) { let e = 0; while (Number.isInteger(num / (i + 367))) { e++; num /= (i + 367) }; results += (" " + (i + 367) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 373))) { let e = 0; while (Number.isInteger(num / (i + 373))) { e++; num /= (i + 373) }; results += (" " + (i + 373) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 377))) { let e = 0; while (Number.isInteger(num / (i + 377))) { e++; num /= (i + 377) }; results += (" " + (i + 377) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 379))) { let e = 0; while (Number.isInteger(num / (i + 379))) { e++; num /= (i + 379) }; results += (" " + (i + 379) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 383))) { let e = 0; while (Number.isInteger(num / (i + 383))) { e++; num /= (i + 383) }; results += (" " + (i + 383) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 389))) { let e = 0; while (Number.isInteger(num / (i + 389))) { e++; num /= (i + 389) }; results += (" " + (i + 389) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 391))) { let e = 0; while (Number.isInteger(num / (i + 391))) { e++; num /= (i + 391) }; results += (" " + (i + 391) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 397))) { let e = 0; while (Number.isInteger(num / (i + 397))) { e++; num /= (i + 397) }; results += (" " + (i + 397) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 401))) { let e = 0; while (Number.isInteger(num / (i + 401))) { e++; num /= (i + 401) }; results += (" " + (i + 401) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 403))) { let e = 0; while (Number.isInteger(num / (i + 403))) { e++; num /= (i + 403) }; results += (" " + (i + 403) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 409))) { let e = 0; while (Number.isInteger(num / (i + 409))) { e++; num /= (i + 409) }; results += (" " + (i + 409) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 419))) { let e = 0; while (Number.isInteger(num / (i + 419))) { e++; num /= (i + 419) }; results += (" " + (i + 419) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 421))) { let e = 0; while (Number.isInteger(num / (i + 421))) { e++; num /= (i + 421) }; results += (" " + (i + 421) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 431))) { let e = 0; while (Number.isInteger(num / (i + 431))) { e++; num /= (i + 431) }; results += (" " + (i + 431) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 433))) { let e = 0; while (Number.isInteger(num / (i + 433))) { e++; num /= (i + 433) }; results += (" " + (i + 433) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 437))) { let e = 0; while (Number.isInteger(num / (i + 437))) { e++; num /= (i + 437) }; results += (" " + (i + 437) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 439))) { let e = 0; while (Number.isInteger(num / (i + 439))) { e++; num /= (i + 439) }; results += (" " + (i + 439) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 443))) { let e = 0; while (Number.isInteger(num / (i + 443))) { e++; num /= (i + 443) }; results += (" " + (i + 443) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 449))) { let e = 0; while (Number.isInteger(num / (i + 449))) { e++; num /= (i + 449) }; results += (" " + (i + 449) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 457))) { let e = 0; while (Number.isInteger(num / (i + 457))) { e++; num /= (i + 457) }; results += (" " + (i + 457) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 461))) { let e = 0; while (Number.isInteger(num / (i + 461))) { e++; num /= (i + 461) }; results += (" " + (i + 461) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 463))) { let e = 0; while (Number.isInteger(num / (i + 463))) { e++; num /= (i + 463) }; results += (" " + (i + 463) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 467))) { let e = 0; while (Number.isInteger(num / (i + 467))) { e++; num /= (i + 467) }; results += (" " + (i + 467) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 479))) { let e = 0; while (Number.isInteger(num / (i + 479))) { e++; num /= (i + 479) }; results += (" " + (i + 479) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 481))) { let e = 0; while (Number.isInteger(num / (i + 481))) { e++; num /= (i + 481) }; results += (" " + (i + 481) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 487))) { let e = 0; while (Number.isInteger(num / (i + 487))) { e++; num /= (i + 487) }; results += (" " + (i + 487) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 491))) { let e = 0; while (Number.isInteger(num / (i + 491))) { e++; num /= (i + 491) }; results += (" " + (i + 491) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 493))) { let e = 0; while (Number.isInteger(num / (i + 493))) { e++; num /= (i + 493) }; results += (" " + (i + 493) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 499))) { let e = 0; while (Number.isInteger(num / (i + 499))) { e++; num /= (i + 499) }; results += (" " + (i + 499) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 503))) { let e = 0; while (Number.isInteger(num / (i + 503))) { e++; num /= (i + 503) }; results += (" " + (i + 503) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 509))) { let e = 0; while (Number.isInteger(num / (i + 509))) { e++; num /= (i + 509) }; results += (" " + (i + 509) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 521))) { let e = 0; while (Number.isInteger(num / (i + 521))) { e++; num /= (i + 521) }; results += (" " + (i + 521) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 523))) { let e = 0; while (Number.isInteger(num / (i + 523))) { e++; num /= (i + 523) }; results += (" " + (i + 523) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 527))) { let e = 0; while (Number.isInteger(num / (i + 527))) { e++; num /= (i + 527) }; results += (" " + (i + 527) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 529))) { let e = 0; while (Number.isInteger(num / (i + 529))) { e++; num /= (i + 529) }; results += (" " + (i + 529) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 533))) { let e = 0; while (Number.isInteger(num / (i + 533))) { e++; num /= (i + 533) }; results += (" " + (i + 533) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 541))) { let e = 0; while (Number.isInteger(num / (i + 541))) { e++; num /= (i + 541) }; results += (" " + (i + 541) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 547))) { let e = 0; while (Number.isInteger(num / (i + 547))) { e++; num /= (i + 547) }; results += (" " + (i + 547) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 551))) { let e = 0; while (Number.isInteger(num / (i + 551))) { e++; num /= (i + 551) }; results += (" " + (i + 551) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 557))) { let e = 0; while (Number.isInteger(num / (i + 557))) { e++; num /= (i + 557) }; results += (" " + (i + 557) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 559))) { let e = 0; while (Number.isInteger(num / (i + 559))) { e++; num /= (i + 559) }; results += (" " + (i + 559) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 563))) { let e = 0; while (Number.isInteger(num / (i + 563))) { e++; num /= (i + 563) }; results += (" " + (i + 563) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 569))) { let e = 0; while (Number.isInteger(num / (i + 569))) { e++; num /= (i + 569) }; results += (" " + (i + 569) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 571))) { let e = 0; while (Number.isInteger(num / (i + 571))) { e++; num /= (i + 571) }; results += (" " + (i + 571) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 577))) { let e = 0; while (Number.isInteger(num / (i + 577))) { e++; num /= (i + 577) }; results += (" " + (i + 577) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 587))) { let e = 0; while (Number.isInteger(num / (i + 587))) { e++; num /= (i + 587) }; results += (" " + (i + 587) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 589))) { let e = 0; while (Number.isInteger(num / (i + 589))) { e++; num /= (i + 589) }; results += (" " + (i + 589) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 593))) { let e = 0; while (Number.isInteger(num / (i + 593))) { e++; num /= (i + 593) }; results += (" " + (i + 593) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 599))) { let e = 0; while (Number.isInteger(num / (i + 599))) { e++; num /= (i + 599) }; results += (" " + (i + 599) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 601))) { let e = 0; while (Number.isInteger(num / (i + 601))) { e++; num /= (i + 601) }; results += (" " + (i + 601) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 607))) { let e = 0; while (Number.isInteger(num / (i + 607))) { e++; num /= (i + 607) }; results += (" " + (i + 607) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 611))) { let e = 0; while (Number.isInteger(num / (i + 611))) { e++; num /= (i + 611) }; results += (" " + (i + 611) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 613))) { let e = 0; while (Number.isInteger(num / (i + 613))) { e++; num /= (i + 613) }; results += (" " + (i + 613) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 617))) { let e = 0; while (Number.isInteger(num / (i + 617))) { e++; num /= (i + 617) }; results += (" " + (i + 617) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 619))) { let e = 0; while (Number.isInteger(num / (i + 619))) { e++; num /= (i + 619) }; results += (" " + (i + 619) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 629))) { let e = 0; while (Number.isInteger(num / (i + 629))) { e++; num /= (i + 629) }; results += (" " + (i + 629) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 631))) { let e = 0; while (Number.isInteger(num / (i + 631))) { e++; num /= (i + 631) }; results += (" " + (i + 631) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 641))) { let e = 0; while (Number.isInteger(num / (i + 641))) { e++; num /= (i + 641) }; results += (" " + (i + 641) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 643))) { let e = 0; while (Number.isInteger(num / (i + 643))) { e++; num /= (i + 643) }; results += (" " + (i + 643) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 647))) { let e = 0; while (Number.isInteger(num / (i + 647))) { e++; num /= (i + 647) }; results += (" " + (i + 647) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 653))) { let e = 0; while (Number.isInteger(num / (i + 653))) { e++; num /= (i + 653) }; results += (" " + (i + 653) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 659))) { let e = 0; while (Number.isInteger(num / (i + 659))) { e++; num /= (i + 659) }; results += (" " + (i + 659) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 661))) { let e = 0; while (Number.isInteger(num / (i + 661))) { e++; num /= (i + 661) }; results += (" " + (i + 661) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 667))) { let e = 0; while (Number.isInteger(num / (i + 667))) { e++; num /= (i + 667) }; results += (" " + (i + 667) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 673))) { let e = 0; while (Number.isInteger(num / (i + 673))) { e++; num /= (i + 673) }; results += (" " + (i + 673) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 677))) { let e = 0; while (Number.isInteger(num / (i + 677))) { e++; num /= (i + 677) }; results += (" " + (i + 677) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 683))) { let e = 0; while (Number.isInteger(num / (i + 683))) { e++; num /= (i + 683) }; results += (" " + (i + 683) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 689))) { let e = 0; while (Number.isInteger(num / (i + 689))) { e++; num /= (i + 689) }; results += (" " + (i + 689) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 691))) { let e = 0; while (Number.isInteger(num / (i + 691))) { e++; num /= (i + 691) }; results += (" " + (i + 691) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 697))) { let e = 0; while (Number.isInteger(num / (i + 697))) { e++; num /= (i + 697) }; results += (" " + (i + 697) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 701))) { let e = 0; while (Number.isInteger(num / (i + 701))) { e++; num /= (i + 701) }; results += (" " + (i + 701) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 703))) { let e = 0; while (Number.isInteger(num / (i + 703))) { e++; num /= (i + 703) }; results += (" " + (i + 703) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 709))) { let e = 0; while (Number.isInteger(num / (i + 709))) { e++; num /= (i + 709) }; results += (" " + (i + 709) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 713))) { let e = 0; while (Number.isInteger(num / (i + 713))) { e++; num /= (i + 713) }; results += (" " + (i + 713) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 719))) { let e = 0; while (Number.isInteger(num / (i + 719))) { e++; num /= (i + 719) }; results += (" " + (i + 719) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 727))) { let e = 0; while (Number.isInteger(num / (i + 727))) { e++; num /= (i + 727) }; results += (" " + (i + 727) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 731))) { let e = 0; while (Number.isInteger(num / (i + 731))) { e++; num /= (i + 731) }; results += (" " + (i + 731) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 733))) { let e = 0; while (Number.isInteger(num / (i + 733))) { e++; num /= (i + 733) }; results += (" " + (i + 733) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 739))) { let e = 0; while (Number.isInteger(num / (i + 739))) { e++; num /= (i + 739) }; results += (" " + (i + 739) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 743))) { let e = 0; while (Number.isInteger(num / (i + 743))) { e++; num /= (i + 743) }; results += (" " + (i + 743) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 751))) { let e = 0; while (Number.isInteger(num / (i + 751))) { e++; num /= (i + 751) }; results += (" " + (i + 751) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 757))) { let e = 0; while (Number.isInteger(num / (i + 757))) { e++; num /= (i + 757) }; results += (" " + (i + 757) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 761))) { let e = 0; while (Number.isInteger(num / (i + 761))) { e++; num /= (i + 761) }; results += (" " + (i + 761) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 767))) { let e = 0; while (Number.isInteger(num / (i + 767))) { e++; num /= (i + 767) }; results += (" " + (i + 767) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 769))) { let e = 0; while (Number.isInteger(num / (i + 769))) { e++; num /= (i + 769) }; results += (" " + (i + 769) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 773))) { let e = 0; while (Number.isInteger(num / (i + 773))) { e++; num /= (i + 773) }; results += (" " + (i + 773) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 779))) { let e = 0; while (Number.isInteger(num / (i + 779))) { e++; num /= (i + 779) }; results += (" " + (i + 779) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 787))) { let e = 0; while (Number.isInteger(num / (i + 787))) { e++; num /= (i + 787) }; results += (" " + (i + 787) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 793))) { let e = 0; while (Number.isInteger(num / (i + 793))) { e++; num /= (i + 793) }; results += (" " + (i + 793) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 797))) { let e = 0; while (Number.isInteger(num / (i + 797))) { e++; num /= (i + 797) }; results += (" " + (i + 797) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 799))) { let e = 0; while (Number.isInteger(num / (i + 799))) { e++; num /= (i + 799) }; results += (" " + (i + 799) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 809))) { let e = 0; while (Number.isInteger(num / (i + 809))) { e++; num /= (i + 809) }; results += (" " + (i + 809) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 811))) { let e = 0; while (Number.isInteger(num / (i + 811))) { e++; num /= (i + 811) }; results += (" " + (i + 811) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 817))) { let e = 0; while (Number.isInteger(num / (i + 817))) { e++; num /= (i + 817) }; results += (" " + (i + 817) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 821))) { let e = 0; while (Number.isInteger(num / (i + 821))) { e++; num /= (i + 821) }; results += (" " + (i + 821) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 823))) { let e = 0; while (Number.isInteger(num / (i + 823))) { e++; num /= (i + 823) }; results += (" " + (i + 823) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 827))) { let e = 0; while (Number.isInteger(num / (i + 827))) { e++; num /= (i + 827) }; results += (" " + (i + 827) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 829))) { let e = 0; while (Number.isInteger(num / (i + 829))) { e++; num /= (i + 829) }; results += (" " + (i + 829) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 839))) { let e = 0; while (Number.isInteger(num / (i + 839))) { e++; num /= (i + 839) }; results += (" " + (i + 839) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 841))) { let e = 0; while (Number.isInteger(num / (i + 841))) { e++; num /= (i + 841) }; results += (" " + (i + 841) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 851))) { let e = 0; while (Number.isInteger(num / (i + 851))) { e++; num /= (i + 851) }; results += (" " + (i + 851) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 853))) { let e = 0; while (Number.isInteger(num / (i + 853))) { e++; num /= (i + 853) }; results += (" " + (i + 853) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 857))) { let e = 0; while (Number.isInteger(num / (i + 857))) { e++; num /= (i + 857) }; results += (" " + (i + 857) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 859))) { let e = 0; while (Number.isInteger(num / (i + 859))) { e++; num /= (i + 859) }; results += (" " + (i + 859) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 863))) { let e = 0; while (Number.isInteger(num / (i + 863))) { e++; num /= (i + 863) }; results += (" " + (i + 863) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 871))) { let e = 0; while (Number.isInteger(num / (i + 871))) { e++; num /= (i + 871) }; results += (" " + (i + 871) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 877))) { let e = 0; while (Number.isInteger(num / (i + 877))) { e++; num /= (i + 877) }; results += (" " + (i + 877) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 881))) { let e = 0; while (Number.isInteger(num / (i + 881))) { e++; num /= (i + 881) }; results += (" " + (i + 881) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 883))) { let e = 0; while (Number.isInteger(num / (i + 883))) { e++; num /= (i + 883) }; results += (" " + (i + 883) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 887))) { let e = 0; while (Number.isInteger(num / (i + 887))) { e++; num /= (i + 887) }; results += (" " + (i + 887) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 893))) { let e = 0; while (Number.isInteger(num / (i + 893))) { e++; num /= (i + 893) }; results += (" " + (i + 893) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 899))) { let e = 0; while (Number.isInteger(num / (i + 899))) { e++; num /= (i + 899) }; results += (" " + (i + 899) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 901))) { let e = 0; while (Number.isInteger(num / (i + 901))) { e++; num /= (i + 901) }; results += (" " + (i + 901) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 907))) { let e = 0; while (Number.isInteger(num / (i + 907))) { e++; num /= (i + 907) }; results += (" " + (i + 907) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 911))) { let e = 0; while (Number.isInteger(num / (i + 911))) { e++; num /= (i + 911) }; results += (" " + (i + 911) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 919))) { let e = 0; while (Number.isInteger(num / (i + 919))) { e++; num /= (i + 919) }; results += (" " + (i + 919) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 923))) { let e = 0; while (Number.isInteger(num / (i + 923))) { e++; num /= (i + 923) }; results += (" " + (i + 923) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 929))) { let e = 0; while (Number.isInteger(num / (i + 929))) { e++; num /= (i + 929) }; results += (" " + (i + 929) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 937))) { let e = 0; while (Number.isInteger(num / (i + 937))) { e++; num /= (i + 937) }; results += (" " + (i + 937) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 941))) { let e = 0; while (Number.isInteger(num / (i + 941))) { e++; num /= (i + 941) }; results += (" " + (i + 941) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 943))) { let e = 0; while (Number.isInteger(num / (i + 943))) { e++; num /= (i + 943) }; results += (" " + (i + 943) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 947))) { let e = 0; while (Number.isInteger(num / (i + 947))) { e++; num /= (i + 947) }; results += (" " + (i + 947) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 949))) { let e = 0; while (Number.isInteger(num / (i + 949))) { e++; num /= (i + 949) }; results += (" " + (i + 949) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 953))) { let e = 0; while (Number.isInteger(num / (i + 953))) { e++; num /= (i + 953) }; results += (" " + (i + 953) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 961))) { let e = 0; while (Number.isInteger(num / (i + 961))) { e++; num /= (i + 961) }; results += (" " + (i + 961) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 967))) { let e = 0; while (Number.isInteger(num / (i + 967))) { e++; num /= (i + 967) }; results += (" " + (i + 967) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 971))) { let e = 0; while (Number.isInteger(num / (i + 971))) { e++; num /= (i + 971) }; results += (" " + (i + 971) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 977))) { let e = 0; while (Number.isInteger(num / (i + 977))) { e++; num /= (i + 977) }; results += (" " + (i + 977) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 983))) { let e = 0; while (Number.isInteger(num / (i + 983))) { e++; num /= (i + 983) }; results += (" " + (i + 983) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 989))) { let e = 0; while (Number.isInteger(num / (i + 989))) { e++; num /= (i + 989) }; results += (" " + (i + 989) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 991))) { let e = 0; while (Number.isInteger(num / (i + 991))) { e++; num /= (i + 991) }; results += (" " + (i + 991) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 997))) { let e = 0; while (Number.isInteger(num / (i + 997))) { e++; num /= (i + 997) }; results += (" " + (i + 997) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1003))) { let e = 0; while (Number.isInteger(num / (i + 1003))) { e++; num /= (i + 1003) }; results += (" " + (i + 1003) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1007))) { let e = 0; while (Number.isInteger(num / (i + 1007))) { e++; num /= (i + 1007) }; results += (" " + (i + 1007) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1009))) { let e = 0; while (Number.isInteger(num / (i + 1009))) { e++; num /= (i + 1009) }; results += (" " + (i + 1009) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1013))) { let e = 0; while (Number.isInteger(num / (i + 1013))) { e++; num /= (i + 1013) }; results += (" " + (i + 1013) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1019))) { let e = 0; while (Number.isInteger(num / (i + 1019))) { e++; num /= (i + 1019) }; results += (" " + (i + 1019) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1021))) { let e = 0; while (Number.isInteger(num / (i + 1021))) { e++; num /= (i + 1021) }; results += (" " + (i + 1021) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1027))) { let e = 0; while (Number.isInteger(num / (i + 1027))) { e++; num /= (i + 1027) }; results += (" " + (i + 1027) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1031))) { let e = 0; while (Number.isInteger(num / (i + 1031))) { e++; num /= (i + 1031) }; results += (" " + (i + 1031) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1033))) { let e = 0; while (Number.isInteger(num / (i + 1033))) { e++; num /= (i + 1033) }; results += (" " + (i + 1033) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1037))) { let e = 0; while (Number.isInteger(num / (i + 1037))) { e++; num /= (i + 1037) }; results += (" " + (i + 1037) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1039))) { let e = 0; while (Number.isInteger(num / (i + 1039))) { e++; num /= (i + 1039) }; results += (" " + (i + 1039) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1049))) { let e = 0; while (Number.isInteger(num / (i + 1049))) { e++; num /= (i + 1049) }; results += (" " + (i + 1049) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1051))) { let e = 0; while (Number.isInteger(num / (i + 1051))) { e++; num /= (i + 1051) }; results += (" " + (i + 1051) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1061))) { let e = 0; while (Number.isInteger(num / (i + 1061))) { e++; num /= (i + 1061) }; results += (" " + (i + 1061) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1063))) { let e = 0; while (Number.isInteger(num / (i + 1063))) { e++; num /= (i + 1063) }; results += (" " + (i + 1063) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1069))) { let e = 0; while (Number.isInteger(num / (i + 1069))) { e++; num /= (i + 1069) }; results += (" " + (i + 1069) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1073))) { let e = 0; while (Number.isInteger(num / (i + 1073))) { e++; num /= (i + 1073) }; results += (" " + (i + 1073) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1079))) { let e = 0; while (Number.isInteger(num / (i + 1079))) { e++; num /= (i + 1079) }; results += (" " + (i + 1079) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1081))) { let e = 0; while (Number.isInteger(num / (i + 1081))) { e++; num /= (i + 1081) }; results += (" " + (i + 1081) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1087))) { let e = 0; while (Number.isInteger(num / (i + 1087))) { e++; num /= (i + 1087) }; results += (" " + (i + 1087) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1091))) { let e = 0; while (Number.isInteger(num / (i + 1091))) { e++; num /= (i + 1091) }; results += (" " + (i + 1091) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1093))) { let e = 0; while (Number.isInteger(num / (i + 1093))) { e++; num /= (i + 1093) }; results += (" " + (i + 1093) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1097))) { let e = 0; while (Number.isInteger(num / (i + 1097))) { e++; num /= (i + 1097) }; results += (" " + (i + 1097) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1103))) { let e = 0; while (Number.isInteger(num / (i + 1103))) { e++; num /= (i + 1103) }; results += (" " + (i + 1103) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1109))) { let e = 0; while (Number.isInteger(num / (i + 1109))) { e++; num /= (i + 1109) }; results += (" " + (i + 1109) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1117))) { let e = 0; while (Number.isInteger(num / (i + 1117))) { e++; num /= (i + 1117) }; results += (" " + (i + 1117) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1121))) { let e = 0; while (Number.isInteger(num / (i + 1121))) { e++; num /= (i + 1121) }; results += (" " + (i + 1121) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1123))) { let e = 0; while (Number.isInteger(num / (i + 1123))) { e++; num /= (i + 1123) }; results += (" " + (i + 1123) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1129))) { let e = 0; while (Number.isInteger(num / (i + 1129))) { e++; num /= (i + 1129) }; results += (" " + (i + 1129) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1139))) { let e = 0; while (Number.isInteger(num / (i + 1139))) { e++; num /= (i + 1139) }; results += (" " + (i + 1139) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1147))) { let e = 0; while (Number.isInteger(num / (i + 1147))) { e++; num /= (i + 1147) }; results += (" " + (i + 1147) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1151))) { let e = 0; while (Number.isInteger(num / (i + 1151))) { e++; num /= (i + 1151) }; results += (" " + (i + 1151) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1153))) { let e = 0; while (Number.isInteger(num / (i + 1153))) { e++; num /= (i + 1153) }; results += (" " + (i + 1153) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1157))) { let e = 0; while (Number.isInteger(num / (i + 1157))) { e++; num /= (i + 1157) }; results += (" " + (i + 1157) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1159))) { let e = 0; while (Number.isInteger(num / (i + 1159))) { e++; num /= (i + 1159) }; results += (" " + (i + 1159) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1163))) { let e = 0; while (Number.isInteger(num / (i + 1163))) { e++; num /= (i + 1163) }; results += (" " + (i + 1163) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1171))) { let e = 0; while (Number.isInteger(num / (i + 1171))) { e++; num /= (i + 1171) }; results += (" " + (i + 1171) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1181))) { let e = 0; while (Number.isInteger(num / (i + 1181))) { e++; num /= (i + 1181) }; results += (" " + (i + 1181) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1187))) { let e = 0; while (Number.isInteger(num / (i + 1187))) { e++; num /= (i + 1187) }; results += (" " + (i + 1187) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1189))) { let e = 0; while (Number.isInteger(num / (i + 1189))) { e++; num /= (i + 1189) }; results += (" " + (i + 1189) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1193))) { let e = 0; while (Number.isInteger(num / (i + 1193))) { e++; num /= (i + 1193) }; results += (" " + (i + 1193) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1201))) { let e = 0; while (Number.isInteger(num / (i + 1201))) { e++; num /= (i + 1201) }; results += (" " + (i + 1201) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1207))) { let e = 0; while (Number.isInteger(num / (i + 1207))) { e++; num /= (i + 1207) }; results += (" " + (i + 1207) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1213))) { let e = 0; while (Number.isInteger(num / (i + 1213))) { e++; num /= (i + 1213) }; results += (" " + (i + 1213) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1217))) { let e = 0; while (Number.isInteger(num / (i + 1217))) { e++; num /= (i + 1217) }; results += (" " + (i + 1217) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1219))) { let e = 0; while (Number.isInteger(num / (i + 1219))) { e++; num /= (i + 1219) }; results += (" " + (i + 1219) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1223))) { let e = 0; while (Number.isInteger(num / (i + 1223))) { e++; num /= (i + 1223) }; results += (" " + (i + 1223) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1229))) { let e = 0; while (Number.isInteger(num / (i + 1229))) { e++; num /= (i + 1229) }; results += (" " + (i + 1229) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1231))) { let e = 0; while (Number.isInteger(num / (i + 1231))) { e++; num /= (i + 1231) }; results += (" " + (i + 1231) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1237))) { let e = 0; while (Number.isInteger(num / (i + 1237))) { e++; num /= (i + 1237) }; results += (" " + (i + 1237) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1241))) { let e = 0; while (Number.isInteger(num / (i + 1241))) { e++; num /= (i + 1241) }; results += (" " + (i + 1241) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1247))) { let e = 0; while (Number.isInteger(num / (i + 1247))) { e++; num /= (i + 1247) }; results += (" " + (i + 1247) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1249))) { let e = 0; while (Number.isInteger(num / (i + 1249))) { e++; num /= (i + 1249) }; results += (" " + (i + 1249) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1259))) { let e = 0; while (Number.isInteger(num / (i + 1259))) { e++; num /= (i + 1259) }; results += (" " + (i + 1259) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1261))) { let e = 0; while (Number.isInteger(num / (i + 1261))) { e++; num /= (i + 1261) }; results += (" " + (i + 1261) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1271))) { let e = 0; while (Number.isInteger(num / (i + 1271))) { e++; num /= (i + 1271) }; results += (" " + (i + 1271) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1273))) { let e = 0; while (Number.isInteger(num / (i + 1273))) { e++; num /= (i + 1273) }; results += (" " + (i + 1273) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1277))) { let e = 0; while (Number.isInteger(num / (i + 1277))) { e++; num /= (i + 1277) }; results += (" " + (i + 1277) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1279))) { let e = 0; while (Number.isInteger(num / (i + 1279))) { e++; num /= (i + 1279) }; results += (" " + (i + 1279) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1283))) { let e = 0; while (Number.isInteger(num / (i + 1283))) { e++; num /= (i + 1283) }; results += (" " + (i + 1283) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1289))) { let e = 0; while (Number.isInteger(num / (i + 1289))) { e++; num /= (i + 1289) }; results += (" " + (i + 1289) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1291))) { let e = 0; while (Number.isInteger(num / (i + 1291))) { e++; num /= (i + 1291) }; results += (" " + (i + 1291) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1297))) { let e = 0; while (Number.isInteger(num / (i + 1297))) { e++; num /= (i + 1297) }; results += (" " + (i + 1297) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1301))) { let e = 0; while (Number.isInteger(num / (i + 1301))) { e++; num /= (i + 1301) }; results += (" " + (i + 1301) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1303))) { let e = 0; while (Number.isInteger(num / (i + 1303))) { e++; num /= (i + 1303) }; results += (" " + (i + 1303) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1307))) { let e = 0; while (Number.isInteger(num / (i + 1307))) { e++; num /= (i + 1307) }; results += (" " + (i + 1307) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1313))) { let e = 0; while (Number.isInteger(num / (i + 1313))) { e++; num /= (i + 1313) }; results += (" " + (i + 1313) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1319))) { let e = 0; while (Number.isInteger(num / (i + 1319))) { e++; num /= (i + 1319) }; results += (" " + (i + 1319) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1321))) { let e = 0; while (Number.isInteger(num / (i + 1321))) { e++; num /= (i + 1321) }; results += (" " + (i + 1321) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1327))) { let e = 0; while (Number.isInteger(num / (i + 1327))) { e++; num /= (i + 1327) }; results += (" " + (i + 1327) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1333))) { let e = 0; while (Number.isInteger(num / (i + 1333))) { e++; num /= (i + 1333) }; results += (" " + (i + 1333) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1339))) { let e = 0; while (Number.isInteger(num / (i + 1339))) { e++; num /= (i + 1339) }; results += (" " + (i + 1339) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1343))) { let e = 0; while (Number.isInteger(num / (i + 1343))) { e++; num /= (i + 1343) }; results += (" " + (i + 1343) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1349))) { let e = 0; while (Number.isInteger(num / (i + 1349))) { e++; num /= (i + 1349) }; results += (" " + (i + 1349) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1357))) { let e = 0; while (Number.isInteger(num / (i + 1357))) { e++; num /= (i + 1357) }; results += (" " + (i + 1357) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1361))) { let e = 0; while (Number.isInteger(num / (i + 1361))) { e++; num /= (i + 1361) }; results += (" " + (i + 1361) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1363))) { let e = 0; while (Number.isInteger(num / (i + 1363))) { e++; num /= (i + 1363) }; results += (" " + (i + 1363) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1367))) { let e = 0; while (Number.isInteger(num / (i + 1367))) { e++; num /= (i + 1367) }; results += (" " + (i + 1367) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1369))) { let e = 0; while (Number.isInteger(num / (i + 1369))) { e++; num /= (i + 1369) }; results += (" " + (i + 1369) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1373))) { let e = 0; while (Number.isInteger(num / (i + 1373))) { e++; num /= (i + 1373) }; results += (" " + (i + 1373) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1381))) { let e = 0; while (Number.isInteger(num / (i + 1381))) { e++; num /= (i + 1381) }; results += (" " + (i + 1381) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1387))) { let e = 0; while (Number.isInteger(num / (i + 1387))) { e++; num /= (i + 1387) }; results += (" " + (i + 1387) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1391))) { let e = 0; while (Number.isInteger(num / (i + 1391))) { e++; num /= (i + 1391) }; results += (" " + (i + 1391) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1399))) { let e = 0; while (Number.isInteger(num / (i + 1399))) { e++; num /= (i + 1399) }; results += (" " + (i + 1399) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1403))) { let e = 0; while (Number.isInteger(num / (i + 1403))) { e++; num /= (i + 1403) }; results += (" " + (i + 1403) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1409))) { let e = 0; while (Number.isInteger(num / (i + 1409))) { e++; num /= (i + 1409) }; results += (" " + (i + 1409) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1411))) { let e = 0; while (Number.isInteger(num / (i + 1411))) { e++; num /= (i + 1411) }; results += (" " + (i + 1411) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1417))) { let e = 0; while (Number.isInteger(num / (i + 1417))) { e++; num /= (i + 1417) }; results += (" " + (i + 1417) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1423))) { let e = 0; while (Number.isInteger(num / (i + 1423))) { e++; num /= (i + 1423) }; results += (" " + (i + 1423) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1427))) { let e = 0; while (Number.isInteger(num / (i + 1427))) { e++; num /= (i + 1427) }; results += (" " + (i + 1427) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1429))) { let e = 0; while (Number.isInteger(num / (i + 1429))) { e++; num /= (i + 1429) }; results += (" " + (i + 1429) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1433))) { let e = 0; while (Number.isInteger(num / (i + 1433))) { e++; num /= (i + 1433) }; results += (" " + (i + 1433) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1439))) { let e = 0; while (Number.isInteger(num / (i + 1439))) { e++; num /= (i + 1439) }; results += (" " + (i + 1439) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1447))) { let e = 0; while (Number.isInteger(num / (i + 1447))) { e++; num /= (i + 1447) }; results += (" " + (i + 1447) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1451))) { let e = 0; while (Number.isInteger(num / (i + 1451))) { e++; num /= (i + 1451) }; results += (" " + (i + 1451) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1453))) { let e = 0; while (Number.isInteger(num / (i + 1453))) { e++; num /= (i + 1453) }; results += (" " + (i + 1453) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1457))) { let e = 0; while (Number.isInteger(num / (i + 1457))) { e++; num /= (i + 1457) }; results += (" " + (i + 1457) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1459))) { let e = 0; while (Number.isInteger(num / (i + 1459))) { e++; num /= (i + 1459) }; results += (" " + (i + 1459) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1469))) { let e = 0; while (Number.isInteger(num / (i + 1469))) { e++; num /= (i + 1469) }; results += (" " + (i + 1469) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1471))) { let e = 0; while (Number.isInteger(num / (i + 1471))) { e++; num /= (i + 1471) }; results += (" " + (i + 1471) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1481))) { let e = 0; while (Number.isInteger(num / (i + 1481))) { e++; num /= (i + 1481) }; results += (" " + (i + 1481) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1483))) { let e = 0; while (Number.isInteger(num / (i + 1483))) { e++; num /= (i + 1483) }; results += (" " + (i + 1483) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1487))) { let e = 0; while (Number.isInteger(num / (i + 1487))) { e++; num /= (i + 1487) }; results += (" " + (i + 1487) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1489))) { let e = 0; while (Number.isInteger(num / (i + 1489))) { e++; num /= (i + 1489) }; results += (" " + (i + 1489) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1493))) { let e = 0; while (Number.isInteger(num / (i + 1493))) { e++; num /= (i + 1493) }; results += (" " + (i + 1493) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1499))) { let e = 0; while (Number.isInteger(num / (i + 1499))) { e++; num /= (i + 1499) }; results += (" " + (i + 1499) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1501))) { let e = 0; while (Number.isInteger(num / (i + 1501))) { e++; num /= (i + 1501) }; results += (" " + (i + 1501) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1511))) { let e = 0; while (Number.isInteger(num / (i + 1511))) { e++; num /= (i + 1511) }; results += (" " + (i + 1511) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1513))) { let e = 0; while (Number.isInteger(num / (i + 1513))) { e++; num /= (i + 1513) }; results += (" " + (i + 1513) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1517))) { let e = 0; while (Number.isInteger(num / (i + 1517))) { e++; num /= (i + 1517) }; results += (" " + (i + 1517) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1523))) { let e = 0; while (Number.isInteger(num / (i + 1523))) { e++; num /= (i + 1523) }; results += (" " + (i + 1523) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1531))) { let e = 0; while (Number.isInteger(num / (i + 1531))) { e++; num /= (i + 1531) }; results += (" " + (i + 1531) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1537))) { let e = 0; while (Number.isInteger(num / (i + 1537))) { e++; num /= (i + 1537) }; results += (" " + (i + 1537) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1541))) { let e = 0; while (Number.isInteger(num / (i + 1541))) { e++; num /= (i + 1541) }; results += (" " + (i + 1541) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1543))) { let e = 0; while (Number.isInteger(num / (i + 1543))) { e++; num /= (i + 1543) }; results += (" " + (i + 1543) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1549))) { let e = 0; while (Number.isInteger(num / (i + 1549))) { e++; num /= (i + 1549) }; results += (" " + (i + 1549) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1553))) { let e = 0; while (Number.isInteger(num / (i + 1553))) { e++; num /= (i + 1553) }; results += (" " + (i + 1553) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1559))) { let e = 0; while (Number.isInteger(num / (i + 1559))) { e++; num /= (i + 1559) }; results += (" " + (i + 1559) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1567))) { let e = 0; while (Number.isInteger(num / (i + 1567))) { e++; num /= (i + 1567) }; results += (" " + (i + 1567) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1571))) { let e = 0; while (Number.isInteger(num / (i + 1571))) { e++; num /= (i + 1571) }; results += (" " + (i + 1571) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1577))) { let e = 0; while (Number.isInteger(num / (i + 1577))) { e++; num /= (i + 1577) }; results += (" " + (i + 1577) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1579))) { let e = 0; while (Number.isInteger(num / (i + 1579))) { e++; num /= (i + 1579) }; results += (" " + (i + 1579) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1583))) { let e = 0; while (Number.isInteger(num / (i + 1583))) { e++; num /= (i + 1583) }; results += (" " + (i + 1583) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1591))) { let e = 0; while (Number.isInteger(num / (i + 1591))) { e++; num /= (i + 1591) }; results += (" " + (i + 1591) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1597))) { let e = 0; while (Number.isInteger(num / (i + 1597))) { e++; num /= (i + 1597) }; results += (" " + (i + 1597) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1601))) { let e = 0; while (Number.isInteger(num / (i + 1601))) { e++; num /= (i + 1601) }; results += (" " + (i + 1601) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1607))) { let e = 0; while (Number.isInteger(num / (i + 1607))) { e++; num /= (i + 1607) }; results += (" " + (i + 1607) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1609))) { let e = 0; while (Number.isInteger(num / (i + 1609))) { e++; num /= (i + 1609) }; results += (" " + (i + 1609) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1613))) { let e = 0; while (Number.isInteger(num / (i + 1613))) { e++; num /= (i + 1613) }; results += (" " + (i + 1613) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1619))) { let e = 0; while (Number.isInteger(num / (i + 1619))) { e++; num /= (i + 1619) }; results += (" " + (i + 1619) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1621))) { let e = 0; while (Number.isInteger(num / (i + 1621))) { e++; num /= (i + 1621) }; results += (" " + (i + 1621) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1627))) { let e = 0; while (Number.isInteger(num / (i + 1627))) { e++; num /= (i + 1627) }; results += (" " + (i + 1627) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1633))) { let e = 0; while (Number.isInteger(num / (i + 1633))) { e++; num /= (i + 1633) }; results += (" " + (i + 1633) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1637))) { let e = 0; while (Number.isInteger(num / (i + 1637))) { e++; num /= (i + 1637) }; results += (" " + (i + 1637) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1643))) { let e = 0; while (Number.isInteger(num / (i + 1643))) { e++; num /= (i + 1643) }; results += (" " + (i + 1643) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1649))) { let e = 0; while (Number.isInteger(num / (i + 1649))) { e++; num /= (i + 1649) }; results += (" " + (i + 1649) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1651))) { let e = 0; while (Number.isInteger(num / (i + 1651))) { e++; num /= (i + 1651) }; results += (" " + (i + 1651) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1657))) { let e = 0; while (Number.isInteger(num / (i + 1657))) { e++; num /= (i + 1657) }; results += (" " + (i + 1657) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1663))) { let e = 0; while (Number.isInteger(num / (i + 1663))) { e++; num /= (i + 1663) }; results += (" " + (i + 1663) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1667))) { let e = 0; while (Number.isInteger(num / (i + 1667))) { e++; num /= (i + 1667) }; results += (" " + (i + 1667) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1669))) { let e = 0; while (Number.isInteger(num / (i + 1669))) { e++; num /= (i + 1669) }; results += (" " + (i + 1669) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1679))) { let e = 0; while (Number.isInteger(num / (i + 1679))) { e++; num /= (i + 1679) }; results += (" " + (i + 1679) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1681))) { let e = 0; while (Number.isInteger(num / (i + 1681))) { e++; num /= (i + 1681) }; results += (" " + (i + 1681) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1691))) { let e = 0; while (Number.isInteger(num / (i + 1691))) { e++; num /= (i + 1691) }; results += (" " + (i + 1691) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1693))) { let e = 0; while (Number.isInteger(num / (i + 1693))) { e++; num /= (i + 1693) }; results += (" " + (i + 1693) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1697))) { let e = 0; while (Number.isInteger(num / (i + 1697))) { e++; num /= (i + 1697) }; results += (" " + (i + 1697) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1699))) { let e = 0; while (Number.isInteger(num / (i + 1699))) { e++; num /= (i + 1699) }; results += (" " + (i + 1699) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1703))) { let e = 0; while (Number.isInteger(num / (i + 1703))) { e++; num /= (i + 1703) }; results += (" " + (i + 1703) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1709))) { let e = 0; while (Number.isInteger(num / (i + 1709))) { e++; num /= (i + 1709) }; results += (" " + (i + 1709) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1711))) { let e = 0; while (Number.isInteger(num / (i + 1711))) { e++; num /= (i + 1711) }; results += (" " + (i + 1711) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1717))) { let e = 0; while (Number.isInteger(num / (i + 1717))) { e++; num /= (i + 1717) }; results += (" " + (i + 1717) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1721))) { let e = 0; while (Number.isInteger(num / (i + 1721))) { e++; num /= (i + 1721) }; results += (" " + (i + 1721) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1723))) { let e = 0; while (Number.isInteger(num / (i + 1723))) { e++; num /= (i + 1723) }; results += (" " + (i + 1723) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1733))) { let e = 0; while (Number.isInteger(num / (i + 1733))) { e++; num /= (i + 1733) }; results += (" " + (i + 1733) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1739))) { let e = 0; while (Number.isInteger(num / (i + 1739))) { e++; num /= (i + 1739) }; results += (" " + (i + 1739) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1741))) { let e = 0; while (Number.isInteger(num / (i + 1741))) { e++; num /= (i + 1741) }; results += (" " + (i + 1741) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1747))) { let e = 0; while (Number.isInteger(num / (i + 1747))) { e++; num /= (i + 1747) }; results += (" " + (i + 1747) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1751))) { let e = 0; while (Number.isInteger(num / (i + 1751))) { e++; num /= (i + 1751) }; results += (" " + (i + 1751) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1753))) { let e = 0; while (Number.isInteger(num / (i + 1753))) { e++; num /= (i + 1753) }; results += (" " + (i + 1753) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1759))) { let e = 0; while (Number.isInteger(num / (i + 1759))) { e++; num /= (i + 1759) }; results += (" " + (i + 1759) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1763))) { let e = 0; while (Number.isInteger(num / (i + 1763))) { e++; num /= (i + 1763) }; results += (" " + (i + 1763) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1769))) { let e = 0; while (Number.isInteger(num / (i + 1769))) { e++; num /= (i + 1769) }; results += (" " + (i + 1769) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1777))) { let e = 0; while (Number.isInteger(num / (i + 1777))) { e++; num /= (i + 1777) }; results += (" " + (i + 1777) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1781))) { let e = 0; while (Number.isInteger(num / (i + 1781))) { e++; num /= (i + 1781) }; results += (" " + (i + 1781) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1783))) { let e = 0; while (Number.isInteger(num / (i + 1783))) { e++; num /= (i + 1783) }; results += (" " + (i + 1783) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1787))) { let e = 0; while (Number.isInteger(num / (i + 1787))) { e++; num /= (i + 1787) }; results += (" " + (i + 1787) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1789))) { let e = 0; while (Number.isInteger(num / (i + 1789))) { e++; num /= (i + 1789) }; results += (" " + (i + 1789) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1801))) { let e = 0; while (Number.isInteger(num / (i + 1801))) { e++; num /= (i + 1801) }; results += (" " + (i + 1801) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1807))) { let e = 0; while (Number.isInteger(num / (i + 1807))) { e++; num /= (i + 1807) }; results += (" " + (i + 1807) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1811))) { let e = 0; while (Number.isInteger(num / (i + 1811))) { e++; num /= (i + 1811) }; results += (" " + (i + 1811) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1817))) { let e = 0; while (Number.isInteger(num / (i + 1817))) { e++; num /= (i + 1817) }; results += (" " + (i + 1817) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1819))) { let e = 0; while (Number.isInteger(num / (i + 1819))) { e++; num /= (i + 1819) }; results += (" " + (i + 1819) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1823))) { let e = 0; while (Number.isInteger(num / (i + 1823))) { e++; num /= (i + 1823) }; results += (" " + (i + 1823) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1829))) { let e = 0; while (Number.isInteger(num / (i + 1829))) { e++; num /= (i + 1829) }; results += (" " + (i + 1829) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1831))) { let e = 0; while (Number.isInteger(num / (i + 1831))) { e++; num /= (i + 1831) }; results += (" " + (i + 1831) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1843))) { let e = 0; while (Number.isInteger(num / (i + 1843))) { e++; num /= (i + 1843) }; results += (" " + (i + 1843) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1847))) { let e = 0; while (Number.isInteger(num / (i + 1847))) { e++; num /= (i + 1847) }; results += (" " + (i + 1847) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1849))) { let e = 0; while (Number.isInteger(num / (i + 1849))) { e++; num /= (i + 1849) }; results += (" " + (i + 1849) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1853))) { let e = 0; while (Number.isInteger(num / (i + 1853))) { e++; num /= (i + 1853) }; results += (" " + (i + 1853) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1861))) { let e = 0; while (Number.isInteger(num / (i + 1861))) { e++; num /= (i + 1861) }; results += (" " + (i + 1861) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1867))) { let e = 0; while (Number.isInteger(num / (i + 1867))) { e++; num /= (i + 1867) }; results += (" " + (i + 1867) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1871))) { let e = 0; while (Number.isInteger(num / (i + 1871))) { e++; num /= (i + 1871) }; results += (" " + (i + 1871) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1873))) { let e = 0; while (Number.isInteger(num / (i + 1873))) { e++; num /= (i + 1873) }; results += (" " + (i + 1873) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1877))) { let e = 0; while (Number.isInteger(num / (i + 1877))) { e++; num /= (i + 1877) }; results += (" " + (i + 1877) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1879))) { let e = 0; while (Number.isInteger(num / (i + 1879))) { e++; num /= (i + 1879) }; results += (" " + (i + 1879) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1889))) { let e = 0; while (Number.isInteger(num / (i + 1889))) { e++; num /= (i + 1889) }; results += (" " + (i + 1889) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1891))) { let e = 0; while (Number.isInteger(num / (i + 1891))) { e++; num /= (i + 1891) }; results += (" " + (i + 1891) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1901))) { let e = 0; while (Number.isInteger(num / (i + 1901))) { e++; num /= (i + 1901) }; results += (" " + (i + 1901) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1907))) { let e = 0; while (Number.isInteger(num / (i + 1907))) { e++; num /= (i + 1907) }; results += (" " + (i + 1907) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1909))) { let e = 0; while (Number.isInteger(num / (i + 1909))) { e++; num /= (i + 1909) }; results += (" " + (i + 1909) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1913))) { let e = 0; while (Number.isInteger(num / (i + 1913))) { e++; num /= (i + 1913) }; results += (" " + (i + 1913) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1919))) { let e = 0; while (Number.isInteger(num / (i + 1919))) { e++; num /= (i + 1919) }; results += (" " + (i + 1919) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1921))) { let e = 0; while (Number.isInteger(num / (i + 1921))) { e++; num /= (i + 1921) }; results += (" " + (i + 1921) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1927))) { let e = 0; while (Number.isInteger(num / (i + 1927))) { e++; num /= (i + 1927) }; results += (" " + (i + 1927) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1931))) { let e = 0; while (Number.isInteger(num / (i + 1931))) { e++; num /= (i + 1931) }; results += (" " + (i + 1931) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1933))) { let e = 0; while (Number.isInteger(num / (i + 1933))) { e++; num /= (i + 1933) }; results += (" " + (i + 1933) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1937))) { let e = 0; while (Number.isInteger(num / (i + 1937))) { e++; num /= (i + 1937) }; results += (" " + (i + 1937) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1943))) { let e = 0; while (Number.isInteger(num / (i + 1943))) { e++; num /= (i + 1943) }; results += (" " + (i + 1943) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1949))) { let e = 0; while (Number.isInteger(num / (i + 1949))) { e++; num /= (i + 1949) }; results += (" " + (i + 1949) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1951))) { let e = 0; while (Number.isInteger(num / (i + 1951))) { e++; num /= (i + 1951) }; results += (" " + (i + 1951) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1957))) { let e = 0; while (Number.isInteger(num / (i + 1957))) { e++; num /= (i + 1957) }; results += (" " + (i + 1957) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1961))) { let e = 0; while (Number.isInteger(num / (i + 1961))) { e++; num /= (i + 1961) }; results += (" " + (i + 1961) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1963))) { let e = 0; while (Number.isInteger(num / (i + 1963))) { e++; num /= (i + 1963) }; results += (" " + (i + 1963) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1973))) { let e = 0; while (Number.isInteger(num / (i + 1973))) { e++; num /= (i + 1973) }; results += (" " + (i + 1973) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1979))) { let e = 0; while (Number.isInteger(num / (i + 1979))) { e++; num /= (i + 1979) }; results += (" " + (i + 1979) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1987))) { let e = 0; while (Number.isInteger(num / (i + 1987))) { e++; num /= (i + 1987) }; results += (" " + (i + 1987) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1993))) { let e = 0; while (Number.isInteger(num / (i + 1993))) { e++; num /= (i + 1993) }; results += (" " + (i + 1993) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1997))) { let e = 0; while (Number.isInteger(num / (i + 1997))) { e++; num /= (i + 1997) }; results += (" " + (i + 1997) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 1999))) { let e = 0; while (Number.isInteger(num / (i + 1999))) { e++; num /= (i + 1999) }; results += (" " + (i + 1999) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2003))) { let e = 0; while (Number.isInteger(num / (i + 2003))) { e++; num /= (i + 2003) }; results += (" " + (i + 2003) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2011))) { let e = 0; while (Number.isInteger(num / (i + 2011))) { e++; num /= (i + 2011) }; results += (" " + (i + 2011) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2017))) { let e = 0; while (Number.isInteger(num / (i + 2017))) { e++; num /= (i + 2017) }; results += (" " + (i + 2017) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2021))) { let e = 0; while (Number.isInteger(num / (i + 2021))) { e++; num /= (i + 2021) }; results += (" " + (i + 2021) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2027))) { let e = 0; while (Number.isInteger(num / (i + 2027))) { e++; num /= (i + 2027) }; results += (" " + (i + 2027) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2029))) { let e = 0; while (Number.isInteger(num / (i + 2029))) { e++; num /= (i + 2029) }; results += (" " + (i + 2029) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2033))) { let e = 0; while (Number.isInteger(num / (i + 2033))) { e++; num /= (i + 2033) }; results += (" " + (i + 2033) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2039))) { let e = 0; while (Number.isInteger(num / (i + 2039))) { e++; num /= (i + 2039) }; results += (" " + (i + 2039) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2041))) { let e = 0; while (Number.isInteger(num / (i + 2041))) { e++; num /= (i + 2041) }; results += (" " + (i + 2041) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2047))) { let e = 0; while (Number.isInteger(num / (i + 2047))) { e++; num /= (i + 2047) }; results += (" " + (i + 2047) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2053))) { let e = 0; while (Number.isInteger(num / (i + 2053))) { e++; num /= (i + 2053) }; results += (" " + (i + 2053) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2059))) { let e = 0; while (Number.isInteger(num / (i + 2059))) { e++; num /= (i + 2059) }; results += (" " + (i + 2059) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2063))) { let e = 0; while (Number.isInteger(num / (i + 2063))) { e++; num /= (i + 2063) }; results += (" " + (i + 2063) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2069))) { let e = 0; while (Number.isInteger(num / (i + 2069))) { e++; num /= (i + 2069) }; results += (" " + (i + 2069) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2071))) { let e = 0; while (Number.isInteger(num / (i + 2071))) { e++; num /= (i + 2071) }; results += (" " + (i + 2071) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2077))) { let e = 0; while (Number.isInteger(num / (i + 2077))) { e++; num /= (i + 2077) }; results += (" " + (i + 2077) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2081))) { let e = 0; while (Number.isInteger(num / (i + 2081))) { e++; num /= (i + 2081) }; results += (" " + (i + 2081) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2083))) { let e = 0; while (Number.isInteger(num / (i + 2083))) { e++; num /= (i + 2083) }; results += (" " + (i + 2083) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2087))) { let e = 0; while (Number.isInteger(num / (i + 2087))) { e++; num /= (i + 2087) }; results += (" " + (i + 2087) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2089))) { let e = 0; while (Number.isInteger(num / (i + 2089))) { e++; num /= (i + 2089) }; results += (" " + (i + 2089) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2099))) { let e = 0; while (Number.isInteger(num / (i + 2099))) { e++; num /= (i + 2099) }; results += (" " + (i + 2099) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2111))) { let e = 0; while (Number.isInteger(num / (i + 2111))) { e++; num /= (i + 2111) }; results += (" " + (i + 2111) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2113))) { let e = 0; while (Number.isInteger(num / (i + 2113))) { e++; num /= (i + 2113) }; results += (" " + (i + 2113) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2117))) { let e = 0; while (Number.isInteger(num / (i + 2117))) { e++; num /= (i + 2117) }; results += (" " + (i + 2117) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2119))) { let e = 0; while (Number.isInteger(num / (i + 2119))) { e++; num /= (i + 2119) }; results += (" " + (i + 2119) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2129))) { let e = 0; while (Number.isInteger(num / (i + 2129))) { e++; num /= (i + 2129) }; results += (" " + (i + 2129) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2131))) { let e = 0; while (Number.isInteger(num / (i + 2131))) { e++; num /= (i + 2131) }; results += (" " + (i + 2131) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2137))) { let e = 0; while (Number.isInteger(num / (i + 2137))) { e++; num /= (i + 2137) }; results += (" " + (i + 2137) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2141))) { let e = 0; while (Number.isInteger(num / (i + 2141))) { e++; num /= (i + 2141) }; results += (" " + (i + 2141) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2143))) { let e = 0; while (Number.isInteger(num / (i + 2143))) { e++; num /= (i + 2143) }; results += (" " + (i + 2143) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2147))) { let e = 0; while (Number.isInteger(num / (i + 2147))) { e++; num /= (i + 2147) }; results += (" " + (i + 2147) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2153))) { let e = 0; while (Number.isInteger(num / (i + 2153))) { e++; num /= (i + 2153) }; results += (" " + (i + 2153) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2159))) { let e = 0; while (Number.isInteger(num / (i + 2159))) { e++; num /= (i + 2159) }; results += (" " + (i + 2159) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2161))) { let e = 0; while (Number.isInteger(num / (i + 2161))) { e++; num /= (i + 2161) }; results += (" " + (i + 2161) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2171))) { let e = 0; while (Number.isInteger(num / (i + 2171))) { e++; num /= (i + 2171) }; results += (" " + (i + 2171) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2173))) { let e = 0; while (Number.isInteger(num / (i + 2173))) { e++; num /= (i + 2173) }; results += (" " + (i + 2173) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2179))) { let e = 0; while (Number.isInteger(num / (i + 2179))) { e++; num /= (i + 2179) }; results += (" " + (i + 2179) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2183))) { let e = 0; while (Number.isInteger(num / (i + 2183))) { e++; num /= (i + 2183) }; results += (" " + (i + 2183) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2197))) { let e = 0; while (Number.isInteger(num / (i + 2197))) { e++; num /= (i + 2197) }; results += (" " + (i + 2197) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2201))) { let e = 0; while (Number.isInteger(num / (i + 2201))) { e++; num /= (i + 2201) }; results += (" " + (i + 2201) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2203))) { let e = 0; while (Number.isInteger(num / (i + 2203))) { e++; num /= (i + 2203) }; results += (" " + (i + 2203) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2207))) { let e = 0; while (Number.isInteger(num / (i + 2207))) { e++; num /= (i + 2207) }; results += (" " + (i + 2207) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2209))) { let e = 0; while (Number.isInteger(num / (i + 2209))) { e++; num /= (i + 2209) }; results += (" " + (i + 2209) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2213))) { let e = 0; while (Number.isInteger(num / (i + 2213))) { e++; num /= (i + 2213) }; results += (" " + (i + 2213) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2221))) { let e = 0; while (Number.isInteger(num / (i + 2221))) { e++; num /= (i + 2221) }; results += (" " + (i + 2221) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2227))) { let e = 0; while (Number.isInteger(num / (i + 2227))) { e++; num /= (i + 2227) }; results += (" " + (i + 2227) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2231))) { let e = 0; while (Number.isInteger(num / (i + 2231))) { e++; num /= (i + 2231) }; results += (" " + (i + 2231) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2237))) { let e = 0; while (Number.isInteger(num / (i + 2237))) { e++; num /= (i + 2237) }; results += (" " + (i + 2237) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2239))) { let e = 0; while (Number.isInteger(num / (i + 2239))) { e++; num /= (i + 2239) }; results += (" " + (i + 2239) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2243))) { let e = 0; while (Number.isInteger(num / (i + 2243))) { e++; num /= (i + 2243) }; results += (" " + (i + 2243) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2249))) { let e = 0; while (Number.isInteger(num / (i + 2249))) { e++; num /= (i + 2249) }; results += (" " + (i + 2249) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2251))) { let e = 0; while (Number.isInteger(num / (i + 2251))) { e++; num /= (i + 2251) }; results += (" " + (i + 2251) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2257))) { let e = 0; while (Number.isInteger(num / (i + 2257))) { e++; num /= (i + 2257) }; results += (" " + (i + 2257) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2263))) { let e = 0; while (Number.isInteger(num / (i + 2263))) { e++; num /= (i + 2263) }; results += (" " + (i + 2263) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2267))) { let e = 0; while (Number.isInteger(num / (i + 2267))) { e++; num /= (i + 2267) }; results += (" " + (i + 2267) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2269))) { let e = 0; while (Number.isInteger(num / (i + 2269))) { e++; num /= (i + 2269) }; results += (" " + (i + 2269) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2273))) { let e = 0; while (Number.isInteger(num / (i + 2273))) { e++; num /= (i + 2273) }; results += (" " + (i + 2273) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2279))) { let e = 0; while (Number.isInteger(num / (i + 2279))) { e++; num /= (i + 2279) }; results += (" " + (i + 2279) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2281))) { let e = 0; while (Number.isInteger(num / (i + 2281))) { e++; num /= (i + 2281) }; results += (" " + (i + 2281) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2287))) { let e = 0; while (Number.isInteger(num / (i + 2287))) { e++; num /= (i + 2287) }; results += (" " + (i + 2287) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2291))) { let e = 0; while (Number.isInteger(num / (i + 2291))) { e++; num /= (i + 2291) }; results += (" " + (i + 2291) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2293))) { let e = 0; while (Number.isInteger(num / (i + 2293))) { e++; num /= (i + 2293) }; results += (" " + (i + 2293) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2297))) { let e = 0; while (Number.isInteger(num / (i + 2297))) { e++; num /= (i + 2297) }; results += (" " + (i + 2297) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 2309))) { let e = 0; while (Number.isInteger(num / (i + 2309))) { e++; num /= (i + 2309) }; results += (" " + (i + 2309) + "^" + e + " ×") }; }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ").slice(0, -1)
    if (result_r == num_1) {
        return num_1 + "は素数です。";
    } else {
        return result_r;
    }
}

function PRIME_v10(num, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; }; function eew(a) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; }; var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; var arr = []; for (var i = 2; i <= max; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } } for (var t = 0; t < sieve.length; t++) { if (sieve[t]) { arr.push(t) } } return arr; };
    var k = eew(a + 1); var t = k.reduce((x, y) => x * y); var PRIME_NUMBERS = eew(t + 1); var LEN = PRIME_NUMBERS.length; for (var i = 0; i < LEN; i++) { if (num % PRIME_NUMBERS[i] == 0) { return (num == PRIME_NUMBERS[i]); } }; var P = eew4(t + 1, a); P.splice(0, k.length); P.unshift(1); console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length); for (var i = t; i * i <= num; i += t) { for (var u = 0; u < P.length; u++) { if (num % (i + P[u]) == 0) { return false; } } }; return true;
};

function nPRIME_v10(num, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; }; function eew(a) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; }; var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; var arr = []; for (var i = 2; i <= max; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } } for (var t = 0; t < sieve.length; t++) { if (sieve[t]) { arr.push(t) } } return arr; };
    var k = eew(a + 1); var t = k.reduce((x, y) => x * y); var PRIME_NUMBERS = eew(t + 1); var LEN = PRIME_NUMBERS.length; for (var i = 0; i < LEN; i++) { if (Number.isInteger(num / PRIME_NUMBERS[i])) { return (num == PRIME_NUMBERS[i]); } }; console.time("GENARATE"); var P = eew4(t + 1, a); console.timeEnd("GENARATE"); P.splice(0, k.length); P.unshift(1); console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length); for (var i = t; i * i <= num; i += t) { for (var u = 0; u < P.length; u++) { if (Number.isInteger(num / (i + P[u]))) { return false; } } }; return true;
};

async function isPrimeWebAPI() {
    var N = Number(document.getElementById("res").value);
    if (N <= 1 || N > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (isNaN(N)) {
        result.innerHTML = lang_data[lang]["NaN"];
        return;
    }
    var st = performance.now();
    resu1t.innerHTML = ""
    ti.innerHTML = ""
    result.innerHTML = lang_data[lang]["TestProgressing"];
    await fetch(["https://script.google.com/macros/s/AKfycbzklphLSGzzwuMRx_4FHxIfvxm-uoCHR34rU1b-mXQsHQ42vvzN8W4eYTN8uSL2vPEv/exec?type=PRIME&number=" + String(N)],{
        "method":"GET"
    }).then(response => {
        return response.json();
    }).then(resp => {
        resu1t.innerHTML = `${String(resp.number).length}桁の自然数${resp.number}は`
        result.innerHTML = resp.result ? lang_data[lang]["isPrime"] : lang_data[lang]["isNotPrime"];
        var et = performance.now();
        ti.innerHTML = `計算にかかった時間は${resp.time}msでした。(通信は${et- st}msでした。)`;
        console.log(resp)
    });
    
}

async function isPFDWebAPI() {
    var N = Number(document.getElementById("res").value);
    if (N <= 1 || N > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (isNaN(N)) {
        result.innerHTML = lang_data[lang]["NaN"];
        return;
    }
    var st = performance.now();
    resu1t.innerHTML = ""
    ti.innerHTML = ""
    result.innerHTML = lang_data[lang]["TestProgressing"];
    await fetch(["https://script.google.com/macros/s/AKfycbzklphLSGzzwuMRx_4FHxIfvxm-uoCHR34rU1b-mXQsHQ42vvzN8W4eYTN8uSL2vPEv/exec?type=PFD&number=" + String(N)],{
        "method":"GET"
    }).then(response => {
        return response.json();
    }).then(resp => {
        resu1t.innerHTML = `${String(resp.number).length}桁の自然数${resp.number}を素因数分解する`
        result.innerHTML = resp.result;
        var et = performance.now();
        ti.innerHTML = `計算にかかった時間は${resp.time}msでした。(通信は${et- st}msでした。)`;
        console.log(resp)
    });
    
}


document.addEventListener('keypress', keypr)
function keypr(e) {
    var k = e.key
    if (k == "f" || k == "F") {
        run_PFD()
    } else if (k == "Enter") {
        r()
    } else if (k == "M") {
        r2()
    } else if (k == "R") {
        res.value = OddOnlyRand()
        inputStore()
    } else if (k == "Q") {
        location.reload()
    } else if (k == "g" || k == "G") {
        PRIME_factor()
    } else if (k == "j" || k == "J") {
        result.innerHTML = lang_data[lang]["TestProgressing"];
        run_PRIME_single()
    } else if (k == "P") {
        run_PRIME_single("ov10")
    } else if (k == "p") {
        run_PRIME_single("nv10")
    } else  if (k == "∑" || k == "W"){
        isPrimeWebAPI()
    }
    removeCH()
    return;
}

function removeCH() {
    var l = String(document.getElementById("res").value);
    var g = l.split(".")[0];
    var h = "";
    for (let i = 0; i < g.length; i++) {
        if (!isNaN(Number(g[i]))) {h += g[i]};
    }
    document.getElementById("res").value = h;
    return;
}

function run_PRIME_single_l() {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    var r = Math.floor(parseInt(document.getElementById("res").value, 10));
    var rl = r.toString().length
    if (r <= 1 || r > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (r.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"]
        return;
    } else {
        var t = performance.now()
        var res_1 = factor_isPRIME_v4(r)
        if (res_1) {
            var res = lang_data[lang]["isPrime"]
        } else {
            var res = lang_data[lang]["isNotPrime"]
        }
        result.innerHTML = `→${res}`
        resu1t.innerHTML = `${rl}桁の自然数${r}は`
        var edt = performance.now()
        var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
        ti.innerHTML = `計算にかかった時間は${ert}msでした。`
        return;
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run_PRIME_single(c) {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    await wait(0)
    var r = Math.floor(parseInt(document.getElementById("res").value, 10));
    var rl = r.toString().length
    if (r <= 1 || (BigInt(document.getElementById("res").value) > BigInt("18446744073709551616") && c !== "apr")) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (BigInt(document.getElementById("res").value) >= BigInt("9007199254740992")) {
        switch (c) {
            case "apr":
                var t = performance.now();
                var res_1 = APRtest(BigInt(document.getElementById("res").value));
                if (res_1) {
                    var res = lang_data[lang]["isPrime"]
                } else {
                    var res = lang_data[lang]["isNotPrime"]
                }
                result.innerHTML = `${res}`
                resu1t.innerHTML = `${String(document.getElementById("res").value).length}桁の自然数${document.getElementById("res").value.match(/.{3}/g).join("\n")}は`
                var edt = performance.now()
                var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
                ti.innerHTML = `計算にかかった時間は${ert}msでした。`
                break;
            default:
                result.innerHTML = lang_data[lang]["TestProgressingMlti"];
                isPrimeBig(document.getElementById("res").value);
                break;
        }
    } else if (r.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"]
        return;
    } else {
        var t = performance.now();
        switch (c) {
            case "ov1":
                var res_1 = PRIME_v1(r);
                break;
            case "ov2":
                var res_1 = PRIME_v2(r);
                break;
            case "ov3":
                var res_1 = PRIME_v3(r);
                break;
            case "ov4":
                var res_1 = PRIME_v4(r);
                break;
            case "ov5":
                var res_1 = PRIME_v5(r);
                break;
            case "ov6":
                var res_1 = PRIME_v6(r);
                break;
            case "ov7":
                var res_1 = PRIME_v7(r);
                break;
            case "ov10":
                if (Math.floor(parseInt(document.getElementById("worker").value, 10)) >= 23) {
                    result.innerHTML = "配列の長さの限界を超えてしまうため、判定できません。";
                    return;
                }
                var res_1 = PRIME_v10(r, Math.floor(parseInt(document.getElementById("worker").value, 10)) || 11);
                break;
            case "nv10":
                if (Math.floor(parseInt(document.getElementById("worker").value, 10)) >= 23) {
                    result.innerHTML = "配列の長さの限界を超えてしまうため、判定できません。";
                    return;
                }
                var res_1 = nPRIME_v10(r, Math.floor(parseInt(document.getElementById("worker").value, 10)) || 11);
                break;
            case "nv1":
                var res_1 = factor_isPRIME_v1(r);
                break;
            case "nv2":
                var res_1 = factor_isPRIME_v2(r);
                break;
            case "nv3":
                var res_1 = factor_isPRIME_v3(r);
                break;
            case "nv4":
                var res_1 = factor_isPRIME_v4(r);
                break;
            case "nv5":
                var res_1 = factor_isPRIME_v5(r);
                break;
            case "nv6":
                var res_1 = factor_isPRIME_v6(r);
                break;
            case "nv7":
                var res_1 = factor_isPRIME_v7(r);
                break;
            case "apr":
                var res_1 = APRtest(BigInt(document.getElementById("res").value));
                break;
            case "aks":
                var res_1 = isPrimeAKS(r);
                break;
            default:
                var res_1 = factor_isPRIME_v6(r);
                break;
        }
        if (res_1) {
            var res = lang_data[lang]["isPrime"]
        } else {
            var res = lang_data[lang]["isNotPrime"]
        }
        result.innerHTML = `${res}`
        resu1t.innerHTML = `${rl}桁の自然数${r}は`
        var edt = performance.now()
        var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
        ti.innerHTML = `計算にかかった時間は${ert}msでした。`
        return;
    }
}

function factor_k(n) { let num = Number(n); let factor_array = []; if (num == 1) return [1]; for (let i = 1; i * i <= num; i++) { let f = num / i; if (Number.isInteger(f)) { factor_array.push(i); if (i !== f) { factor_array.push(f) } } }; return factor_array; }

function factor_s(n) { let num = Number(n); let factor_array = []; if (num == 1) return [1]; for (let i = 1; i * i <= num; i++) { let f = num / i; if (Number.isInteger(f)) { factor_array.push(i); if (i !== f) { factor_array.push(f) } } }; return factor_array.sort((x, y) => x - y); }

function PRIME_factor() {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    var n = Math.floor(parseInt(document.getElementById("res").value, 10));
    var rl = n.toString().length
    if (n <= 1 || n > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (r.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"]
        return;
    } else {
        var t = performance.now()
        let f = factor_k(n);
        if (f.length == 2) {
            var res = lang_data[lang]["isPrime"];
        } else {
            var res = `素数ではありません。\n約数は${f.sort((x, y) => x - y).toString().replace(/,/g, ",\n")}です。`
        }
        result.innerHTML = `→${res}`
        resu1t.innerHTML = `${rl}桁の自然数${n}は`
        var edt = performance.now()
        var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
        ti.innerHTML = `計算にかかった時間は${ert}msでした。`
        return;
    }
}

function run_PFD(e) {
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    var r = Math.floor(parseInt(document.getElementById("res").value, 10));
    var rl = r.toString().length
    if (r <= 1 || r > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return;
    } else if (r.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"]
        return;
    } else {
        var t = performance.now()
        switch (e) {
            case "1":
                var res = newPFD_v1(r);
                break;
            case "2":
                var res = newPFD_v2(r);
                break;
            case "3":
                var res = newPFD_v3(r);
                break;
            case "4":
                var res = newPFD_v4(r);
                break;
            case "5":
                var res = newPFD_v5(r);
                break;
            case "6":
                var res = newPFD_v6(r);
                break;
            case "7":
                var res = newPFD_v7(r);
                break;
            default:
                var res = newPFD_v6(r);
                break;
        }
        result.innerHTML = `→${res}`
        resu1t.innerHTML = `${rl}桁の自然数${r}を素因数分解する`
        var edt = performance.now()
        var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
        ti.innerHTML = `分解にかかった時間は${ert}msでした。`
        return;
    }
}

function dispinter() {
    result.innerHTML = lang_data[lang]["TestProgressing"];
}

async function r() {
    var num = Math.floor(parseInt(document.getElementById("res").value, 10));
    var typ = document.getElementById("ty").value
    dispinter();
    switch (typ) {
        case "mu_ov6":
            pr(num)
            break;
        case "mu_nv6":
            pr_3(num)
            break;
        case "mu_big":
            if (num <= 1 || BigInt(document.getElementById("res").value) > BigInt("18446744073709551616")) {
                result.innerHTML = lang_data[lang]["Over"];
                console.log("Over");
                return;
            }
            isPrimeBig(document.getElementById("res").value);
            break;
        case "f": 
            f();
            break;
        case "npv1":
            run_PFD("1");
            break;
        case "npv2":
            run_PFD("2");
            break;
        case "npv3":
            run_PFD("3");
            break;
        case "npv4":
            runPFD("4");
            break;
        case "npv5":
            run_PFD("5");
            break;
        case "npv6":
            run_PFD("6");
            break;
        case "npv7":
            run_PFD("7");
            break;
        default:
            run_PRIME_single(typ)
            break;
    }
}

function r2() {
    var num = Math.floor(parseInt(document.getElementById("res").value, 10));
    if (isNaN(Number(num))) {
        result.innerHTML = lang_data[lang]["NaN"];
    } else if (BigInt(String(num)) > 9007199254740992n) {
        isPrimeBig(document.getElementById("res").value);
    } else {
        pr_3(num);
    }
}

function f() {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    var n = Math.floor(parseInt(document.getElementById("res").value, 10));
    var rl = n.toString().length
    if (n <= 1 || BigInt(document.getElementById("res").value) > BigInt("18446744073709551616")) {
        result.innerHTML = lang_data[lang]["Over"];
        console.log("Over");
        return;
    } else if (BigInt(document.getElementById("res").value) >= BigInt("9007199254740992")) {
        result.innerHTML = lang_data[lang]["TestProgressingMlti"];
        isPrimeBigG(document.getElementById("res").value);
        return;
    } else if (Number.isNaN(n)) {
        result.innerHTML = lang_data[lang]["NaN"]
        return;
    } else {
        var t = performance.now()
        let f = factor_k(n);
        if (f.length == 2) {
            var res = `正の約数の個数が2であるため素数です。`
        } else {
            var res = `正の約数の個数が${f.length}であり、2でないため素数ではありません。\n約数は${f.sort((x, y) => x - y).toString().replace(/,/g, ",\n")}です。`
        }
        result.innerHTML = `→${res}`
        resu1t.innerHTML = `${rl}桁の自然数${n}は`
        var edt = performance.now()
        var ert = Math.floor((edt - t) * (10 ** 5)) / (10 ** 5);
        ti.innerHTML = `計算にかかった時間は${ert}msでした。`
        return;
    }
}

function pr(num_p) {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    let worker_js = `function isPrimeNumber_r5(n, id, mx) {
    let [num, threadId, max] = [Number(n), Number(id), Number(mx)]
    // n:Number to be determined, id:threadsID, mx:Total number of threads
    let prime = [23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,1181,1187,1193,1201,1213,1217,1223,1229,1231,1237,1249,1259,1277,1279,1283,1289,1291,1297,1301,1303,1307,1319,1321,1327,1361,1367,1373,1381,1399,1409,1423,1427,1429,1433,1439,1447,1451,1453,1459,1471,1481,1483,1487,1489,1493,1499,1511,1523,1531,1543,1549,1553,1559,1567,1571,1579,1583,1597,1601,1607,1609,1613,1619,1621,1627,1637,1657,1663,1667,1669,1693,1697,1699,1709,1721,1723,1733,1741,1747,1753,1759,1777,1783,1787,1789,1801,1811,1823,1831,1847,1861,1867,1871,1873,1877,1879,1889,1901,1907,1913,1931,1933,1949,1951,1973,1979,1987,1993,1997,1999,2003,2011,2017,2027,2029,2039,2053,2063,2069,2081,2083,2087,2089,2099,2111,2113,2129,2131,2137,2141,2143,2153,2161,2179,2203,2207,2213,2221,2237,2239,2243,2251,2267,2269,2273,2281,2287,2293,2297,2309];
    let prime_d = [1,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,169,173,179,181,191,193,197,199,211,221,223,227,229,233,239,241,247,251,257,263,269,271,277,281,283,289,293,299,307,311,313,317,323,331,337,347,349,353,359,361,367,373,377,379,383,389,391,397,401,403,409,419,421,431,433,437,439,443,449,457,461,463,467,479,481,487,491,493,499,503,509,521,523,527,529,533,541,547,551,557,559,563,569,571,577,587,589,593,599,601,607,611,613,617,619,629,631,641,643,647,653,659,661,667,673,677,683,689,691,697,701,703,709,713,719,727,731,733,739,743,751,757,761,767,769,773,779,787,793,797,799,809,811,817,821,823,827,829,839,841,851,853,857,859,863,871,877,881,883,887,893,899,901,907,911,919,923,929,937,941,943,947,949,953,961,967,971,977,983,989,991,997,1003,1007,1009,1013,1019,1021,1027,1031,1033,1037,1039,1049,1051,1061,1063,1069,1073,1079,1081,1087,1091,1093,1097,1103,1109,1117,1121,1123,1129,1139,1147,1151,1153,1157,1159,1163,1171,1181,1187,1189,1193,1201,1207,1213,1217,1219,1223,1229,1231,1237,1241,1247,1249,1259,1261,1271,1273,1277,1279,1283,1289,1291,1297,1301,1303,1307,1313,1319,1321,1327,1333,1339,1343,1349,1357,1361,1363,1367,1369,1373,1381,1387,1391,1399,1403,1409,1411,1417,1423,1427,1429,1433,1439,1447,1451,1453,1457,1459,1469,1471,1481,1483,1487,1489,1493,1499,1501,1511,1513,1517,1523,1531,1537,1541,1543,1549,1553,1559,1567,1571,1577,1579,1583,1591,1597,1601,1607,1609,1613,1619,1621,1627,1633,1637,1643,1649,1651,1657,1663,1667,1669,1679,1681,1691,1693,1697,1699,1703,1709,1711,1717,1721,1723,1733,1739,1741,1747,1751,1753,1759,1763,1769,1777,1781,1783,1787,1789,1801,1807,1811,1817,1819,1823,1829,1831,1843,1847,1849,1853,1861,1867,1871,1873,1877,1879,1889,1891,1901,1907,1909,1913,1919,1921,1927,1931,1933,1937,1943,1949,1951,1957,1961,1963,1973,1979,1987,1993,1997,1999,2003,2011,2017,2021,2027,2029,2033,2039,2041,2047,2053,2059,2063,2069,2071,2077,2081,2083,2087,2089,2099,2111,2113,2117,2119,2129,2131,2137,2141,2143,2147,2153,2159,2161,2171,2173,2179,2183,2197,2201,2203,2207,2209,2213,2221,2227,2231,2237,2239,2243,2249,2251,2257,2263,2267,2269,2273,2279,2281,2287,2291,2293,2297,2309];
    for (let i = threadId; i <= prime.length; i += max) {
        if (num == prime[i]) { return true }
        if (num % prime[i] == 0) { return prime[i] }
    };
    for (let u = threadId; u < prime_d.length; u += max) {
      for (let l = 2310; (l + prime_d[u]) *(l + prime_d[u]) <= n; l += 2310) {
        if (num % (l + prime_d[u]) == 0) { return (l + prime_d[u]) };
      }
    };
    return true;
}

self.addEventListener('message', (message) => {
    const num = message.data.num;
    const p = message.data.p;
    const mx = message.data.mx
    const isPrime = isPrimeNumber_r5(num, p, mx);
    self.postMessage(isPrime);
});`
    let b = new Blob([worker_js], { type: 'text/javascript' })

    var num = parseInt(num_p, 10)
    if (num <= 1 || num > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return false;
    } else if (num.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"];
        return false;
    } else {
        resu1t.innerHTML = `${num.toString().length}桁の自然数${num}は`
        var time_st = performance.now();
        var prm = [2, 3, 5, 7, 11, 13, 17, 19]
        console.time("RE")
        if (prm.includes(num)) {
            result.innerHTML = lang_data[lang]["isPrime"]
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${time_end - time_st}msでした。`
            console.timeEnd("RE")
            return true
        } else {
            for (let d = 0; d < prm.length; d++) {
                const el = prm[d];
                if (num % el == 0) {
                    result.innerHTML = "素数ではありません。少なくとも" + String(el) + "で割り切れます。";
                    var time_end = performance.now();
                    console.log(`${time_end - time_st}ms`)
                    ti.innerHTML = `計算にかかった時間は${time_end - time_st}msでした。`
                    console.timeEnd("RE")
                    return false
                }
            }
        }
        console.timeEnd("RE")
        const jobs = [];
        var MAX_WORKERS = Math.floor(parseInt(document.getElementById("worker").value, 10));
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 4 }
        console.log("threads:" + MAX_WORKERS);
        for (let i = 0; i <= MAX_WORKERS - 1; i++) {
            const worker = new Worker(URL.createObjectURL(b));
            const promise = new Promise((resolve, reject) => {
                worker.addEventListener('message', (msg) => {
                    if (msg.data == true) {
                        reject()
                    } else {
                        resolve(msg.data)
                    }
                    worker.terminate();
                });
            });

            jobs.push(promise);
            worker.postMessage({ num: num, p: i, mx: MAX_WORKERS });
        }
        Promise.any(jobs).then((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${(time_end - time_st)}ミリ秒でした。(${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = "素数ではありません。少なくとも" + r + "で割れます。"
        }).catch((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${(time_end - time_st)}ミリ秒でした。(${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = lang_data[lang]["isPrime"]
        });
    }
}

function pr_3(num_p) {
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    resu1t.innerHTML = ""
    let worker_js = `function isPrimeNumber_r5(n, id, mx) {
    let [num, threadId, max] = [Number(n), Number(id), Number(mx)]
    // n:Number to be determined, id:threadsID, mx:Total number of threads
    let prime = [23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,1181,1187,1193,1201,1213,1217,1223,1229,1231,1237,1249,1259,1277,1279,1283,1289,1291,1297,1301,1303,1307,1319,1321,1327,1361,1367,1373,1381,1399,1409,1423,1427,1429,1433,1439,1447,1451,1453,1459,1471,1481,1483,1487,1489,1493,1499,1511,1523,1531,1543,1549,1553,1559,1567,1571,1579,1583,1597,1601,1607,1609,1613,1619,1621,1627,1637,1657,1663,1667,1669,1693,1697,1699,1709,1721,1723,1733,1741,1747,1753,1759,1777,1783,1787,1789,1801,1811,1823,1831,1847,1861,1867,1871,1873,1877,1879,1889,1901,1907,1913,1931,1933,1949,1951,1973,1979,1987,1993,1997,1999,2003,2011,2017,2027,2029,2039,2053,2063,2069,2081,2083,2087,2089,2099,2111,2113,2129,2131,2137,2141,2143,2153,2161,2179,2203,2207,2213,2221,2237,2239,2243,2251,2267,2269,2273,2281,2287,2293,2297,2309];
    let prime_d = [1,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,169,173,179,181,191,193,197,199,211,221,223,227,229,233,239,241,247,251,257,263,269,271,277,281,283,289,293,299,307,311,313,317,323,331,337,347,349,353,359,361,367,373,377,379,383,389,391,397,401,403,409,419,421,431,433,437,439,443,449,457,461,463,467,479,481,487,491,493,499,503,509,521,523,527,529,533,541,547,551,557,559,563,569,571,577,587,589,593,599,601,607,611,613,617,619,629,631,641,643,647,653,659,661,667,673,677,683,689,691,697,701,703,709,713,719,727,731,733,739,743,751,757,761,767,769,773,779,787,793,797,799,809,811,817,821,823,827,829,839,841,851,853,857,859,863,871,877,881,883,887,893,899,901,907,911,919,923,929,937,941,943,947,949,953,961,967,971,977,983,989,991,997,1003,1007,1009,1013,1019,1021,1027,1031,1033,1037,1039,1049,1051,1061,1063,1069,1073,1079,1081,1087,1091,1093,1097,1103,1109,1117,1121,1123,1129,1139,1147,1151,1153,1157,1159,1163,1171,1181,1187,1189,1193,1201,1207,1213,1217,1219,1223,1229,1231,1237,1241,1247,1249,1259,1261,1271,1273,1277,1279,1283,1289,1291,1297,1301,1303,1307,1313,1319,1321,1327,1333,1339,1343,1349,1357,1361,1363,1367,1369,1373,1381,1387,1391,1399,1403,1409,1411,1417,1423,1427,1429,1433,1439,1447,1451,1453,1457,1459,1469,1471,1481,1483,1487,1489,1493,1499,1501,1511,1513,1517,1523,1531,1537,1541,1543,1549,1553,1559,1567,1571,1577,1579,1583,1591,1597,1601,1607,1609,1613,1619,1621,1627,1633,1637,1643,1649,1651,1657,1663,1667,1669,1679,1681,1691,1693,1697,1699,1703,1709,1711,1717,1721,1723,1733,1739,1741,1747,1751,1753,1759,1763,1769,1777,1781,1783,1787,1789,1801,1807,1811,1817,1819,1823,1829,1831,1843,1847,1849,1853,1861,1867,1871,1873,1877,1879,1889,1891,1901,1907,1909,1913,1919,1921,1927,1931,1933,1937,1943,1949,1951,1957,1961,1963,1973,1979,1987,1993,1997,1999,2003,2011,2017,2021,2027,2029,2033,2039,2041,2047,2053,2059,2063,2069,2071,2077,2081,2083,2087,2089,2099,2111,2113,2117,2119,2129,2131,2137,2141,2143,2147,2153,2159,2161,2171,2173,2179,2183,2197,2201,2203,2207,2209,2213,2221,2227,2231,2237,2239,2243,2249,2251,2257,2263,2267,2269,2273,2279,2281,2287,2291,2293,2297,2309];
    for (let i = threadId; i <= prime.length; i += max) {
        if (num == prime[i]) { return true }
        if (Number.isInteger(num / prime[i])) { return prime[i] }
    };
    for (let u = threadId; u < prime_d.length; u += max) {
      for (let l = 2310; (l + prime_d[u]) ** 2 <= n; l += 2310) {
        if (Number.isInteger(num / (l + prime_d[u]))) { return (l + prime_d[u]) };
      }
    };
    return true;
}

self.addEventListener('message', (message) => {
    const num = message.data.num;
    const p = message.data.p;
    const mx = message.data.mx
    const isPrime = isPrimeNumber_r5(num, p, mx);
    self.postMessage(isPrime);
});`
    let b = new Blob([worker_js], { type: 'text/javascript' })

    var num = parseInt(num_p, 10)
    if (num <= 1 || num > 2 ** 53) {
        result.innerHTML = lang_data[lang]["Over"];
        return false;
    } else if (num.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"]
        return false;
    } else {
        resu1t.innerHTML = `${num.toString().length}桁の自然数${num}は`
        var time_st = performance.now();
        var prm = [2, 3, 5, 7, 11, 13, 17, 19]
        console.time("RE")
        if (prm.includes(num)) {
            result.innerHTML = lang_data[lang]["isPrime"]
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${time_end - time_st}msでした。`
            console.timeEnd("RE")
            return true
        } else {
            for (let d = 0; d < prm.length; d++) {
                const el = prm[d];
                if (Number.isInteger(num / el)) {
                    result.innerHTML = "素数ではありません。少なくとも" + String(el) + "で割り切れます。";
                    var time_end = performance.now();
                    console.log(`${time_end - time_st}ms`)
                    ti.innerHTML = `計算にかかった時間は${time_end - time_st}msでした。`
                    console.timeEnd("RE")
                    return false
                }
            }
        }
        console.timeEnd("RE")
        const jobs = [];
        var MAX_WORKERS = Math.floor(parseInt(document.getElementById("worker").value, 10));
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 4 }
        console.log("threads:" + MAX_WORKERS);
        for (let i = 0; i <= MAX_WORKERS - 1; i++) {
            const worker = new Worker(URL.createObjectURL(b));
            const promise = new Promise((resolve, reject) => {
                worker.addEventListener('message', (msg) => {
                    if (msg.data == true) {
                        reject()
                    } else {
                        resolve(msg.data)
                    }
                    worker.terminate();
                });
            });

            jobs.push(promise);
            worker.postMessage({ num: num, p: i, mx: MAX_WORKERS });
        }
        Promise.any(jobs).then((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${(time_end - time_st)}ミリ秒でした。(${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = "素数ではありません。少なくとも" + r + "で割れます。"
        }).catch((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `計算にかかった時間は${(time_end - time_st)}ミリ秒でした。(${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = lang_data[lang]["isPrime"]
        });
    }
}

function isPrimeBig(num_p) {
    console.log("Big");
    result.innerHTML = lang_data[lang]["TestProgressing"];
    ti.innerHTML = ""
    let worker_js = `function isPrimeNumber_r5(n, id, mx) {
    let [num, threadId, max] = [BigInt(n), Number(id), Number(mx)]
    // n:Number to be determined, id:threadsID, mx:Total number of threads
    let prime = [23n,29n,31n,37n,41n,43n,47n,53n,59n,61n,67n,71n,73n,79n,83n,89n,97n,101n,103n,107n,109n,113n,127n,131n,137n,139n,149n,151n,157n,163n,167n,173n,179n,181n,191n,193n,197n,199n,211n,223n,227n,229n,233n,239n,241n,251n,257n,263n,269n,271n,277n,281n,283n,293n,307n,311n,313n,317n,331n,337n,347n,349n,353n,359n,367n,373n,379n,383n,389n,397n,401n,409n,419n,421n,431n,433n,439n,443n,449n,457n,461n,463n,467n,479n,487n,491n,499n,503n,509n,521n,523n,541n,547n,557n,563n,569n,571n,577n,587n,593n,599n,601n,607n,613n,617n,619n,631n,641n,643n,647n,653n,659n,661n,673n,677n,683n,691n,701n,709n,719n,727n,733n,739n,743n,751n,757n,761n,769n,773n,787n,797n,809n,811n,821n,823n,827n,829n,839n,853n,857n,859n,863n,877n,881n,883n,887n,907n,911n,919n,929n,937n,941n,947n,953n,967n,971n,977n,983n,991n,997n,1009n,1013n,1019n,1021n,1031n,1033n,1039n,1049n,1051n,1061n,1063n,1069n,1087n,1091n,1093n,1097n,1103n,1109n,1117n,1123n,1129n,1151n,1153n,1163n,1171n,1181n,1187n,1193n,1201n,1213n,1217n,1223n,1229n,1231n,1237n,1249n,1259n,1277n,1279n,1283n,1289n,1291n,1297n,1301n,1303n,1307n,1319n,1321n,1327n,1361n,1367n,1373n,1381n,1399n,1409n,1423n,1427n,1429n,1433n,1439n,1447n,1451n,1453n,1459n,1471n,1481n,1483n,1487n,1489n,1493n,1499n,1511n,1523n,1531n,1543n,1549n,1553n,1559n,1567n,1571n,1579n,1583n,1597n,1601n,1607n,1609n,1613n,1619n,1621n,1627n,1637n,1657n,1663n,1667n,1669n,1693n,1697n,1699n,1709n,1721n,1723n,1733n,1741n,1747n,1753n,1759n,1777n,1783n,1787n,1789n,1801n,1811n,1823n,1831n,1847n,1861n,1867n,1871n,1873n,1877n,1879n,1889n,1901n,1907n,1913n,1931n,1933n,1949n,1951n,1973n,1979n,1987n,1993n,1997n,1999n,2003n,2011n,2017n,2027n,2029n,2039n,2053n,2063n,2069n,2081n,2083n,2087n,2089n,2099n,2111n,2113n,2129n,2131n,2137n,2141n,2143n,2153n,2161n,2179n,2203n,2207n,2213n,2221n,2237n,2239n,2243n,2251n,2267n,2269n,2273n,2281n,2287n,2293n,2297n,2309n];
    let prime_d = [1n,13n,17n,19n,23n,29n,31n,37n,41n,43n,47n,53n,59n,61n,67n,71n,73n,79n,83n,89n,97n,101n,103n,107n,109n,113n,127n,131n,137n,139n,149n,151n,157n,163n,167n,169n,173n,179n,181n,191n,193n,197n,199n,211n,221n,223n,227n,229n,233n,239n,241n,247n,251n,257n,263n,269n,271n,277n,281n,283n,289n,293n,299n,307n,311n,313n,317n,323n,331n,337n,347n,349n,353n,359n,361n,367n,373n,377n,379n,383n,389n,391n,397n,401n,403n,409n,419n,421n,431n,433n,437n,439n,443n,449n,457n,461n,463n,467n,479n,481n,487n,491n,493n,499n,503n,509n,521n,523n,527n,529n,533n,541n,547n,551n,557n,559n,563n,569n,571n,577n,587n,589n,593n,599n,601n,607n,611n,613n,617n,619n,629n,631n,641n,643n,647n,653n,659n,661n,667n,673n,677n,683n,689n,691n,697n,701n,703n,709n,713n,719n,727n,731n,733n,739n,743n,751n,757n,761n,767n,769n,773n,779n,787n,793n,797n,799n,809n,811n,817n,821n,823n,827n,829n,839n,841n,851n,853n,857n,859n,863n,871n,877n,881n,883n,887n,893n,899n,901n,907n,911n,919n,923n,929n,937n,941n,943n,947n,949n,953n,961n,967n,971n,977n,983n,989n,991n,997n,1003n,1007n,1009n,1013n,1019n,1021n,1027n,1031n,1033n,1037n,1039n,1049n,1051n,1061n,1063n,1069n,1073n,1079n,1081n,1087n,1091n,1093n,1097n,1103n,1109n,1117n,1121n,1123n,1129n,1139n,1147n,1151n,1153n,1157n,1159n,1163n,1171n,1181n,1187n,1189n,1193n,1201n,1207n,1213n,1217n,1219n,1223n,1229n,1231n,1237n,1241n,1247n,1249n,1259n,1261n,1271n,1273n,1277n,1279n,1283n,1289n,1291n,1297n,1301n,1303n,1307n,1313n,1319n,1321n,1327n,1333n,1339n,1343n,1349n,1357n,1361n,1363n,1367n,1369n,1373n,1381n,1387n,1391n,1399n,1403n,1409n,1411n,1417n,1423n,1427n,1429n,1433n,1439n,1447n,1451n,1453n,1457n,1459n,1469n,1471n,1481n,1483n,1487n,1489n,1493n,1499n,1501n,1511n,1513n,1517n,1523n,1531n,1537n,1541n,1543n,1549n,1553n,1559n,1567n,1571n,1577n,1579n,1583n,1591n,1597n,1601n,1607n,1609n,1613n,1619n,1621n,1627n,1633n,1637n,1643n,1649n,1651n,1657n,1663n,1667n,1669n,1679n,1681n,1691n,1693n,1697n,1699n,1703n,1709n,1711n,1717n,1721n,1723n,1733n,1739n,1741n,1747n,1751n,1753n,1759n,1763n,1769n,1777n,1781n,1783n,1787n,1789n,1801n,1807n,1811n,1817n,1819n,1823n,1829n,1831n,1843n,1847n,1849n,1853n,1861n,1867n,1871n,1873n,1877n,1879n,1889n,1891n,1901n,1907n,1909n,1913n,1919n,1921n,1927n,1931n,1933n,1937n,1943n,1949n,1951n,1957n,1961n,1963n,1973n,1979n,1987n,1993n,1997n,1999n,2003n,2011n,2017n,2021n,2027n,2029n,2033n,2039n,2041n,2047n,2053n,2059n,2063n,2069n,2071n,2077n,2081n,2083n,2087n,2089n,2099n,2111n,2113n,2117n,2119n,2129n,2131n,2137n,2141n,2143n,2147n,2153n,2159n,2161n,2171n,2173n,2179n,2183n,2197n,2201n,2203n,2207n,2209n,2213n,2221n,2227n,2231n,2237n,2239n,2243n,2249n,2251n,2257n,2263n,2267n,2269n,2273n,2279n,2281n,2287n,2291n,2293n,2297n,2309n];
    for (let i = threadId; i < 335; i += max) {
        if (num == prime[i]) { return true }
        if (num % prime[i] == 0n) { return prime[i] }
    };
    for (let u = threadId; u < 480; u += max) {
      for (let l = 2310n; (l + prime_d[u]) * (l + prime_d[u]) <= n; l += 2310n) {
        if (num % (l + prime_d[u]) == 0n) { return (l + prime_d[u]) };
      }
    };
    return true;
}

self.addEventListener('message', (message) => {
    const num = message.data.num;
    const p = message.data.p;
    const mx = message.data.mx
    const isPrime = isPrimeNumber_r5(num, p, mx);
    self.postMessage(isPrime);
});`
    let b = new Blob([worker_js], { type: 'text/javascript' })

    var num = BigInt(num_p)
    if (num <= 1n) {
        result.innerHTML = lang_data[lang]["Over"];
        return false;
    } else if (num.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"];
        return false;
    } else {
        resu1t.innerHTML = `${num.toString().length}桁の自然数${num}は`;
        var time_st = performance.now();
        var prm = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n]
        console.time("RE")
        if (prm.includes(num)) {
            result.innerHTML = lang_data[lang]["isPrime"]
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`)
            ti.innerHTML = `判定時間:${time_end - time_st}ms`
            console.timeEnd("RE")
            return true;
        } else {
            for (let d = 0; d < 7; d++) {
                const el = prm[d];
                if (num % el == 0n) {
                    result.innerHTML = "素数ではありません。少なくとも" + String(el) + "で割り切れます。";
                    var time_end = performance.now();
                    console.log(`${time_end - time_st}ms`)
                    ti.innerHTML = `判定時間:${time_end - time_st}ms`
                    console.timeEnd("RE");
                    return false;
                }
            }
        }
        console.timeEnd("RE")
        const jobs = [];
        var MAX_WORKERS = Math.floor(parseInt(document.getElementById("worker").value, 10));
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 6 }
        console.log("threads:" + MAX_WORKERS);
        result.innerHTML = `判定中...(${MAX_WORKERS}スレッドで計算中)`
        for (let i = 0; i <= MAX_WORKERS - 1; i++) {
            const worker = new Worker(URL.createObjectURL(b));
            const promise = new Promise((resolve, reject) => {
                worker.addEventListener('message', (msg) => {
                    if (msg.data == true) {
                        reject();
                    } else {
                        console.log(msg.data);
                        resolve(msg.data);
                    }
                    worker.terminate();
                });
            });
            jobs.push(promise);
            worker.postMessage({ num: num, p: i, mx: MAX_WORKERS });
        }
        Promise.any(jobs).then((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`);
            console.log(r);
            ti.innerHTML = `判定時間:${(time_end - time_st)}ms (${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = "素数ではありません。少なくとも" + r + "で割れます。"
        }).catch(() => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`);
            console.log(true);
            ti.innerHTML = `判定時間:${(time_end - time_st)}ms (${MAX_WORKERS}スレッドで実行)`
            result.innerHTML = lang_data[lang]["isPrime"]
        });
    }
}

function isPrimeBigG(num_p) {
    console.log("BigF");
    result.innerHTML = lang_data[lang]["Calculating"];
    ti.innerHTML = ""
    let worker_js = `function isPrimeNumber_G5(n, id, mx) {
    let [num, threadId, max] = [BigInt(n), BigInt(id), BigInt(mx)]
    let arr = [];
    // n:Number to be determined, id:threadsID, mx:Total number of threads
    for (let i = 1n + threadId; i * i <= num; i += max) {
        let f = num / i;
        if (f * i == num) {
            arr.push(i,f)
        }
    }
    return arr;
}

self.addEventListener('message', (message) => {
    const num = message.data.num;
    const p = message.data.p;
    const mx = message.data.mx
    const isPrime = isPrimeNumber_G5(num, p, mx);
    self.postMessage(isPrime);
});`
    let b = new Blob([worker_js], { type: 'text/javascript' })

    var num = BigInt(num_p)
    if (num <= 1n) {
        result.innerHTML = lang_data[lang]["Over"];
        console.log("n <= 1");
        return false;
    } else if (num.toString() == "NaN") {
        result.innerHTML = lang_data[lang]["NaN"];
        return false;
    } else {
        MultiLangDisp("G","resu1t",num)
        console.time("Boot")
        var time_st = performance.now();
        const jobs = [];
        var MAX_WORKERS = Math.floor(parseInt(document.getElementById("worker").value, 10));
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 6 }
        console.log("threads:" + MAX_WORKERS);
        for (let i = 0; i <= MAX_WORKERS - 1; i++) {
            const worker = new Worker(URL.createObjectURL(b));
            const promise = new Promise((resolve) => {
                worker.addEventListener('message', (msg) => {
                    resolve(msg.data);
                    worker.terminate();
                });
            });
            jobs.push(promise);
            worker.postMessage({ num: num, p: i, mx: MAX_WORKERS });
        }
        console.timeEnd("Boot");
        MultiLangDisp("G","calculatingMLti",num.toString(),MAX_WORKERS)
        Promise.all(jobs).then((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`);
            console.log(r);
            var h = [];
            for(let g = 0; g < r.length; g++) {
                let k = r[g];
                for (let l = 0; l < k.length; l++) {
                    h.push(k[l])
                }
            }
            console.log(h);
            var he = h.sort((x,y) => Number(x - y));
            console.log(he);
            let hr = he.toString().replace(/,/g,",\n");
            MultiLangDisp("G","END",num,MAX_WORKERS,time_end - time_st,hr);
        });
    }
}


// べき乗の計算を行う関数 (a^b mod m)
function powerMod(a, b, m) {
    let result = BigInt(1);
    a = a % m;

    while (b > 0) {
        if (b % BigInt(2) === BigInt(1)) {
            result = (result * BigInt(a)) % BigInt(m);
        }

        b /= BigInt(2);
        a = (a * a) % m;
    }

    return result;
}

// Miller-Rabin素数判定法の関数
function isProbablePrime(n, k) {
    if (n <= BigInt(1) || n === BigInt(4)) {
        return false;
    }
    if (n <= BigInt(3)) {
        return true;
    }

    let d = n - BigInt(1);
    while (d % BigInt(2) === BigInt(0)) {
        d /= BigInt(2);
    }

    for (let i = 0; i < k; i++) {
        let a = BigInt(2) + BigInt(Math.floor(Math.random() * (Number(n) - 4)));
        let x = powerMod(a, d, n);

        if (x === BigInt(1) || x === n - BigInt(1)) {
            continue;
        }

        let skipLoop = false;
        for (let r = 0; r < Number(d - BigInt(1)); r++) {
            x = (x * x) % n;
            if (x === BigInt(1)) {
                return false;
            }
            if (x === n - BigInt(1)) {
                skipLoop = true;
                break;
            }
        }

        if (!skipLoop) {
            return false;
        }
    }

    return true;
}
  
// primality test by trial division
function isPrimeSlow(n) {
    if (n <= 1n) {
        return false;
    }
    if (n % 2n == 0n) {
        return n == 2n;
    }
    if (n % 3n == 0) {
        return n == 3n;
    }

    for (var i = 5n; i * i <= n; i += 6n) {
        if (n % i == 0n) {
            return false;
        }
        if (n % (i + 2n) == 0n) {
            return false;
        }
    }
    return true;
}

// v_q(t): how many time is t divided by q
function v(q, t) {
    let ans = 0n;
    while (t % q === 0n) {
        ans += 1n;
        t = t / q;
    }
    return ans;
}

function primeFactorize(n) {
    let ret = [];
    let p = 2n;
    while (p * p <= n) {
        if (n % p === 0n) {
            let num = 0n;
            while (n % p === 0n) {
                num += 1n;
                n = n / p;
            }
            ret.push([p, num]);
        }
        p += 1n;
    }
    if (n !== 1n) {
        ret.push([n, 1n]);
    }
    return ret;
}

// calculate e(t)
function e(t) {
    let s = 1n;
    let qList = [];
    for (let q = 2n; q <= t + 1n; q++) {
        if ((t % (q - 1n)) === 0n && isPrimeSlow(q)) {
            s *= (q ** 1n + v(q, t));
            qList.push(q);
        }
    }
    return [2n * s, qList];
}

// Jacobi sum
class JacobiSum {
    constructor(p, k, q) {
        this.p = p;
        this.k = k;
        this.q = q;
        this.m = (p - 1n) * p ** (k - 1n);
        this.pk = p ** k;
        this.coef = new Array(parseInt(this.m)).fill(0n);
    }

    // 1
    one() {
        this.coef[0] = 1n;
        for (let i = 1n; i < this.m; i++) {
            this.coef[parseInt(i)] = 0n;
        }
        return this;
    }

    // product of new JacobiSum
    // jac : new JacobiSum
    mul(jac) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            for (let j = 0n; j < m; j++) {
                if (positiveMod((i + j), pk) < m) {
                    j_ret.coef[parseInt(positiveMod((i + j), pk))] += this.coef[parseInt(i)] * jac.coef[parseInt(j)];
                } else {
                    let r = positiveMod((i + j), pk) - this.p ** (this.k - 1n);
                    while (r >= 0n) {
                        j_ret.coef[r] -= this.coef[i] * jac.coef[j];
                        r -= this.p ** (this.k - 1n);
                    }
                }
            }
        }
        return j_ret;
    }

    multiply(right) {
        if (typeof right === 'number' || typeof right === "bigint") {
            // product with integer
            const j_ret = new JacobiSum(this.p, this.k, this.q);
            for (let i = 0n; i < this.m; i++) {
                j_ret.coef[i] = this.coef[i] * right;
            }
            return j_ret;
        } else {
            // product with new JacobiSum
            return this.mul(right);
        }
    }

    // power of new JacobiSum (x-th power mod n)
    modpow(x, n) {
        let j_ret = new JacobiSum(this.p, this.k, this.q);
        j_ret.coef[0] = 1n;
        let j_a = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        while (x > 0n) {
            if (x % 2n === 1n) {
                j_ret = j_ret.multiply(j_a)
                j_ret = j_ret.mod(n);
            }
            j_a = j_a.multiply(j_a)
            j_a = j_a.mod(n);
            x = x / 2n;
        }

        return j_ret;
    }

    // applying "mod n" to coefficient of self
    mod(n) {
        for (let i = 0n; i < this.m; i++) {
            this.coef[i] = positiveMod(this.coef[i], n);
        }
        return this;
    }

    // operate sigma_x
    // verification for sigma_inv
    sigma(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            if (positiveMod((i * x), pk) < m) {
                j_ret.coef[positiveMod((i * x), pk)] += this.coef[i];
            } else {
                let r = positiveMod((i * x), pk) - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    j_ret.coef[r] -= this.coef[i];
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // operate sigma_x^(-1)
    sigma_inv(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < pk; i++) {
            if (i < m) {
                if (positiveMod((i * x), pk) < m) {
                    j_ret.coef[Number(String(i))] += this.coef[Number(String(positiveMod((i * x), pk)))];
                }
            } else {
                let r = i - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    if (positiveMod((i * x), pk) < m) {
                        j_ret.coef[r] -= this.coef[positiveMod((i * x), pk)];
                    }
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // Is self p^k-th root of unity (mod N)
    // if so, return h where self is zeta^h
    is_root_of_unity(N) {
        const m = this.m;
        const p = this.p;
        const k = this.k;

        // case of zeta^h (h<m)
        let one = 0n;
        let h;
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] === 1n) {
                one += 1n;
                h = i;
            } else if (this.coef[i] === 0n) {
                continue;
            } else if ((this.coef[i] - (-1n)) % N != 0n) {
                return [false, null];
            }
        }
        if (one == 1n) {
            return [true, h];
        }
        let r;
        // case of zeta^h (h>=m)
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] !== 0n) {
                r = positiveMod(i, (p ** (k - 1n)));
                break;
            }
        }
        for (let i = 0n; i < m; i++) {
            if (positiveMod(i, (p ** (k - 1n))) === r) {
                if ((this.coef[i] - (-1n)) % N !== 0n) {
                    return [false, null];
                }
            } else {
                if (this.coef[i] !== 0n) {
                    return [false, null];
                }
            }
        }

        return [true, (p - 1n) * p ** (k - 1n) + r];
    }
}

// find primitive root
function smallestPrimitiveRoot(q) {
    for (let r = 2n; r < q; r++) {
        let s = new Set();
        let m = 1n;
        for (let i = 1n; i < q; i++) {
            m = (m * r) % q;
            s.add(m);
        }
        if (s.size === parseInt(q - 1n)) {
            return r;
        }
    }
    return null; // error
}

// calculate f_q(x)
function calcF(q) {
    let g = smallestPrimitiveRoot(q);
    let m = {};
    for (let x = 1n; x < q - 1n; x++) {
        m[parseInt(modpow(g, x, q))] = x;
    }
    let f = {};
    for (let x = 1n; x < q - 1n; x++) {
        f[parseInt(x)] = m[parseInt(positiveMod((1n - modpow(g, x, q)), q))];
    }
    return f;
}

// sum zeta^(a*x+b*f(x))
function calcJAb(p, k, q, a, b) {
    let jRet = new JacobiSum(p, k, q);
    let f = calcF(q);
    for (let x = 1n; x < q - 1n; x++) {
        let pk = p ** k;
        if (positiveMod((a * x + b * f[parseInt(x)]), pk) < jRet.m) {
            jRet.coef[positiveMod((a * x + b * f[Number(String(x))]), pk)]++;
        } else {
            let r = positiveMod((a * x + b * f[Number(String(x))]), pk) - (p ** (k - 1n));
            while (r >= 0n) {
                jRet.coef[r]--;
                r -= (p ** (k - 1n));
            }
        }
    }
    return jRet;
}

// calculate J(p,q)ï¼p>=3 or p,q=2,2ï¼
function calcJ(p, k, q) {
    return calcJAb(p, k, q, 1n, 1n);
}

// calculate J_3(q)ï¼p=2 and k>=3ï¼
function calcJ3(p, k, q) {
    let j2q = calcJ(p, k, q);
    let j21 = calcJAb(p, k, q, 2n, 1n);
    let jRet = j2q.multiply(j21);
    return jRet;
}

// calculate J_2(q)ï¼p=2 and k>=3ï¼
function calcJ2(p, k, q) {
    let j31 = calcJAb(2n, 3n, q, 3n, 1n);
    let jConv = new JacobiSum(p, k, q);
    for (let i = 0n; i < j31.m; i++) {
        jConv.coef[i * ((p ** k) / 8n)] = j31.coef[i];
    }
    let jRet = jConv.multiply(jConv);
    return jRet;
}

// in case of p>=3
function APRtestStep4a(p, k, q, N) {
    let J = calcJ(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1.mod(N);
    }

    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);

    // J^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha.mod(N);
    }

    // S = s2 * J_alpha
    let S = s2.multiply(JAalpha).mod(N);

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite!
        return [false, null];
    } else {
        // possible prime
        let lp = h % p !== 0n ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k>=3
function APRtestStep4b(p, k, q, N) {

    let J = calcJ3(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J3^Theta
    // J3^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1 = s1.mod(N);
    }


    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);



    // J3^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha = JAalpha.mod(N);
    }
    // S = s2 * J_alpha * J2^delta
    let S;
    if (N % 8n == 1n || N % 8n == 3n) {
        S = s2.multiply(JAalpha)
        S = S.mod(N);
    } else {
        let J2Delta = calcJ2(p, k, q);
        S = s2.multiply(JAalpha)
        S = S.multiply(J2Delta)
        S = S.mod(N);
    }
    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let lp = (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k=2
function APRtest_step4c(p, k, q, N) {
    let J2q = calcJ(p, k, q);

    // s1 = J(2,q)^2 * q (mod N)
    let s1 = J2q.multiply(J2q).multiply(q).mod(N);
    // s2 = s1 ^ (N/4)
    let s2 = s1.modpow(N / 4n, N);
    let S;
    if (positiveMod(N, 4n) === 1n) {
        S = s2;
    } else if (positiveMod(N, 4n) === 3n) {
        S = (s2.multiply(J2q).multiply(J2q)).mod(N);
    }

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let l_p;
        if (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) {
            l_p = 1n;
        } else {
            l_p = 0n;
        }
        return [true, l_p];
    }
}

// in case of p=2 and k=1
function APRtest_step4d(p, k, q, N) {
    let S2q = modpow(-q, (N - 1n) / 2n, N);
    if ((S2q - 1n) % N !== 0n && (S2q + 1n) % N !== 0n) {
        // composite
        return [false, null];
    } else {
        let l_pp;
        // possible prime
        if ((S2q + 1n) % N === 0n && (N - 1n) % 4n === 0n) {
            l_pp = 1n;
        } else {
            l_pp = 0n;
        }
        return [true, l_pp];
    }
}

// Step 4
function APRtest_step4(p, k, q, N) {
    let result;
    let l_p;
    if (p >= 3n) {
        [result, l_p] = APRtestStep4a(p, k, q, N);
    } else if (p === 2n && k >= 3n) {
        [result, l_p] = APRtestStep4b(p, k, q, N);
    } else if (p === 2n && k === 2n) {
        [result, l_p] = APRtest_step4c(p, k, q, N);
    } else if (p === 2n && k === 1n) {
        [result, l_p] = APRtest_step4d(p, k, q, N);
    }

    return [result, l_p];
}

// Helper functions
const modpow = (base, exponent, mod) => {
    base = BigInt(base);
    exponent = BigInt(exponent);
    mod = BigInt(mod);
    //-------------------
    let ret = 1n;
    base = base % mod;
    while (exponent) {
        if (exponent & 1n) {
            ret = (ret * base) % mod
        };
        base = (base ** 2n) % mod
        exponent = exponent >> 1n;
    }
    return ret;
};

function positiveMod(n, m) {
    return ((n % m) + m) % m;
}

function is_root_of_unity(S, N) {
    let h = 1;
    while (true) {
        if (modpow(S, h, N) === 1) {
            return [true, h];
        }
        h++;
        if (h > N) {
            return [false, null];
        }
    }
}

const gcd = function () {
    var f = (a, b) => b ? f(b, a % b) : a;
    var ans = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        ans = f(ans, arguments[i]);
    }
    return ans;
}

function APRtest(N) {
    const t_list = [
        2n, 12n, 60n, 180n, 840n, 1260n, 1680n, 2520n, 5040n, 15120n, 55440n, 110880n, 720720n,
        1441440n, 4324320n, 24504480n, 73513440n
    ];

    if (N == 2n || N == 3n) {
        return true;
    }

    if (N <= 3n) {
        return false;
    }
    let t;
    let et;
    let q_list;
    // Select t
    for (let tsk of t_list) {
        const [ett, q_l] = e(tsk);
        if (N < ett * ett) {
            t = tsk;
            et = ett;
            q_list = q_l;
            break;
        }
    }

    // Step 1
    const g = gcd(t * et, N);
    if (g > 1n) {
        return false;
    }

    // Step 2
    const l = {};
    const fac_t = primeFactorize(t);
    for (let [p, k] of fac_t) {
        if (p >= 3n && modpow(N, p - 1n, p * p) !== 1n) {
            l[p] = 1n;
        } else {
            l[p] = 0n;
        }
    }

    // Step 3 & Step 4
    for (let q of q_list) {
        if (q === 2n) {
            continue;
        }
        const fac = primeFactorize(q - 1n);
        for (let [p, k] of fac) {
            // Step 4
            const [result, l_p] = APRtest_step4(p, k, q, N);
            if (!result) {
                // composite
                return false;
            } else if (l_p === 1n) {
                l[p] = 1n;
            }
        }
    }

    // Step 5
    for (let [p, value] of Object.entries(l)) {
        p = BigInt(p)
        if (value === 0n) {
            // try other pair of (p,q)
            let count = 0;
            let i = 1n;
            let found = false;
            // try maximum 30 times
            while (count < 30) {
                const q = p * i + 1n;
                if (N % q !== 0 && isPrimeSlow(q) && !q_list.includes(q)) {
                    count += 1;
                    const k = v(p, q - 1n);
                    // Step 4
                    const [result, l_p] = APRtest_step4(p, k, q, N);
                    if (!result) {
                        // composite
                        return false;
                    } else if (l_p === 1n) {
                        found = true;
                        break;
                    }
                }
                i += 1n;
            }
            if (!found) {
                return false;
            }
        }
    }

    // Step 6
    let r = 1;
    for (let t = 0; t < t - 1; t++) {
        r = (r * N) % et;
        if (r !== 1 && r !== N && N % r === 0) {
            return false;
        }
    }
    return true;
}

function isPerfectPower(n) {
    var s = Math.log2(n) + 1;
    for (let b = 2; b <= s; b++) {
        if (Number.isInteger(n ** (1 / b))) return true;
    }
    return false;
}

function enoughOrderModulo(n) {
    const a = Math.floor(Math.log(n) ** 2);
    for (let r = 1; r < n; r++) {
        let order = 0;
        let prod = 1;
        for (let e = 1; e < r; e++) {
            prod = (prod * n) % r;
            if (prod === 1) {
                order = e;
                break;
            }
        }
        if (order > a) {
            return r;
        }
    }
    return n;
}

function tortient(r) {
    function primes(r) {
        let n = r;
        const res = new Set();
        for (let p = 2; p <= Math.sqrt(r); p++) {
            while (n % p === 0) {
                res.add(p);
                n = n / p;
            }
        }
        return res;
    }

    const ps = primes(r);
    let res = r;
    for (const p of ps) {
        res = res * (p - 1) / p;
    }
    return res;
}

class PolynomialModulo {
    pow(ls, n, r) {
        this.ls = ls;
        this.n = n;
        this.r = r;
        return this._pow(n);
    }

    _pow(m) {
        if (m === 1) return this.ls;
        if (m % 2 === 0) {
            const pls = this._pow(Math.floor(m / 2));
            return this._product(pls, pls);
        } else {
            return this._product(this._pow(m - 1), this._pow(1));
        }
    }

    _product(ls1, ls2) {
        const res = new Array(Math.min(ls1.length + ls2.length - 1, this.r)).fill(0);
        for (let i = 0; i < ls1.length; i++) {
            for (let j = 0; j < ls2.length; j++) {
                res[(i + j) % this.r] += ls1[i] * ls2[j];
            }
        }
        for (let k = res.length - 1; k >= 0; k--) {
            res[k] %= this.n;
            if (k === res.length - 1 && res[k] === 0) res.pop();
        }
        return res;
    }
}

function isCongruent(a, n, r) {
    const p = new PolynomialModulo();
    const ls1 = p.pow([a, 1], n, r);

    const i = n % r;
    const ls2 = new Array(i + 1).fill(0);
    ls2[0] = a % n;
    ls2[i] = 1;

    return JSON.stringify(ls1) === JSON.stringify(ls2);
}

function isPrimeAKS(n) {
    if (n === 1) return false;

    // Step 1
    if (isPerfectPower(n)) return false;

    // Step 2
    const r = enoughOrderModulo(n);

    // Step 3
    for (let a = 2; a < Math.min(r + 1, n); a++) {
        if (n % a === 0) {
            return false;
        }
    }

    // Step 4
    if (n <= r) return true;

    // Step 5
    for (let a = 1; a <= Math.floor(Math.sqrt(tortient(r)) * Math.log(n)) + 1; a++) {
        if (!isCongruent(a, n, r)) {
            return false;
        }
    }

    // Step 6
    return true;
}
