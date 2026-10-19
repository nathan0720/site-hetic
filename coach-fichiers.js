/* Fichiers de texte/code téléchargeables depuis les réponses, sans exécuter leur contenu. */
(() => {
const log=document.getElementById('messages-coach');if(!log)return;
const en=document.documentElement.lang==='en',L=(fr,english)=>en?english:fr;
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function createZip(files){
 const encoder=new TextEncoder();const local=[],central=[];let offset=0;
 for(const [name,text] of Object.entries(files)){
  const filename=encoder.encode(name),data=encoder.encode(text),crc=crc32(data);
  const head=new Uint8Array(30+filename.length),h=new DataView(head.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,filename.length,true);head.set(filename,30);local.push(head,data);
  const entry=new Uint8Array(46+filename.length),c=new DataView(entry.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,filename.length,true);c.setUint32(42,offset,true);entry.set(filename,46);central.push(entry);offset+=head.length+data.length;
 }
 const size=central.reduce((sum,item)=>sum+item.length,0);const end=new Uint8Array(22),view=new DataView(end.buffer);
 view.setUint32(0,0x06054b50,true);view.setUint16(8,central.length,true);view.setUint16(10,central.length,true);view.setUint32(12,size,true);view.setUint32(16,offset,true);
 return new Blob([...local,...central,end],{type:'application/zip'});
}

function extract(text){const files={},mapping={html:'index.html',css:'style.css',js:'script.js',javascript:'script.js',json:'donnees.json',text:'note.txt',txt:'note.txt',md:'README.md',markdown:'README.md',csv:'donnees.csv'};const pattern=/```([^\n`]*)\n([\s\S]*?)```/g;let match;while((match=pattern.exec(text))&&Object.keys(files).length<12){const info=match[1].trim().split(/\s+/)[0];let name=mapping[info.toLowerCase()]||info.split(/[\\/]/).pop();if(!name||!/^[-\w.]+\.(html|css|js|json|txt|md|csv)$/i.test(name)||match[2].length>100000)continue;let unique=name,n=2;while(files[unique]!==undefined)unique=name.replace(/(\.[^.]+)$/,'-'+n+++'$1');files[unique]=match[2]}return files}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function refresh(){for(const message of log.querySelectorAll('.message-bot')){if(message.dataset.exportsReady)continue;message.dataset.exportsReady='true';const text=message.dataset.rawText||message.querySelector('span')?.textContent||'',files=extract(text),entries=Object.entries(files);if(!entries.length)continue;const actions=document.createElement('div');actions.className='fichiers-reponse';for(const [name,content] of entries){const b=document.createElement('button');b.type='button';b.className='bouton-secondaire';b.textContent=name+' ↓';b.addEventListener('click',()=>download(new Blob([content],{type:'text/plain;charset=utf-8'}),name));actions.append(b)}if(entries.length>1){const b=document.createElement('button');b.type='button';b.className='bouton-primaire';b.textContent=L('Tout en ZIP ↓','All as ZIP ↓');b.addEventListener('click',()=>download(createZip(files),'projet-assistant.zip'));actions.append(b)}message.append(actions)}}
new MutationObserver(refresh).observe(log,{childList:true,subtree:true});refresh();
})();
