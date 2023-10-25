if(typeof keyman === 'undefined') {console.log('Keyboard requires KeymanWeb 10.0 or later');if(typeof tavultesoft !== 'undefined') tavultesoft.keymanweb.util.alert("This keyboard requires KeymanWeb 10.0 or later");} else {KeymanWeb.KR(new Keyboard_diacritic_rota());}function Keyboard_diacritic_rota(){this._v=(typeof keyman!="undefined"&&typeof keyman.version=="string")?parseInt(keyman.version,10):9;this.KI="Keyboard_diacritic_rota";this.KN="Diacritic 10-key Rota";this.KMINVER="14.0";this.KV={F:' 1em "Arial"',K102:0};this.KV.KLS={};this.KV.BK=(function(x){var e=Array.apply(null,Array(65)).map(String.prototype.valueOf,""),r=[],v,i,m=['default','shift','ctrl','shift-ctrl','alt','shift-alt','ctrl-alt','shift-ctrl-alt'];for(i=m.length-1;i>=0;i--)if((v=x[m[i]])||r.length)r=(v?v:e).slice().concat(r);return r})(this.KV.KLS);this.KDU=0;this.KH='';this.KM=0;this.KBVER="1.0";this.KMBM=0x0010;this.KVKD="T_DK_DIA_GRAVE T_DK_DIA_ACUTE T_DK_DIA_CIRCUM";this.KVKL={"phone":{"font":"Tahoma","displayUnderlying":false,"layer":[{"id":"default","row":[{"id":"1","key":[{"id":"K_7","text":"7"},{"id":"K_8","text":"8","hint":"abc","multitap":[{"id":"K_A","text":"a"},{"id":"K_B","text":"b"},{"id":"K_C","text":"c"},{"nextlayer":"shift","layer":"shift","id":"K_A","text":"A"},{"nextlayer":"shift","layer":"shift","id":"K_B","text":"B"},{"nextlayer":"shift","layer":"shift","id":"K_C","text":"C"}]},{"id":"K_9","text":"9","hint":"def","multitap":[{"id":"K_D","text":"d"},{"id":"K_E","text":"e"},{"id":"K_F","text":"f"},{"nextlayer":"shift","layer":"shift","id":"K_D","text":"D"},{"nextlayer":"shift","layer":"shift","id":"K_E","text":"E"},{"nextlayer":"shift","layer":"shift","id":"K_F","text":"F"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"2","key":[{"id":"K_4","text":"4","hint":"ghi","multitap":[{"id":"K_G","text":"g"},{"id":"K_H","text":"h"},{"id":"K_I","text":"i"},{"nextlayer":"shift","layer":"shift","id":"K_G","text":"G"},{"nextlayer":"shift","layer":"shift","id":"K_H","text":"H"},{"nextlayer":"shift","layer":"shift","id":"K_I","text":"I"}]},{"id":"K_5","text":"5","hint":"jkl","multitap":[{"id":"K_J","text":"j"},{"id":"K_K","text":"k"},{"id":"K_L","text":"l"},{"nextlayer":"shift","layer":"shift","id":"K_J","text":"J"},{"nextlayer":"shift","layer":"shift","id":"K_K","text":"K"},{"nextlayer":"shift","layer":"shift","id":"K_L","text":"L"}]},{"id":"K_6","text":"6","hint":"mno","multitap":[{"id":"K_M","text":"m"},{"id":"K_N","text":"n"},{"id":"K_O","text":"o"},{"nextlayer":"shift","layer":"shift","id":"K_M","text":"M"},{"nextlayer":"shift","layer":"shift","id":"K_N","text":"N"},{"nextlayer":"shift","layer":"shift","id":"K_O","text":"O"}]},{"id":"T_DK_DIA_GRAVE","text":"\u25CC\u0300","multitap":[{"id":"T_DK_DIA_ACUTE","text":"\u25CC\u0301"},{"id":"T_DK_DIA_CIRCUM","text":"\u25CC\u0302"}]}]},{"id":"3","key":[{"id":"K_1","text":"1","hint":"pqrs","multitap":[{"id":"K_P","text":"p"},{"id":"K_Q","text":"q"},{"id":"K_R","text":"r"},{"id":"K_S","text":"s"},{"nextlayer":"shift","layer":"shift","id":"K_P","text":"P"},{"nextlayer":"shift","layer":"shift","id":"K_Q","text":"Q"},{"nextlayer":"shift","layer":"shift","id":"K_R","text":"R"},{"nextlayer":"shift","layer":"shift","id":"K_S","text":"S"}]},{"id":"K_2","text":"2","hint":"tuv","multitap":[{"id":"K_T","text":"t"},{"id":"K_U","text":"u"},{"id":"K_V","text":"v"},{"nextlayer":"shift","layer":"shift","id":"K_T","text":"T"},{"nextlayer":"shift","layer":"shift","id":"K_U","text":"U"},{"nextlayer":"shift","layer":"shift","id":"K_V","text":"V"}]},{"id":"K_3","text":"3","hint":"wxyz","multitap":[{"id":"K_W","text":"w"},{"id":"K_X","text":"x"},{"id":"K_Y","text":"y"},{"id":"K_Z","text":"z"},{"nextlayer":"shift","layer":"shift","id":"K_W","text":"W"},{"nextlayer":"shift","layer":"shift","id":"K_X","text":"X"},{"nextlayer":"shift","layer":"shift","id":"K_Y","text":"Y"},{"nextlayer":"shift","layer":"shift","id":"K_Z","text":"Z"}]},{"width":"100","id":"K_ENTER","sp":"1","text":"*Enter*"}]},{"id":"4","key":[{"nextlayer":"shift","width":"100","id":"K_SHIFT","sp":"1","text":"*Shift*"},{"id":"K_0","text":"0"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"id":"U_0021"},{"id":"U_003F"},{"id":"U_0027"},{"id":"U_0022"},{"id":"U_005C"},{"id":"U_003A"},{"id":"U_003B"}]},{"id":"T_BLANK","sp":"10"}]},{"id":"5","key":[{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"250","id":"K_SPACE"}]}]},{"id":"shift","row":[{"id":"1","key":[{"layer":"default","id":"K_7","text":"7"},{"layer":"default","id":"K_8","text":"8","hint":"ABC","multitap":[{"id":"K_A","text":"A"},{"id":"K_B","text":"B"},{"id":"K_C","text":"C"},{"nextlayer":"default","layer":"default","id":"K_A","text":"a"},{"nextlayer":"default","layer":"default","id":"K_B","text":"b"},{"nextlayer":"default","layer":"default","id":"K_C","text":"c"}]},{"layer":"default","id":"K_9","text":"9","hint":"DEF","multitap":[{"id":"K_D","text":"D"},{"id":"K_E","text":"E"},{"id":"K_F","text":"F"},{"nextlayer":"default","layer":"default","id":"K_D","text":"d"},{"nextlayer":"default","layer":"default","id":"K_E","text":"e"},{"nextlayer":"default","layer":"default","id":"K_F","text":"f"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"2","key":[{"layer":"default","id":"K_4","text":"4","hint":"GHI","multitap":[{"id":"K_G","text":"G"},{"id":"K_H","text":"H"},{"id":"K_I","text":"I"},{"nextlayer":"default","layer":"default","id":"K_G","text":"g"},{"nextlayer":"default","layer":"default","id":"K_H","text":"h"},{"nextlayer":"default","layer":"default","id":"K_I","text":"i"}]},{"layer":"default","id":"K_5","text":"5","hint":"JKL","multitap":[{"id":"K_J","text":"J"},{"id":"K_K","text":"K"},{"id":"K_L","text":"L"},{"nextlayer":"default","layer":"default","id":"K_J","text":"j"},{"nextlayer":"default","layer":"default","id":"K_K","text":"k"},{"nextlayer":"default","layer":"default","id":"K_L","text":"l"}]},{"layer":"default","id":"K_6","text":"6","hint":"MNO","multitap":[{"id":"K_M","text":"M"},{"id":"K_N","text":"N"},{"id":"K_O","text":"O"},{"nextlayer":"default","layer":"default","id":"K_M","text":"m"},{"nextlayer":"default","layer":"default","id":"K_N","text":"n"},{"nextlayer":"default","layer":"default","id":"K_O","text":"o"}]},{"id":"T_DK_DIA_GRAVE","text":"\u25CC\u0300","multitap":[{"id":"T_DK_DIA_ACUTE","text":"\u25CC\u0301"},{"id":"T_DK_DIA_CIRCUM","text":"\u25CC\u0302"}]}]},{"id":"3","key":[{"layer":"default","id":"K_1","text":"1","hint":"PQRS","multitap":[{"id":"K_P","text":"P"},{"id":"K_Q","text":"Q"},{"id":"K_R","text":"R"},{"id":"K_S","text":"S"},{"nextlayer":"default","layer":"default","id":"K_P","text":"p"},{"nextlayer":"default","layer":"default","id":"K_Q","text":"q"},{"nextlayer":"default","layer":"default","id":"K_R","text":"r"},{"nextlayer":"default","layer":"default","id":"K_S","text":"s"}]},{"layer":"default","id":"K_2","text":"2","hint":"TUV","multitap":[{"id":"K_T","text":"T"},{"id":"K_U","text":"U"},{"id":"K_V","text":"V"},{"nextlayer":"default","layer":"default","id":"K_T","text":"t"},{"nextlayer":"default","layer":"default","id":"K_U","text":"u"},{"nextlayer":"default","layer":"default","id":"K_V","text":"v"}]},{"layer":"default","id":"K_3","text":"3","hint":"WXYZ","multitap":[{"id":"K_W","text":"W"},{"id":"K_X","text":"X"},{"id":"K_Y","text":"Y"},{"id":"K_Z","text":"Z"},{"nextlayer":"default","layer":"default","id":"K_W","text":"w"},{"nextlayer":"default","layer":"default","id":"K_X","text":"x"},{"nextlayer":"default","layer":"default","id":"K_Y","text":"y"},{"nextlayer":"default","layer":"default","id":"K_Z","text":"z"}]},{"width":"100","id":"K_ENTER","sp":"1","text":"*Enter*"}]},{"id":"4","key":[{"nextlayer":"default","width":"100","id":"K_SHIFT","sp":"1","text":"*Shift*"},{"id":"K_0","text":"0"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"id":"U_0021"},{"id":"U_003F"},{"id":"U_0027"},{"id":"U_0022"},{"id":"U_005C"},{"id":"U_003A"},{"id":"U_003B"}]},{"id":"T_BLANK","sp":"10"}]},{"id":"5","key":[{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"250","id":"K_SPACE"}]}]}]}};this.s11=['','','','','','','','','','','','','','','','','','','','','','','','','',''];this.s12=['','','','','','','','','','','','','','','','','','','','','','','','','',''];this.s13="abcdefghijklmnopqrstuvwxyz";this.s14="ABCDEFGHIJKLMNOPQRSTUVWXYZ";this.s15="àbcdèfghìjklmǹòpqrstùvẁxỳz";this.s16="ÀBCDÈFGHÌJKLMǸÒPQRSTÙVẀXỲZ";this.s17="ábćdéfǵhíjḱĺḿńóṕqŕśtúvẃxýź";this.s18="ÁBĆDÉFǴHÍJḰĹḾŃÓṔQŔŚTÚVẂXÝŹ";this.s19="âbĉdêfĝĥîĵklmnôpqrŝtûvŵxŷẑ";this.s20="ÂBĈDÊFĜĤÎĴKLMNÔPQRŜTÛVŴXŶẐ";this.s21="̀́̂";this.s22=[{t:'d',d:0},{t:'d',d:1},{t:'d',d:2}];this.KVER="17.0.185.0";this.KVS=[];this.gs=function(t,e) {return this.g0(t,e);};this.gs=function(t,e) {return this.g0(t,e);};this.g0=function(t,e) {var k=KeymanWeb,r=0,m=0;if(k.KKM(e,16384,256)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"̀");k.KDO(-1,t,0);}}else if(k.KKM(e,16384,257)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"́");k.KDO(-1,t,1);}}else if(k.KKM(e,16384,258)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"̂");k.KDO(-1,t,2);}}else if(k.KKM(e,16400,256)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"̀");k.KDO(-1,t,0);}}else if(k.KKM(e,16400,257)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"́");k.KDO(-1,t,1);}}else if(k.KKM(e,16400,258)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"̂");k.KDO(-1,t,2);}}else if(k.KKM(e,16384,32)) {if(k.KFCM(2,t,[{t:'a',a:this.s21},{t:'a',a:this.s22}])){r=m=1;k.KDC(2,t);k.KO(-1,t," ");}}else if(k.KKM(e,16400,32)) {if(k.KFCM(2,t,[{t:'a',a:this.s21},{t:'a',a:this.s22}])){r=m=1;k.KDC(2,t);k.KO(-1,t," ");}}else if(k.KKM(e,16400,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"A");}}else if(k.KKM(e,16400,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"B");}}else if(k.KKM(e,16400,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"C");}}else if(k.KKM(e,16400,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"D");}}else if(k.KKM(e,16400,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"E");}}else if(k.KKM(e,16400,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"F");}}else if(k.KKM(e,16400,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"G");}}else if(k.KKM(e,16400,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"H");}}else if(k.KKM(e,16400,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"I");}}else if(k.KKM(e,16400,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"J");}}else if(k.KKM(e,16400,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"K");}}else if(k.KKM(e,16400,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"L");}}else if(k.KKM(e,16400,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"M");}}else if(k.KKM(e,16400,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"N");}}else if(k.KKM(e,16400,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"O");}}else if(k.KKM(e,16400,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"P");}}else if(k.KKM(e,16400,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Q");}}else if(k.KKM(e,16400,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"R");}}else if(k.KKM(e,16400,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"S");}}else if(k.KKM(e,16400,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"T");}}else if(k.KKM(e,16400,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"U");}}else if(k.KKM(e,16400,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"V");}}else if(k.KKM(e,16400,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"W");}}else if(k.KKM(e,16400,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"X");}}else if(k.KKM(e,16400,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Y");}}else if(k.KKM(e,16400,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Z");}}else if(k.KKM(e,16384,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"a");}}else if(k.KKM(e,16384,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"b");}}else if(k.KKM(e,16384,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"c");}}else if(k.KKM(e,16384,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"d");}}else if(k.KKM(e,16384,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"e");}}else if(k.KKM(e,16384,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"f");}}else if(k.KKM(e,16384,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"g");}}else if(k.KKM(e,16384,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"h");}}else if(k.KKM(e,16384,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"i");}}else if(k.KKM(e,16384,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"j");}}else if(k.KKM(e,16384,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"k");}}else if(k.KKM(e,16384,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"l");}}else if(k.KKM(e,16384,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"m");}}else if(k.KKM(e,16384,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"n");}}else if(k.KKM(e,16384,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"o");}}else if(k.KKM(e,16384,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"p");}}else if(k.KKM(e,16384,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"q");}}else if(k.KKM(e,16384,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"r");}}else if(k.KKM(e,16384,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"s");}}else if(k.KKM(e,16384,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"t");}}else if(k.KKM(e,16384,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"u");}}else if(k.KKM(e,16384,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"v");}}else if(k.KKM(e,16384,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"w");}}else if(k.KKM(e,16384,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"x");}}else if(k.KKM(e,16384,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"y");}}else if(k.KKM(e,16384,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"z");}}if(m==1) {k.KDC(-1,t);r=this.g1(t,e);m=2;}return r;};this.g1=function(t,e) {var k=KeymanWeb,r=1,m=0;if(k.KFCM(3,t,['̀',{t:'d',d:0},{t:'a',a:this.s13}])){m=1;k.KDC(3,t);k.KIO(-1,this.s15,3,t);}else if(k.KFCM(3,t,['́',{t:'d',d:1},{t:'a',a:this.s13}])){m=1;k.KDC(3,t);k.KIO(-1,this.s17,3,t);}else if(k.KFCM(3,t,['̂',{t:'d',d:2},{t:'a',a:this.s13}])){m=1;k.KDC(3,t);k.KIO(-1,this.s19,3,t);}else if(k.KFCM(3,t,['̀',{t:'d',d:0},{t:'a',a:this.s14}])){m=1;k.KDC(3,t);k.KIO(-1,this.s16,3,t);}else if(k.KFCM(3,t,['́',{t:'d',d:1},{t:'a',a:this.s14}])){m=1;k.KDC(3,t);k.KIO(-1,this.s18,3,t);}else if(k.KFCM(3,t,['̂',{t:'d',d:2},{t:'a',a:this.s14}])){m=1;k.KDC(3,t);k.KIO(-1,this.s20,3,t);}return r;};}