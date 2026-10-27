'use strict';
EPC.storage={read(key,fallback){try{return JSON.parse(localStorage.getItem('epc-'+key))??fallback;}catch{return fallback;}},write(key,value){try{localStorage.setItem('epc-'+key,JSON.stringify(value));return true;}catch{return false;}}};
EPC.validateRecord=record=>{
 if(!record||typeof record!=='object'||!record.product||!record.fees)throw new Error('Missing product or fee settings.');
 const p=record.product,f=record.fees;
 for(const [key,value] of Object.entries(EPC.defaultProduct)) {if(typeof p[key]!==typeof value)throw new Error('Invalid product field: '+key);if(typeof value==='number'&&(!Number.isFinite(p[key])||p[key]<0||p[key]>1e9))throw new Error('Invalid amount: '+key);}
 if(p.name.length>200||p.category.length>200)throw new Error('Product text is too long.');
 for(const [key,value] of Object.entries(EPC.defaultFees)){if(typeof f[key]!==typeof value)throw new Error('Invalid fee field: '+key);if(typeof value==='number'&&(!Number.isFinite(f[key])||f[key]<0||f[key]>1e9))throw new Error('Invalid fee: '+key);}
 for(const key of ['finalBase','internationalBase','adBase'])if(!['price','revenue','total'].includes(f[key]))throw new Error('Invalid fee base.');
 for(const key of ['conversionBase','payoneerBase'])if(!['price','revenue','total','payout'].includes(f[key]))throw new Error('Invalid conversion base.');
 if(!['manual','percent'].includes(f.adMode))throw new Error('Invalid advertising mode.');
 for(const key of ['reference','internationalReference']){const u=new URL(f[key]);if(u.protocol!=='https:')throw new Error('Reference links must use HTTPS.');}
 return {id:typeof record.id==='string'?record.id:crypto.randomUUID(),product:Object.fromEntries(Object.keys(EPC.defaultProduct).map(k=>[k,p[k]])),fees:Object.fromEntries(Object.keys(EPC.defaultFees).map(k=>[k,f[k]]))};
};
