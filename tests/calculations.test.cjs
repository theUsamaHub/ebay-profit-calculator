const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
global.window=global;for(const file of ['utils','fees','calculator','projections','storage'])vm.runInThisContext(fs.readFileSync(`${__dirname}/../js/${file}.js`,'utf8'));
const p={...EPC.defaultProduct,packaging:0},f={...EPC.defaultFees};let passed=0;
function test(name,fn){fn();console.log('PASS '+name);passed++;}function near(actual,expected){assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);}
test('Profitable $50 product',()=>{const r=EPC.calculate(p,f);near(r.fees.total,7.975);near(r.profit,16.025);near(r.margin,32.05);near(r.roi,16.025/26*100);});
test('Loss-making product',()=>near(EPC.calculate({...p,cost:60},f).profit,-21.975));
test('Exact break-even',()=>near(EPC.calculate({...p,cost:38.025},f).profit,0));
test('Order exactly $10',()=>{const r=EPC.calculate({...p,price:10},f);near(r.fees.fixed,.3);near(r.fees.total,1.815);});
test('Order just above $10',()=>near(EPC.calculate({...p,price:10.01},f).fees.fixed,.4));
test('Advertising percentage and manual are exclusive',()=>{near(EPC.calculate(p,{...f,advertising:5}).profit,13.525);near(EPC.calculate(p,{...f,advertising:5,adMode:'manual',adFixed:3}).profit,13.025);});
test('Buyer shipping is revenue and fee base',()=>{const r=EPC.calculate({...p,buyerShipping:5},f);near(r.revenue,55);near(r.fees.total,8.7325);near(r.profit,20.2675);});
test('Sales tax pass-through plus independent bases',()=>{const r=EPC.calculate({...p,tax:5},f);near(r.revenue,50);near(r.fees.total,8.7325);near(r.profit,15.2675);near(EPC.calculate({...p,tax:5},{...f,internationalBase:'revenue'}).fees.international,.775);});
test('Threshold includes tax and shipping',()=>near(EPC.calculate({...p,price:9,buyerShipping:1,tax:.01},f).fees.fixed,.4));
test('Currency conversion is opt-in on net proceeds',()=>{near(EPC.calculate(p,{...f,conversion:2}).fees.conversion,0);near(EPC.calculate(p,{...f,conversion:2,conversionEnabled:true}).fees.conversion,.8405);});
test('Payoneer charges after eBay conversion',()=>near(EPC.calculate(p,{...f,conversion:2,conversionEnabled:true,payoneer:2,payoneerEnabled:true}).fees.payoneer,.82369));
test('Expected return reserve',()=>near(EPC.calculate(p,{...f,returns:5}).profit,13.525));
test('20 percent margin price is minimum cent',()=>{const price=EPC.solvePrice(p,f,20,'margin');near(price,40.71);assert.ok(EPC.calculate({...p,price},f).margin>=20);assert.ok(EPC.calculate({...p,price:price-.01},f).margin<20);});
test('Insufficient working capital',()=>{const c=EPC.capital({cost:26,daily:5,gap:14,reserve:20,available:1500});near(c.minimum,1820);near(c.recommended,2184);near(c.balance,-684);near(c.orders,57);});
test('Zero sales and denominators',()=>{const m=EPC.monthly({daily:0,days:30,price:50,profit:0,fixed:50,target:1000});near(m.revenue,0);near(m.net,-50);assert.equal(m.required,null);const r=EPC.calculate({...p,price:0,cost:0,shipping:0},f);assert.equal(r.margin,null);assert.equal(r.roi,null);assert.equal(EPC.conversion({visits:0,rate:0,price:50,profit:0,target:1000}).visits,null);});
test('Unusually high supplier cost',()=>near(EPC.calculate({...p,cost:1000000},f).profit,-999961.975));
test('Threshold solver finds lower interval despite fee jump',()=>{const q={...p,cost:8.185,shipping:0};near(EPC.solvePrice(q,f),10);});
test('Impossible margin',()=>assert.equal(EPC.solvePrice(p,f,100,'margin'),null));
test('Monthly forecast independently calculated',()=>{const m=EPC.monthly({daily:5,days:30,price:50,profit:16,fixed:50,target:1000});near(m.orders,150);near(m.revenue,7500);near(m.variable,5100);near(m.net,2350);near(m.required,66);});
test('Conversion forecast independently calculated',()=>{const v=EPC.conversion({visits:3000,rate:2,price:50,profit:16,target:1000});near(v.orders,60);near(v.revenue,3000);near(v.profit,960);near(v.visits,3125);});
test('CSV escaping supports multiline names and quotes',()=>{const row=['a, b','quote "here"','line\nbreak'];assert.deepEqual(EPC.parseCSV(row.map(EPC.csvCell).join(',')),[row]);});
test('Imported negative, invalid base and unsafe link rejected',()=>{assert.throws(()=>EPC.validateRecord({product:{...p,cost:-1},fees:f}));assert.throws(()=>EPC.validateRecord({product:p,fees:{...f,finalBase:'bad'}}));assert.throws(()=>EPC.validateRecord({product:p,fees:{...f,reference:'javascript:alert(1)'}}));});
test('Currency display handles floating point half cents',()=>{assert.equal(EPC.money(50-34.475),'$15.53');assert.equal(EPC.money(-15.524999999999999),'-$15.53');});
test('Pricing solver agrees with exhaustive cent search across fee thresholds and payout clamps',()=>{
 let seed=481;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<80;i++){
   const q={...p,price:0,cost:random()*8,shipping:0,buyerShipping:random()*3,tax:random()*2};
   const settings={...f,final:random()*80,international:random()*40,conversionEnabled:true,conversion:random()*100,payoneerEnabled:true,payoneer:random()*100,returns:random()*20};
   const target=random()*2;let expected=null;
   for(let cents=0;cents<=10000;cents++){if(EPC.calculate({...q,price:cents/100},settings).profit>=target-1e-9){expected=cents/100;break;}}
   const actual=EPC.solvePrice(q,settings,target);if(expected!==null)near(actual,expected);else assert.ok(actual===null||actual>100);
 }
});
console.log(`\n${passed} tests passed.`);
