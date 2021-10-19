/*
 copyright (c) 2012-2017 Sergey Gershtein, www.convert-me.com
*/
var uF = {},
    uS = {},
    inv = {},
    aF = {},
    pF = [],
    nF = [],
    vwC = 0,
    vC = {},
    vvC = {},
    jsFunc = {},
    sigDig = 4,
    curField,
    curValue,
    oldValue,
    origValue,
    origField,
    errInp = 0,
    errInpNode = {},
    errInpMark,
    errSubs = 0,
    errSubsMark,
    errSubsNode = {},
    sepDig,
    substhint,
    substempty = 1,
    psuggest,
    psugli,
    psugsi,
    psugopt = [],
    psubst,
    substlv = "~~",
    susugblur = 0,
    susugt,
    setsugt,
    susugset = 0,
    susugready = 0,
    subsact = 0,
    uSh = {},
    wsubst,
    dT,
    ulang = window.navigator.userLanguage || window.navigator.language;
function iF() {
    try {
        for (var a = 0; a < uNames.length; a++) {
            var d = uNames[a].search(/(\([+-]\d+(\.\d+)?\))$/);
            if (0 <= d) {
                var b = uNames[a].substring(d + 1, uNames[a].length - 1);
                uNames[a] = uNames[a].substring(0, d);
                aF[uNames[a]] = parseFloat(b);
            }
            0 <= uNames[a].search(/_1$/) && (inv[uNames[a]] = 1);
        }
        if (0 < uSubs.length) {
            var c = document.getElementById("subsl");
            wsubst = document.getElementById("wsubst");
            var e = document.getElementById("subslex");
            d = 0;
            c && e && wsubst && (e.parentNode.removeChild(e), e.removeAttribute("id"), (d = e.getElementsByTagName("a")), (d = 0 < d.length ? d[0] : 0));
            for (a = 0; a < uSubs.length; a += 2) {
                uS[uSubs[a]] = uSubs[a + 1];
                for (var f = uSubs[a].match(/([^ \.,+-]+)/g), h = 0; h < f.length; h++) {
                    var g = f[h].charAt(0).toLowerCase();
                    uSh[g] || (uSh[g] = []);
                    uSh[g].push(a);
                }
                if (d) {
                    d.innerHTML = uSubs[a];
                    var k = e.cloneNode(!0);
                    k.value = uSubs[a];
                    k.onclick = subsclick;
                    c.appendChild(k);
                }
            }
        }
        for (a = 0; a < uNames.length; a++)
            for (h = a + 1; h < uNames.length; h++) {
                var m = uFactors.shift();
                uF[uNames[a]] || (uF[uNames[a]] = {});
                uF[uNames[h]] || (uF[uNames[h]] = {});
                uF[uNames[a]][uNames[h]] = m;
                uF[uNames[h]][uNames[a]] = 1 / m;
            }
        if ("undefined" !== typeof jsExpr) for (var l in jsExpr) jsFunc[l] = [new Function("x", "return (" + jsExpr[l][0] + ")"), new Function("x", "return (" + jsExpr[l][1] + ")")];
        if ("undefined" !== typeof uChk) for (l in uChk) vC[l] = new Function("x", "return (" + uChk[l][1] + ')?0:"ei-' + uChk[l][0] + '"');
        if ("undefined" !== typeof vChk) for (l in vChk) vvC[l] = new Function("x", "return (" + vChk[l][1] + ')?0:"ei-' + vChk[l][0] + '"');
        if (0 < uFactors.length) throw "uFl";
    } catch (n) {
        alert("Oops. Something went wrong loading conversion factors. Sorry.");
    }
}
function subsclick() {
    psubst && (substempty && ((psubst.className = psubst.className.replace(/ sbox-hint /, " ")), (psubst.className = psubst.className.replace(/(^| )sbox-hint( |$)/, "")), (substempty = 0)), (psubst.value = this.value), sbdoblur());
    wsubst.style.visibility = "hidden";
}
function procKeyDown(a) {
    a || (a = window.event);
    if (a.keyCode) var d = a.keyCode;
    else a.which && (d = a.which);
    return 13 == d ? (curField && (curField.blur(), compit(curField)), !1) : !0;
}
function sotxt(a, d, b) {
    return '<li id="so' + b + '"><a onclick="scl(' + d + ')">' + a + "</a></li>";
}
function sbsetsug() {
    setsugt = 0;
    psugsi = -1;
    if (psuggest && psubst && psugli && !susugready && psubst.value != substlv) {
        substlv = psubst.value;
        var a = 0,
            d = "";
        psugopt = [];
        var b = {};
        if (0 == psubst.value.length) for (var c = 0; c < uSubs.length; c += 2) (d += sotxt(uSubs[c], c, a)), (psugopt[a] = c), a++;
        else {
            var e = psubst.value.charAt(0).toLowerCase();
            if (uSh[e]) {
                var f = psubst.value.replace(/([^a-zA-Z0-9])/g, "\\$1"),
                    h = new RegExp("^" + f, "i");
                for (c = 0; c < uSh[e].length; c++) h.test(uSubs[uSh[e][c]]) && !b[uSh[e][c]] && ((b[uSh[e][c]] = 1), (d += sotxt(uSubs[uSh[e][c]], uSh[e][c], a)), (psugopt[a] = uSh[e][c]), a++);
                h = new RegExp("[ .,+-]" + f, "i");
                for (c = 0; c < uSh[e].length; c++) h.test(uSubs[uSh[e][c]]) && !b[uSh[e][c]] && ((b[uSh[e][c]] = 1), (d += sotxt(uSubs[uSh[e][c]], uSh[e][c], a)), (psugopt[a] = uSh[e][c]), a++);
            }
        }
        0 < a ? clearErrSubs() : setErrSubs("badsubs-add");
        psugli.innerHTML = d;
        susugready = 1;
    }
}
function scl(a) {
    psubst && psuggest && ((psubst.value = uSubs[a]), (substempty = 0));
    sbdoblur();
}
function sbfocus() {
    susugblur && (clearTimeout(susugt), (susugblur = 0));
    substempty && ((psubst.value = ""), (substlv = "z"), (susugready = 0), (psubst.className = psubst.className.replace(/ sbox-hint /, " ")), (psubst.className = psubst.className.replace(/(^| )sbox-hint( |$)/, "")), (substempty = 0));
    psuggest && (susugready || sbsetsug(), (psuggest.style.visibility = "visible"));
    subsact || ((subsact = 1), setTimeout("psubst.select()", 100));
}
function sbblur() {
    psubst && psuggest && psugli && 0 <= psugsi && (sel0(psugsi), (psugsi = -1));
    susugblur && clearTimeout(susugt);
    susugblur = 1;
    susugt = setTimeout("sbdoblur(1)", 100);
}
function sbdoblur(a) {
    psubst && psubst.blur();
    susugblur && clearTimeout(susugt);
    susugblur = 0;
    susugset && (clearTimeout(setsugt), (susugset = 0));
    if (psubst)
        if ("" == psubst.value || substempty) {
            if (a && (!document.activeElement || !/^(input|select|option)$/i.test(document.activeElement.tagName))) {
                psubst.focus();
                return;
            }
            psubst.value = substhint;
            substempty = 1;
            psubst.className += " sbox-hint";
            clearErrSubs();
            vwC = 0;
        } else {
            if ((vwC = uS[psubst.value])) clearErrSubs();
            else if (!a || (document.activeElement && /^(input|select|option)$/i.test(document.activeElement.tagName))) setErrSubs("badsubs-add");
            else {
                psubst.focus();
                return;
            }
            susugready = 0;
            substlv = "";
        }
    psuggest && (psuggest.style.visibility = "hidden");
    subsact = 0;
    origField ? ((origField.value = origValue), compit(origField, 1)) : altQS("", "", psubst.value);
}
function sc(a, d, b) {
    return (a = document.getElementById(a))
        ? ((a.className = d),
          b &&
              psuggest &&
              (a.offsetTop < psuggest.scrollTop
                  ? (psuggest.scrollTop = a.offsetTop)
                  : a.offsetTop + a.offsetHeight > psuggest.scrollTop + psuggest.clientHeight && (psuggest.scrollTop = a.offsetTop + a.offsetHeight - psuggest.clientHeight)),
          1)
        : 0;
}
function sel0(a) {
    return sc("so" + a, "", 0, 0);
}
function sel1(a) {
    return sc("so" + a, "sel", 1);
}
function sbkeydown(a) {
    a || (a = window.event);
    if (a.keyCode) var d = a.keyCode;
    else a.which && (d = a.which);
    switch (d) {
        case 40:
            psubst && psuggest && psugli && (0 <= psugsi && sel0(psugsi), sel1(psugsi + 1) ? psugsi++ : (psugsi = -1));
            break;
        case 38:
            psubst && psuggest && psugli && (0 <= psugsi && sel0(psugsi), 0 > psugsi ? ((psugsi = psugopt.length - 1), sel1(psugsi)) : (0 == psugsi || sel1(psugsi - 1)) && psugsi--);
            break;
        case 13:
        case 9:
            psubst && psuggest && 0 <= psugsi && scl(psugopt[psugsi]);
            sbdoblur();
            break;
        default:
            if ((susugset ? clearTimeout(setsugt) : (susugset = 1), (setsugt = setTimeout("sbsetsug()", 300)), (susugready = 0), 27 == d && psubst)) return (psubst.value = ""), !1;
    }
    return !0;
}
function iI() {
    var a = "";
    cookies = cookies || {};
    for (
        var d = function (a) {
                "focus" === a.type
                    ? (this.addEventListener("mouseup", d, !1), this.addEventListener("keyup", d, !1), (oldValue = this.value), (curField = this))
                    : (this.removeEventListener("mouseup", d, !1), this.removeEventListener("keyup", d, !1));
                try {
                    var b = this.value.length;
                    this.setSelectionRange(b, b);
                    this.scrollLeft = 1e4;
                } catch (k) {}
            },
            b = document.getElementsByTagName("input"),
            c = b.length - 1;
        0 <= c;
        c--
    )
        if ("reset" == b[c].type && "function" != typeof b[c].onclick)
            b[c].onclick = function () {
                clearForm();
                clearErrInp();
                curField = curValue = origField = origValue = "";
                psubst && (clearErrSubs(), (psubst.value = ""), sbdoblur());
                altQS("", "", "");
            };
        else if ("button" == b[c].type && "function" != typeof b[c].onclick)
            b[c].onclick = function () {
                curField && compit(curField, 1);
                runCBC();
            };
        else {
            var e = b[c].attributes.getNamedItem("id");
            e = e ? e.nodeValue : "";
            0 > e.search(/^(u2u)?i_/) ||
                ((e = e.replace(/^(u2u)?i_/, "")),
                uF[e]
                    ? ((b[c].onblur = function () {
                          return compit(this);
                      }),
                      (b[c].onkeydown = procKeyDown),
                      document.addEventListener
                          ? b[c].addEventListener("focus", d, !1)
                          : (b[c].onfocus = function () {
                                oldValue = this.value;
                                curField = this;
                            }),
                      pF.push(b[c]),
                      nF.push(e))
                    : (b[c].parentNode.removeChild(b[c]), (a = a + " " + e)));
        }
    for (var f in uF) (b = document.getElementById("i_" + f)) && "input" != b.type && (pF.push(b), nF.push(f));
    if ((psubst = document.getElementById("isubst")))
        (substhint = psubst.value), (psubst.onfocus = sbfocus), (psubst.onblur = sbblur), (psubst.onkeydown = sbkeydown), (psuggest = document.getElementById("isubsug")), (psugli = document.getElementById("isubli"));
    if ((f = document.getElementById("setSF")))
        if (
            ((f.onchange = function () {
                sigDig = this.value;
                origField && ((origField.value = origValue), compit(origField, 1));
                sC("setSF", sigDig, 3650);
            }),
            cookies.setSF)
        )
            for (b = f.options.length - 1; 0 <= b; b--)
                if (f.options[b].value == cookies.setSF) {
                    sigDig = cookies.setSF;
                    f.selectedIndex = b;
                    break;
                }
    if ((f = document.getElementById("setDS")))
        if (
            ((f.onchange = function () {
                sepDig = this.value;
                origField && ((origField.value = origValue), compit(origField, 1));
                sC("setDS", sepDig, 3650);
            }),
            cookies.setDS)
        )
            for (b = f.options.length - 1; 0 <= b; b--) {
                if (f.options[b].value == cookies.setDS) {
                    f.selectedIndex = b;
                    sepDig = cookies.setDS;
                    break;
                }
            }
        else sepDig = 0 <= ulang.search(/fr|de/) ? "." : 0 <= ulang.search(/^en/) ? "," : " ";
    a && alert("Oops. Some factors not found: " + a);
}
function clearErrInp() {
    errInp &&
        (errInpMark.parentNode.removeChild(errInpMark),
        (errInp.className = errInp.className.replace(/^error( |$)/, "")),
        (errInp.className = errInp.className.replace(/ error$/, "")),
        (errInp.className = errInp.className.replace(/ error /, " ")),
        (errInp = 0));
}
function setErrInp(a, d) {
    if (!errInp) {
        if (!errInpNode[d]) {
            var b = document.getElementById(d);
            if (!b) {
                alert("Oops. Error getting bad input mark");
                return;
            }
            b.parentNode.removeChild(b);
            b.removeAttribute("id");
            errInpNode[d] = b;
        }
        errInpMark = a.parentNode.appendChild(errInpNode[d].cloneNode(!0));
        errInp = a;
        a.className = a.className ? a.className + " error" : "error";
    }
}
function clearErrSubs() {
    errSubs &&
        (errSubsMark.parentNode.removeChild(errSubsMark),
        (errSubs.className = errSubs.className.replace(/^error( |$)/, "")),
        (errSubs.className = errSubs.className.replace(/ error$/, "")),
        (errSubs.className = errSubs.className.replace(/ error /, " ")),
        (errSubs = 0));
}
function setErrSubs(a) {
    errSubs && clearErrSubs();
    if (!errSubsNode[a]) {
        var d = document.getElementById(a);
        if (!d) {
            alert("Oops. Error getting substance mark: " + a);
            return;
        }
        d.parentNode.removeChild(d);
        d.removeAttribute("id");
        errSubsNode[a] = d;
    }
    errSubsMark = psubst.nextSibling ? psubst.parentNode.insertBefore(errSubsNode[a].cloneNode(!0), psubst.nextSibling) : psubst.parentNode.appendChild(errSubsNode[a].cloneNode(!0));
    errSubs = psubst;
    psubst.className = psubst.className ? psubst.className + " error" : "error";
}
function checkNum(a) {
    var d = a.match(/^\s*(-)?\u221e\s*$/);
    if (d) return d[1] ? -Infinity : Infinity;
    a = a.replace(/\u00bd/g, " 1/2 ");
    a = a.replace(/\u00bc/g, " 1/4 ");
    a = a.replace(/\u00be/g, " 3/4 ");
    a = a.replace(/\u2154/g, " 2/3 ");
    a = a.replace(/\u2153/g, " 1/3 ");
    a = a.replace(/\u2155/g, " 1/5 ");
    a = a.replace(/\u2156/g, " 2/5 ");
    a = a.replace(/\u2157/g, " 3/5 ");
    a = a.replace(/\u2158/g, " 4/5 ");
    a = a.replace(/\u2159/g, " 1/6 ");
    a = a.replace(/\u215a/g, " 5/6 ");
    a = a.replace(/\u215b/g, " 1/8 ");
    a = a.replace(/\u215c/g, " 3/8 ");
    a = a.replace(/\u215d/g, " 5/8 ");
    a = a.replace(/\u215e/g, " 7/8 ");
    if ((d = a.match(/^\s*([+-])?(\d*\s+)?(\d+)\/(\d+)\s*$/))) {
        var b = 0;
        d[2] && (b = parseInt(d[2], 10));
        var c = parseInt(d[3], 10),
            e = parseInt(d[4], 10);
        0 < c && 0 < e && (b += c / e);
        "-" == d[1] && (b = -b);
        if (!isNaN(b)) return { v: b };
    }
    a = a.replace(/\s+/g, "");
    if ("" == a) return null;
    0 <= a.search(/^[+-]?0,\d+$/)
        ? (a = a.replace(/,/g, "."))
        : "," != sepDig && 0 <= a.search(/^[+-]?\d+,\d+$/)
        ? (a = a.replace(/,/g, "."))
        : 0 <= a.search(/^[+-]?\d+(,\d{3})+(\.(\d{3},)*\d+)?$/)
        ? (a = a.replace(/,/g, ""))
        : 0 <= a.search(/^[+-]?\d+(\.\d{3})+(,(\d{3}\.)*\d+)?$/) && (0 <= a.search(/,/) || 0 <= a.search(/\.\d+\./)) && ((a = a.replace(/\./g, "")), (a = a.replace(/,/g, ".")));
    a = a.replace(/,/, ".");
    return !isNaN(parseFloat(a)) && isFinite(a) ? { v: parseFloat(a) } : !1;
}
function setUVal(a, d) {
    d += "";
    "INPUT" == a.tagName ? (a.value = d) : "DIV" == a.tagName && (a.innerHTML = d.replace(/e\+?([0-9-]+)/i, "*10<sup>$1</sup>"));
}
function clearForm(a) {
    for (var d = pF.length - 1; 0 <= d; d--) pF[d] != a && setUVal(pF[d], "");
}
function rnbn(a, d) {
    if (!isFinite(a)) return "\u221e";
    if (0 == a) return "0";
    var b = "";
    0 > a && ((b = "-"), (a = -a));
    if (d && 1e-10 > a) return "0";
    var c = Math.floor(Math.log(a) / Math.LN10) - sigDig + 1;
    if (!isFinite(c)) return b + a;
    0 < c && !/e/i.test(a) && (c = 0);
    a = String(Math.round(a / Math.pow(10, c)));
    if (15 < c + a.length - 1) (a += "e+" + (c + a.length - 1)), (a = a.replace(/^([0-9])/, "$1."));
    else if (-15 > c + a.length - 1) (a += "e" + (c + a.length - 1)), (a = a.replace(/^([0-9])/, "$1."));
    else if (0 <= c) for (c; 0 < c; c--) a += "0";
    else if (((c = a.length - -c), 0 < c)) a = a.substr(0, c) + "." + a.substring(c);
    else {
        for (c; 0 > c; c++) a = "0" + a;
        a = "0." + a;
    }
    a = a.replace(/([1-9])0+e/, "$1e");
    a = a.replace(/(\.[0-9]*[1-9])0+$/, "$1");
    a = a.replace(/\.0+$/, "");
    if ("" == sepDig) return b + a;
    c = a.indexOf(".");
    0 > c && (c = a.length);
    for ("." == sepDig && (a = a.replace(/\./, ",")); 0 < (c -= 3); ) "-" != a[c - 1] && (a = a.substring(0, c) + sepDig + a.substring(c));
    return b + a;
}
var n0, v0, s0;
function trackCalc(a, d, b) {
    if (n0 != a || s0 != b || v0 != d) {
        n0 = a;
        s0 = b;
        v0 = d;
        var c = /\/convert\/([^\/]+)(\/.*)?$/.exec(window.location.pathname);
        c = c ? c[1] : "(unknown)";
        try {
            pp_trev("Calculate", c, a + " - " + d + (b ? " (" + b + ")" : "")), pp_trgoal("calculation");
        } catch (e) {}
    }
}
function gUN(a) {
    return (a = document.getElementById("u_" + a)) ? a.innerHTML : "";
}
function pfQS() {
    var a = prsQS();
    (a.u || a.s) && sF(a.u, a.v, a.s);
    if (1 < location.hash.length && (a = document.getElementById(location.hash.substring(1))))
        try {
            (a = a.getElementsByClassName("usystem")) && ptc(a[0], "usystem", "uhid", -1);
        } catch (d) {}
}
function altQS(a, d, b) {
    if ("function" === typeof history.replaceState)
        try {
            if (a || b) {
                history.replaceState({}, "", location.pathname + "?u=" + encodeURIComponent(a) + "&v=" + encodeURIComponent(d) + (b ? "&s=" + encodeURIComponent(b) : "") + location.hash);
                var c = gUN(a) || a;
                document.title = dT + " ** " + (a ? c + ": " + d + (b ? "; " + b : "") : b);
            } else history.replaceState({}, "", location.pathname + location.hash), (document.title = dT);
        } catch (e) {}
}
var swarn1 = 0;
function compit(a, d) {
    a || (a = curField);
    if (a && (a.value !== oldValue || d)) {
        var b = a.name.replace(/^(u2u_)?/, "");
        altQS(b, a.value, psubst && vwC ? psubst.value : "");
        clearErrInp();
        currentValue = a.value;
        if ("" == currentValue) clearForm(a);
        else {
            if (vvC[b]) {
                var c = vvC[b](currentValue);
                if (c) {
                    setErrInp(a, c);
                    clearForm(a);
                    return;
                }
            } else if ((c = checkNum(currentValue))) currentValue = c.v;
            else {
                null != c && setErrInp(a, "badnum-add");
                clearForm(a);
                return;
            }
            if (vC[b] && (c = vC[b](currentValue))) {
                setErrInp(a, c);
                clearForm(a);
                return;
            }
            trackCalc(b, currentValue, psubst && vwC ? psubst.value : "");
            d || ((origField = a), (origValue = currentValue));
            var e = currentValue;
            jsFunc[b] && (e = jsFunc[b][1](e));
            aF[b] && (e -= aF[b]);
            inv[b] && (e = 1 / e);
            var f = 0;
            0 <= b.search(/^[vw]\./) && (f = b.charAt(0));
            for (var h = 0, g = pF.length - 1; 0 <= g; g--)
                if (pF[g] != a) {
                    if (b == nF[g]) var k = currentValue;
                    else {
                        k = e * uF[b][nF[g]];
                        if (0 <= nF[g].search(/^[vw]\./) && nF[g].charAt(0) != f) {
                            if (!vwC) {
                                setUVal(pF[g], "");
                                h = 1;
                                continue;
                            }
                            k = "v" == f ? k * vwC : k / vwC;
                        }
                        inv[nF[g]] && (k = 1 / k);
                        aF[nF[g]] && (k += aF[nF[g]]);
                        jsFunc[nF[g]] && (k = jsFunc[nF[g]][0](k));
                        if (vC[nF[g]] && (c = vC[nF[g]](k))) {
                            setErrInp(a, c);
                            clearForm(a);
                            break;
                        }
                    }
                    setUVal(pF[g], vvC[nF[g]] ? k : rnbn(k, aF[nF[g]]));
                } else a.value = vvC[b] ? currentValue : rnbn(currentValue, aF[b]);
            h && (psubst && 0 == swarn1 && (psubst.focus(), window.scrollBy(0, -70), (swarn1 = 1)), setTimeout("setErrSubs('nosubs-add');", 150));
        }
    }
}
function sF(a, d, b, c) {
    if (!curField || c)
        if (
            (b &&
                psubst &&
                0 < uSubs.length &&
                (substempty && ((psubst.className = psubst.className.replace(/ sbox-hint /, " ")), (psubst.className = psubst.className.replace(/(^| )sbox-hint( |$)/, " ")), (substempty = 0)), (psubst.value = b), sbdoblur()),
            uF[a])
        )
            for (b = 0; b < nF.length; b++)
                if (nF[b] == a) {
                    try {
                        ptc(pF[b], "usystem", "uhid", -1), sIV(pF[b], 50);
                    } catch (e) {}
                    "" == d || void 0 === d ? pF[b].focus() : (setUVal(pF[b], d), (curField = pF[b]), compit(pF[b], 0));
                    break;
                }
}
function prsQS() {
    var a = {},
        d = location.search.substr(1).split("&");
    for (i = d.length - 1; 0 <= i; i--) {
        var b = d[i].split("="),
            c = b.shift();
        if (c)
            try {
                a[decodeURIComponent(c)] = decodeURIComponent(b.join(""));
            } catch (e) {}
    }
    return a;
}
var oCSR = oCSR || [];
function runCSR() {
    if ("undefined" === typeof uSubs) setTimeout("runCSR()", 50);
    else
        for (dT = document.title, iF(), gC(), iI(), pfQS(); 0 < oCSR.length; ) {
            var a = oCSR.shift();
            if ("string" === typeof a) eval(a);
            else
                try {
                    a();
                } catch (d) {}
        }
}
runCSR();
var oCBC = oCBC || [];
function runCBC() {
    for (var a = 0; a < oCBC.length; a++) {
        var d = oCBC[a];
        if ("string" === typeof d) eval(d);
        else
            try {
                d();
            } catch (b) {}
    }
}
