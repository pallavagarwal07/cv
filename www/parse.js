/* vim: set nowrap mouse=a: */
var obj = {};
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function LoadFile(str) {
    str = Base64.decode(str);
    var lines = str.split("\n");
    var root = new node(null, 'Curriculum Vitae', 'Root');
    var flag = 0;
    for(var i=0; i < lines.length; i++)
    {
        var out = stringParse(lines[i].outs());
        var ins = stringParse(lines[i].ins());
        var level = getPushLevel(out, flag);
        var cur = root;
        for(var j=0; j<level; j++)
            cur = cur.children[cur.children.length-1];
        if(out && out.match(/section/))
        {
            var newNode = new node(cur, ins, out);
            cur.children.push(newNode);
            flag = level + 1;
        }
        else
            cur.data.push(stringParse(lines[i]));
    }
    print(root, 0);
    printChildrenNames(root.children[6]);
}

var node = function(pNode, name, type){
    this.pNode = pNode;
    this.name = name;
    this.type = type;
    this.children = [];
    this.data = [];
}

function printChildrenNames(node)
{
    var arr = [];
    for(var i=0; i<node.data.length; i++)
        if(node.data[i])
        {
            if(typeof(node.data[i]) == 'string')
                arr.push([node.data[i]]);
            else
                arr.push(node.data[i]);
        }

    for(var i=0; i<node.children.length; i++)
        if(node.children[i].name)
        {
            if(typeof(node.children[i].name) == 'string')
                arr.push([node.children[i].name]);
            else
                arr.push(node.children[i].name);
        }
    if(arr)
        arr = tabular(arr);
    for(var i=0; i<arr.length; i++)
        write(arr[i]);
}

function tabular(arr)
{
    var maxele = 0;
    for(var i=0; i<arr.length; i++)
    {
        if(arr[i][0].length > 60)
        {
            var j = 59;
            while(j>=0 && arr[i][0][j] != ' ')
                j--;
            var str = ["__" + arr[i][0].substring(j+1)];
            arr[i][0] = arr[i][0].substring(0, j);
            arr.splice(i+1, 0, str);
        }
    }
    for(var i=0; i<arr.length; i++)
        maxele = Math.max(maxele, arr.length);
    for(var j=0; j<maxele-1; j++)
    {
        var maxlen = 0;
        for(var i=0; i<arr.length; i++)
            maxlen = Math.max(maxlen, (arr[i][j] || []).length);
        for(var i=0; i<arr.length; i++)
            if(arr[i][j])
                arr[i][j] += Array(maxlen-arr[i][j].length + 3).join(".");
    }
    for(var i=0; i<arr.length; i++)
        arr[i] = arr[i].join(" ");
    return arr;
}

function stringParse(str)
{
    if(!str)
        return str;

    str = str.trim();
    str = str.replace('section*', 'section');

    if(str.match(/\\hfill/))
    {
        arr = str.split('\\hfill');
        for(var i=0; i<arr.length; i++)
            arr[i] = stringParse(arr[i]);
        return arr;
    }
    str = str.replace('\\LaTeX', 'LaTeX');
    str = str.replace('$11^{th}$', '11th');
    str = str.replace('\\\\', '');
    str = str.replace('\\item', '\u25a0');
    str = convert(str, 'small', '');
    str = convert(str, 'large', '##');
    str = convert(str, 'huge', '##');
    str = convert(str, 'textit', '#');
    str = convert(str, 'textbf', '##');

    if(str.match(/^\\[a-z]+/))
        return null;

    return str
}

function convert(str, token, repl)
{
    var index = str.indexOf('\\'+token+'{');
    var start = index;
    if(index == -1)
        return str;
    index += token.length + 2;
    var bracks = 1;
    while(bracks > 0 && index < str.length)
    {
        if(str[index] == '{')
            bracks++;
        if(str[index] == '}')
            bracks--;
        index++;
    }
    str = str.substring(0, start) + repl +
        str.substring(start + 2 + token.length, index-1) + repl + str.substring(index);
    return str;
}

function print(nNode, level)
{
    write(nNode.type + ": " + nNode.name);
    write('<text'+String(level)+' style="padding-left:'+String(level*30)+'px; display:block;">')
    write("-------------------------------------");
    for(var str in nNode.data)
        write(nNode.data[str]);
    write("-------------------------------------");
    for(var i=0; i<nNode.children.length; i++)
    {
        print(nNode.children[i], level+1);
    }
    write('</text'+String(level)+'>')
}

function write(str)
{
    if(str != null)
        document.write(str + "<br />");
}

function getPushLevel(out, flag)
{
    if(!out)
        return flag;
    else if(!out.match(/section/))
        return flag;
    else
        return (out.match(/sub/g)||[]).length;

}

String.prototype.ins = function(){
    var regx = /^\s*\\.*?\{(.*)\}\s*$/;
    match = regx.exec(this);
    if(match == null)
        return null;
    else
        return match[1].trim();
}

String.prototype.outs = function(){
    var regx = /^\s*\\(.*?)\{.*\}\s*$/;
    match = regx.exec(this);
    if(match == null)
        return null;
    else
        return match[1].trim();
}

