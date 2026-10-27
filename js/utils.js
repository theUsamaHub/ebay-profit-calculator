'use strict';
window.EPC = window.EPC || {};
EPC.money = n => Number.isFinite(n) ? new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Math.sign(n)*Math.round((Math.abs(n)+Number.EPSILON*Math.max(1,Math.abs(n)))*100)/100) : 'Not achievable';
EPC.percent = n => n === null ? '—' : `${n.toFixed(1)}%`;
EPC.num = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
EPC.clone = value => JSON.parse(JSON.stringify(value));
EPC.csvCell = value => '"' + String(value).replace(/"/g,'""') + '"';
EPC.parseCSV = text => {
  const rows=[]; let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++) { const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"'){cell+='"';i++;} else quoted=!quoted; }
    else if(c===','&&!quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  if(quoted)throw new Error('Unclosed CSV quote.');
  row.push(cell);if(row.some(Boolean))rows.push(row);return rows;
};
