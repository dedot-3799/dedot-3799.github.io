function rand_exec() {
    var time_n = new Date().getTime()
    document.getElementById("random_results_title").style = "display: none;";
    var randoms = [];
    var min = parseInt(document.getElementById("rd_min").value,10)
    var max = parseInt(document.getElementById("rd_max").value,10)
    var co = parseInt(document.getElementById("rd_count").value,10)
    var rm = document.getElementById("rd_remove").value
    var ch = rm.length
    
    var r_c = 0
    if (ch != 0) {
        console.log(rm)
        rw = rm.split(",")
        var r_c = rw.length
        console.log(r_c)
        for (x=0; x <= r_c-1; x++) {
            var nu = rw[x]
            var nu_e = parseInt(nu,10)
            console.log(nu_e)
            randoms.push(nu_e)
        }
    }

	if (co < 1 || isNaN(co) || isNaN(min) || isNaN(max)) {
		document.getElementById("random_results").innerHTML = "Error. (Invalid input.)";
		return;
	}
    

    if (co > max-min+1) {
        document.getElementById("random_results").innerHTML = "Error. (Number of times generated is too many than the range.)"
        return
    }

    const co_ed = co - r_c

    if (co + r_c > max-min+1) {
        document.getElementById("random_results").innerHTML = "Error. (Number of times generated is too many than the range.)"
        return
    }

    for (i = 1; i <= co; i++) {
        while(true) {
            var tmp = intRandom(min,max)
            console.log(tmp)
            if (!randoms.includes(tmp)) {
                randoms.push(tmp);
                break;
            }
        }
    }

    console.log(randoms)
    
    if (ch != 0) {
        console.log("ed")
        randoms.splice(0,r_c)
    }

    var ew = randoms.toString().replace(/,/g ,  (document.getElementById("rd_sp").value || ",")+"\n");

    document.getElementById("random_results").innerHTML = ew
    document.getElementById("random_results_title").style = "display: block;";


    var time_m = new Date().getTime()
    var time_pas = time_m - time_n
    document.getElementById("time_pa_rdm").innerHTML = "生成にかかった時間は"+time_pas+"ミリ秒です。"
}

function intRandom(min, max){
    return Math.floor( Math.random() * (max - min + 1)) + min;
}

function rdm_copy() {
    var t = document.getElementById("random_results").innerHTML;
    copyToClipboard(t.toString().replace(/\n/g,"").replace(/<br>/g,"\n"));
}

function copyToClipboard(tagValue) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(tagValue)
    } else {
        tagText.select()
        document.execCommand('copy')
    }
}