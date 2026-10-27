'use strict';
EPC.drawChart=(el,r)=>{
 const segments=[['Supplier costs',r.supplier,'#5668e8'],['eBay fees',r.fees.total-r.fees.advertising,'#9eabf4'],['Advertising',r.fees.advertising,'#efb45b'],['Other expenses',r.expenses-r.supplier-r.fees.total,'#d5dce9'],['Net profit',Math.max(0,r.profit),'#13b98c']];
 const total=segments.reduce((s,x)=>s+x[1],0);let cursor=0;
 const stops=segments.map(([,v,color])=>{const start=cursor;cursor+=total?v/total*100:0;return `${color} ${start}% ${cursor}%`;});
 el.querySelector('.donut').style.background=total?`conic-gradient(${stops.join(',')})`:'var(--line)';
 el.querySelector('.donut-value').textContent=EPC.money(r.revenue);
 const legend=el.querySelector('.legend');legend.replaceChildren();
 for(const [name,value,color]of segments){const row=document.createElement('div'),dot=document.createElement('i'),label=document.createElement('span'),amount=document.createElement('strong');dot.style.background=color;label.textContent=name;amount.textContent=EPC.money(value);row.append(dot,label,amount);legend.append(row);}
 el.querySelector('.chart-loss').textContent=r.profit<0?`Loss: ${EPC.money(-r.profit)} (shown separately)`:'Every dollar, accounted for.';
};
