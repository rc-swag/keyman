if(typeof keyman === 'undefined') {console.log('Keyboard requires KeymanWeb 10.0 or later');if(typeof tavultesoft !== 'undefined') tavultesoft.keymanweb.util.alert("This keyboard requires KeymanWeb 10.0 or later");} else {KeymanWeb.KR(new Keyboard_gesture_prototyping());}function Keyboard_gesture_prototyping(){this._v=(typeof keyman!="undefined"&&typeof keyman.version=="string")?parseInt(keyman.version,10):9;this.KI="Keyboard_gesture_prototyping";this.KN="gesture_prototyping";this.KMINVER="14.0";this.KV={F:' 1em "Arial"',K102:0};this.KV.KLS={};this.KV.BK=(function(x){var e=Array.apply(null,Array(65)).map(String.prototype.valueOf,""),r=[],v,i,m=['default','shift','ctrl','shift-ctrl','alt','shift-alt','ctrl-alt','shift-ctrl-alt'];for(i=m.length-1;i>=0;i--)if((v=x[m[i]])||r.length)r=(v?v:e).slice().concat(r);return r})(this.KV.KLS);this.KDU=0;this.KH='';this.KM=0;this.KBVER="1.0";this.KMBM=0x0310;this.KVKL={"phone":{"font":"Tahoma","displayUnderlying":false,"defaultHint":"flick","layer":[{"id":"default","row":[{"id":"1","key":[{"id":"K_Q","text":"q"},{"id":"K_W","text":"w"},{"id":"K_E","text":"e","flick":{"n":{"id":"U_00EA","text":"\u00EA"},"nw":{"id":"U_00E8","text":"\u00E8"},"ne":{"id":"U_00E9","text":"\u00E9"}}},{"id":"K_R","text":"r"},{"id":"K_T","text":"t"},{"id":"K_Y","text":"y","flick":{"n":{"id":"U_0177","text":"\u0177"},"ne":{"id":"U_00FD","text":"\u00FD"}}},{"id":"K_U","text":"u","flick":{"n":{"id":"U_00FB","text":"\u00FB"},"nw":{"id":"U_00F9","text":"\u00F9"},"ne":{"id":"U_00FA","text":"\u00FA"}}},{"id":"K_I","text":"i","flick":{"n":{"id":"U_00EE","text":"\u00EE"},"nw":{"id":"U_00EC","text":"\u00EC"},"ne":{"id":"U_00ED","text":"\u00ED"}}},{"id":"K_O","text":"o","flick":{"n":{"id":"U_00F4","text":"\u00F4"},"nw":{"id":"U_00F2","text":"\u00F2"},"ne":{"id":"U_00F3","text":"\u00F3"}}},{"id":"K_P","text":"p"}]},{"id":"2","key":[{"id":"K_A","pad":"50","text":"a","flick":{"n":{"id":"U_00E2","text":"\u00E2"},"nw":{"id":"U_00E0","text":"\u00E0"},"ne":{"id":"U_00E1","text":"\u00E1"}}},{"id":"K_S","text":"s"},{"id":"K_D","text":"d"},{"id":"K_F","text":"f"},{"id":"K_G","text":"g"},{"id":"K_H","text":"h"},{"id":"K_J","text":"j"},{"id":"K_K","text":"k"},{"id":"K_L","text":"l"},{"width":"10","id":"T_new_414","sp":"10"}]},{"id":"3","key":[{"nextlayer":"shift","id":"K_SHIFT","sp":"1","text":"*Shift*","multitap":[{"nextlayer":"caps","id":"T_new_991","text":"*ShiftLock*"}]},{"id":"K_Z","text":"z"},{"id":"K_X","text":"x"},{"id":"K_C","text":"c"},{"id":"K_V","text":"v"},{"id":"K_B","text":"b"},{"id":"K_N","text":"n"},{"id":"K_M","text":"m"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"id":"K_COLON","text":";"}],"multitap":[{"id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"460","id":"K_SPACE"},{"nextlayer":"accent-acute","id":"T_ACUTE","sp":"1","text":"\u25CC\u0301","hint":"\u25CC\u0300\u25CC\u0302","multitap":[{"nextlayer":"accent-grave","id":"T_GRAVE","sp":"1","text":"\u0300"},{"nextlayer":"circumflex","id":"T_CIRCUMFLEX","sp":"1","text":"\u0302"}]},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"shift","row":[{"id":"1","key":[{"id":"K_Q","text":"Q"},{"id":"K_W","text":"W"},{"id":"K_E","text":"E","flick":{"n":{"id":"U_00CA","text":"\u00CA"},"nw":{"id":"U_00C8","text":"\u00C8"},"ne":{"id":"U_00C9","text":"\u00C9"}}},{"id":"K_R","text":"R"},{"id":"K_T","text":"T"},{"id":"K_Y","text":"Y","flick":{"n":{"id":"U_0176","text":"\u0176"},"ne":{"id":"U_00DD","text":"\u00DD"}}},{"id":"K_U","text":"U","flick":{"n":{"id":"U_00DB","text":"\u00DB"},"nw":{"id":"U_00D9","text":"\u00D9"},"ne":{"id":"U_00DA","text":"\u00DA"}}},{"id":"K_I","text":"I","flick":{"n":{"id":"U_00CE","text":"\u00CE"},"nw":{"id":"U_00CC","text":"\u00CC"},"ne":{"id":"U_00CD","text":"\u00CD"}}},{"id":"K_O","text":"O","flick":{"n":{"id":"U_00D4","text":"\u00D4"},"nw":{"id":"U_00D2","text":"\u00D2"},"ne":{"id":"U_00D3","text":"\u00D3"}}},{"id":"K_P","text":"P"}]},{"id":"2","key":[{"id":"K_A","pad":"50","text":"A","flick":{"n":{"id":"U_00C2","text":"\u00C2"},"nw":{"id":"U_00C0","text":"\u00C0"},"ne":{"id":"U_00C1","text":"\u00C1"}}},{"id":"K_S","text":"S"},{"id":"K_D","text":"D"},{"id":"K_F","text":"F"},{"id":"K_G","text":"G"},{"id":"K_H","text":"H"},{"id":"K_J","text":"J"},{"id":"K_K","text":"K"},{"id":"K_L","text":"L"},{"width":"10","id":"T_new_155","sp":"10"}]},{"id":"3","key":[{"nextlayer":"default","id":"K_SHIFT","sp":"2","text":"*Shift*"},{"id":"K_Z","text":"Z"},{"id":"K_X","text":"X"},{"id":"K_C","text":"C"},{"id":"K_V","text":"V"},{"id":"K_B","text":"B"},{"id":"K_N","text":"N"},{"id":"K_M","text":"M"},{"layer":"default","id":"K_PERIOD","text":".","sk":[{"layer":"default","id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"layer":"default","id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"layer":"default","id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"layer":"default","id":"K_COLON","text":";"}]},{"id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"610","id":"K_SPACE"},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"numeric","row":[{"id":"1","key":[{"id":"K_1","text":"1"},{"id":"K_2","text":"2"},{"id":"K_3","text":"3"},{"id":"K_4","text":"4"},{"id":"K_5","text":"5"},{"id":"K_6","text":"6"},{"id":"K_7","text":"7"},{"id":"K_8","text":"8"},{"id":"K_9","text":"9"},{"id":"K_0","text":"0"}]},{"id":"2","key":[{"layer":"shift","id":"K_4","pad":"50","text":"$"},{"layer":"shift","id":"K_2","text":"@"},{"layer":"shift","id":"K_3","text":"#"},{"layer":"shift","id":"K_5","text":"%"},{"layer":"shift","id":"K_7","text":"&"},{"layer":"shift","id":"K_HYPHEN","text":"_"},{"layer":"default","id":"K_EQUAL","text":"="},{"layer":"shift","id":"K_BKSLASH","text":"|"},{"layer":"default","id":"K_BKSLASH","text":"\\"},{"width":"10","id":"T_new_122","sp":"10"}]},{"id":"3","key":[{"id":"K_LBRKT","pad":"110","text":"[","sk":[{"id":"U_00AB","text":"\u00AB"},{"layer":"shift","id":"K_COMMA","text":"<"},{"layer":"shift","id":"K_LBRKT","text":"{"}]},{"layer":"shift","id":"K_9","text":"("},{"layer":"shift","id":"K_0","text":")"},{"id":"K_RBRKT","text":"]","sk":[{"id":"U_00BB","text":"\u00BB"},{"layer":"shift","id":"K_PERIOD","text":">"},{"layer":"shift","id":"K_RBRKT","text":"}"}]},{"layer":"shift","id":"K_EQUAL","text":"+"},{"id":"K_HYPHEN","text":"-"},{"layer":"shift","id":"K_8","text":"*"},{"id":"K_SLASH","text":"\/"},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"default","width":"150","id":"K_LOWER","sp":"1","text":"*abc*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"610","id":"K_SPACE"},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"caps","row":[{"id":"1","key":[{"id":"K_Q","text":"Q"},{"id":"K_W","text":"W"},{"id":"K_E","text":"E","flick":{"n":{"id":"U_00CA","text":"\u00CA"},"nw":{"id":"U_00C8","text":"\u00C8"},"ne":{"id":"U_00C9","text":"\u00C9"}}},{"id":"K_R","text":"R"},{"id":"K_T","text":"T"},{"id":"K_Y","text":"Y","flick":{"n":{"id":"U_0176","text":"\u0176"},"ne":{"id":"U_00DD","text":"\u00DD"}}},{"id":"K_U","text":"U","flick":{"n":{"id":"U_00DB","text":"\u00DB"},"nw":{"id":"U_00D9","text":"\u00D9"},"ne":{"id":"U_00DA","text":"\u00DA"}}},{"id":"K_I","text":"I","flick":{"n":{"id":"U_00CE","text":"\u00CE"},"nw":{"id":"U_00CC","text":"\u00CC"},"ne":{"id":"U_00CD","text":"\u00CD"}}},{"id":"K_O","text":"O","flick":{"n":{"id":"U_00D4","text":"\u00D4"},"nw":{"id":"U_00D2","text":"\u00D2"},"ne":{"id":"U_00D3","text":"\u00D3"}}},{"id":"K_P","text":"P"}]},{"id":"2","key":[{"id":"K_A","pad":"50","text":"A","flick":{"n":{"id":"U_00C2","text":"\u00C2"},"nw":{"id":"U_00C0","text":"\u00C0"},"ne":{"id":"U_00C1","text":"\u00C1"}}},{"id":"K_S","text":"S"},{"id":"K_D","text":"D"},{"id":"K_F","text":"F"},{"id":"K_G","text":"G"},{"id":"K_H","text":"H"},{"id":"K_J","text":"J"},{"id":"K_K","text":"K"},{"id":"K_L","text":"L"},{"width":"10","id":"T_new_155","sp":"10"}]},{"id":"3","key":[{"nextlayer":"default","id":"K_SHIFT","sp":"2","text":"*ShiftLock*"},{"id":"K_Z","text":"Z"},{"id":"K_X","text":"X"},{"id":"K_C","text":"C"},{"id":"K_V","text":"V"},{"id":"K_B","text":"B"},{"id":"K_N","text":"N"},{"id":"K_M","text":"M"},{"layer":"default","id":"K_PERIOD","text":".","sk":[{"layer":"default","id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"layer":"default","id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"layer":"default","id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"layer":"default","id":"K_COLON","text":";"}]},{"id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"610","id":"K_SPACE"},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"accent-acute","row":[{"id":"1","key":[{"id":"K_Q","text":"q"},{"id":"K_W","text":"w"},{"id":"U_00E9","text":"\u00E9"},{"id":"U_0155","text":"\u0155"},{"id":"K_T","text":"t"},{"id":"U_00FD","text":"\u00FD"},{"id":"U_00FA","text":"\u00FA"},{"id":"U_00ED","text":"\u00ED"},{"id":"U_00F3","text":"\u00F3"},{"id":"K_P","text":"p"}]},{"id":"2","key":[{"id":"U_00E1","pad":"50","text":"\u00E1"},{"id":"U_015B","text":"\u015B"},{"id":"K_D","text":"d"},{"id":"K_F","text":"f"},{"id":"U_01F5","text":"\u01F5"},{"id":"K_H","text":"h"},{"id":"K_J","text":"j"},{"id":"K_K","text":"k"},{"id":"U_013A","text":"\u013A"},{"width":"10","id":"T_new_828","sp":"10"}]},{"id":"3","key":[{"nextlayer":"shift","id":"K_SHIFT","sp":"1","text":"*Shift*","multitap":[{"nextlayer":"caps","id":"T_new_991","text":"*ShiftLock*"}]},{"id":"U_017A","text":"\u017A"},{"id":"K_X","text":"x"},{"id":"U_0107","text":"\u0107"},{"id":"K_V","text":"v"},{"id":"K_B","text":"b"},{"id":"U_0144","text":"\u0144"},{"id":"K_M","text":"m"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"id":"K_COLON","text":";"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"460","id":"K_SPACE"},{"nextlayer":"default","id":"T_DEFAULT","sp":"1","text":"*abc*","multitap":[{"nextlayer":"accent-grave","id":"T_GRAVE","sp":"1","text":"\u0300"},{"nextlayer":"circumflex","id":"T_CIRCUMFLEX","sp":"1","text":"\u0302"}]},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"accent-grave","row":[{"id":"1","key":[{"id":"K_Q","text":"q"},{"id":"K_W","text":"w"},{"id":"U_00E8","text":"\u00E8"},{"id":"K_R","text":"r"},{"id":"K_T","text":"t"},{"id":"K_Y","text":"y"},{"id":"U_00F9","text":"\u00F9"},{"id":"U_00EC","text":"\u00EC"},{"id":"U_00F2","text":"\u00F2"},{"id":"K_P","text":"p"}]},{"id":"2","key":[{"id":"U_00E0","pad":"50","text":"\u00E0"},{"id":"K_S","text":"s"},{"id":"K_D","text":"d"},{"id":"K_F","text":"f"},{"id":"K_G","text":"g"},{"id":"K_H","text":"h"},{"id":"K_J","text":"j"},{"id":"K_K","text":"k"},{"id":"K_L","text":"l"},{"width":"10","id":"T_new_1003","sp":"10"}]},{"id":"3","key":[{"nextlayer":"shift","id":"K_SHIFT","sp":"1","text":"*Shift*","multitap":[{"nextlayer":"caps","id":"T_new_991","text":"*ShiftLock*"}]},{"id":"K_Z","text":"z"},{"id":"K_X","text":"x"},{"id":"K_C","text":"c"},{"id":"K_V","text":"v"},{"id":"K_B","text":"b"},{"id":"U_01F9","text":"\u01F9"},{"id":"K_M","text":"m"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"id":"K_COLON","text":";"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"460","id":"K_SPACE"},{"nextlayer":"default","id":"T_DEFAULT","sp":"1","text":"*abc*","multitap":[{"nextlayer":"accent-acute","id":"T_ACUTE","sp":"1","text":"\u0301"},{"nextlayer":"circumflex","id":"T_CIRCUMFLEX","sp":"1","text":"\u0302"}]},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]},{"id":"circumflex","row":[{"id":"1","key":[{"id":"K_Q","text":"q"},{"id":"U_0175","text":"\u0175"},{"id":"U_00EA","text":"\u00EA"},{"id":"K_R","text":"r"},{"id":"K_T","text":"t"},{"id":"U_0177","text":"\u0177"},{"id":"U_00FB","text":"\u00FB"},{"id":"U_00EE","text":"\u00EE"},{"id":"U_00F4","text":"\u00F4"},{"id":"K_P","text":"p"}]},{"id":"2","key":[{"id":"U_00E2","pad":"50","text":"\u00E2"},{"id":"U_015D","text":"\u015D"},{"id":"K_D","text":"d"},{"id":"K_F","text":"f"},{"id":"K_G","text":"g"},{"id":"U_0125","text":"\u0125"},{"id":"U_0135","text":"\u0135"},{"id":"K_K","text":"k"},{"id":"K_L","text":"l"},{"width":"10","id":"T_new_1178","sp":"10"}]},{"id":"3","key":[{"nextlayer":"shift","id":"K_SHIFT","sp":"1","text":"*Shift*","multitap":[{"nextlayer":"caps","id":"T_new_991","text":"*ShiftLock*"}]},{"id":"K_Z","text":"z"},{"id":"K_X","text":"x"},{"id":"U_0109","text":"\u0109"},{"id":"K_V","text":"v"},{"id":"K_B","text":"b"},{"id":"K_N","text":"n"},{"id":"K_M","text":"m"},{"id":"K_PERIOD","text":".","sk":[{"id":"K_COMMA","text":","},{"layer":"shift","id":"K_1","text":"!"},{"layer":"shift","id":"K_SLASH","text":"?"},{"id":"K_QUOTE","text":"'"},{"layer":"shift","id":"K_QUOTE","text":"\""},{"id":"K_BKSLASH","text":"\\"},{"layer":"shift","id":"K_COLON","text":":"},{"id":"K_COLON","text":";"}]},{"width":"100","id":"K_BKSP","sp":"1","text":"*BkSp*"}]},{"id":"4","key":[{"nextlayer":"numeric","width":"150","id":"K_NUMLOCK","sp":"1","text":"*123*"},{"width":"120","id":"K_LOPT","sp":"1","text":"*Menu*"},{"width":"460","id":"K_SPACE"},{"nextlayer":"default","id":"T_DEFAULT","sp":"1","text":"*abc*","multitap":[{"nextlayer":"accent-acute","id":"T_ACUTE","sp":"1","text":"\u0301"},{"nextlayer":"accent-grave","id":"T_GRAVE","sp":"1","text":"\u0300"}]},{"width":"150","id":"K_ENTER","sp":"1","text":"*Enter*"}]}]}]}};this.s11="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";this.KVER="17.0.185.0";this.KVS=[];this.gs=function(t,e) {return this.g0(t,e);};this.gs=function(t,e) {return this.g0(t,e);};this.g0=function(t,e) {var k=KeymanWeb,r=0,m=0;if(k.KKM(e,16640,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"A");}}else if(k.KKM(e,16912,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"A");}}else if(k.KKM(e,16640,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"B");}}else if(k.KKM(e,16912,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"B");}}else if(k.KKM(e,16640,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"C");}}else if(k.KKM(e,16912,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"C");}}else if(k.KKM(e,16640,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"D");}}else if(k.KKM(e,16912,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"D");}}else if(k.KKM(e,16640,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"E");}}else if(k.KKM(e,16912,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"E");}}else if(k.KKM(e,16640,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"F");}}else if(k.KKM(e,16912,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"F");}}else if(k.KKM(e,16640,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"G");}}else if(k.KKM(e,16912,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"G");}}else if(k.KKM(e,16640,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"H");}}else if(k.KKM(e,16912,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"H");}}else if(k.KKM(e,16640,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"I");}}else if(k.KKM(e,16912,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"I");}}else if(k.KKM(e,16640,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"J");}}else if(k.KKM(e,16912,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"J");}}else if(k.KKM(e,16640,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"K");}}else if(k.KKM(e,16912,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"K");}}else if(k.KKM(e,16640,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"L");}}else if(k.KKM(e,16912,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"L");}}else if(k.KKM(e,16640,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"M");}}else if(k.KKM(e,16912,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"M");}}else if(k.KKM(e,16640,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"N");}}else if(k.KKM(e,16912,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"N");}}else if(k.KKM(e,16640,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"O");}}else if(k.KKM(e,16912,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"O");}}else if(k.KKM(e,16640,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"P");}}else if(k.KKM(e,16912,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"P");}}else if(k.KKM(e,16640,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Q");}}else if(k.KKM(e,16912,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Q");}}else if(k.KKM(e,16640,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"R");}}else if(k.KKM(e,16912,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"R");}}else if(k.KKM(e,16640,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"S");}}else if(k.KKM(e,16912,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"S");}}else if(k.KKM(e,16640,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"T");}}else if(k.KKM(e,16912,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"T");}}else if(k.KKM(e,16640,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"U");}}else if(k.KKM(e,16912,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"U");}}else if(k.KKM(e,16640,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"V");}}else if(k.KKM(e,16912,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"V");}}else if(k.KKM(e,16640,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"W");}}else if(k.KKM(e,16912,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"W");}}else if(k.KKM(e,16640,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"X");}}else if(k.KKM(e,16912,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"X");}}else if(k.KKM(e,16640,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Y");}}else if(k.KKM(e,16912,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Y");}}else if(k.KKM(e,16640,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Z");}}else if(k.KKM(e,16912,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"Z");}}else if(k.KKM(e,16656,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"a");}}else if(k.KKM(e,16896,65)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"a");}}else if(k.KKM(e,16656,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"b");}}else if(k.KKM(e,16896,66)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"b");}}else if(k.KKM(e,16656,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"c");}}else if(k.KKM(e,16896,67)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"c");}}else if(k.KKM(e,16656,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"d");}}else if(k.KKM(e,16896,68)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"d");}}else if(k.KKM(e,16656,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"e");}}else if(k.KKM(e,16896,69)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"e");}}else if(k.KKM(e,16656,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"f");}}else if(k.KKM(e,16896,70)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"f");}}else if(k.KKM(e,16656,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"g");}}else if(k.KKM(e,16896,71)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"g");}}else if(k.KKM(e,16656,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"h");}}else if(k.KKM(e,16896,72)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"h");}}else if(k.KKM(e,16656,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"i");}}else if(k.KKM(e,16896,73)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"i");}}else if(k.KKM(e,16656,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"j");}}else if(k.KKM(e,16896,74)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"j");}}else if(k.KKM(e,16656,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"k");}}else if(k.KKM(e,16896,75)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"k");}}else if(k.KKM(e,16656,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"l");}}else if(k.KKM(e,16896,76)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"l");}}else if(k.KKM(e,16656,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"m");}}else if(k.KKM(e,16896,77)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"m");}}else if(k.KKM(e,16656,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"n");}}else if(k.KKM(e,16896,78)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"n");}}else if(k.KKM(e,16656,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"o");}}else if(k.KKM(e,16896,79)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"o");}}else if(k.KKM(e,16656,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"p");}}else if(k.KKM(e,16896,80)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"p");}}else if(k.KKM(e,16656,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"q");}}else if(k.KKM(e,16896,81)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"q");}}else if(k.KKM(e,16656,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"r");}}else if(k.KKM(e,16896,82)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"r");}}else if(k.KKM(e,16656,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"s");}}else if(k.KKM(e,16896,83)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"s");}}else if(k.KKM(e,16656,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"t");}}else if(k.KKM(e,16896,84)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"t");}}else if(k.KKM(e,16656,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"u");}}else if(k.KKM(e,16896,85)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"u");}}else if(k.KKM(e,16656,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"v");}}else if(k.KKM(e,16896,86)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"v");}}else if(k.KKM(e,16656,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"w");}}else if(k.KKM(e,16896,87)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"w");}}else if(k.KKM(e,16656,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"x");}}else if(k.KKM(e,16896,88)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"x");}}if(m) {}else if(k.KKM(e,16656,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"y");}}else if(k.KKM(e,16896,89)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"y");}}else if(k.KKM(e,16656,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"z");}}else if(k.KKM(e,16896,90)) {if(1){r=m=1;k.KDC(0,t);k.KO(-1,t,"z");}}return r;};}