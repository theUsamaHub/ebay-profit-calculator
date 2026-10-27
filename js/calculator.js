'use strict';
EPC.defaultProduct={name:'Wireless Bluetooth Headphones',category:'Consumer electronics',price:50,cost:22,shipping:4,buyerShipping:0,tax:0,packaging:0.5,other:0};
EPC.calculate=(p,f)=>{
 const fees=EPC.fees(p,f),revenue=p.price+p.buyerShipping,supplier=p.cost+p.shipping;
 const returns=revenue*f.returns/100, expenses=supplier+p.packaging+p.other+fees.total+fees.payoneer+returns;
 const profit=revenue-expenses, funded=supplier+p.packaging+p.other;
 return {revenue,supplier,fees,returns,expenses,profit,funded,margin:revenue?profit/revenue*100:null,roi:funded?profit/funded*100:null,payout:revenue-fees.total-fees.payoneer};
};
// On each fixed-fee interval the model is piecewise linear; clamped payout bases add kinks.
// Search cents separately on both sides of the order-value threshold (no monotonicity across it).
EPC.solvePrice=(p,f,target=0,mode='amount')=>{
 if(mode==='margin' && target>=100)return null;
 const score=cents=>{const r=EPC.calculate({...p,price:cents/100},f);return r.profit-(mode==='margin'?r.revenue*target/100:target);};
 const boundary=Math.floor((f.threshold-p.buyerShipping-p.tax+1e-9)*100);
 const max=100000000000; let intervals=[[0,Math.min(max,boundary)],[Math.max(0,boundary+1),max]].filter(([lo,hi])=>hi>=lo);
 // Split again where net payout crosses zero, so even extreme fee combinations
 // with a temporary feasible price range cannot be missed by an endpoint search.
 for(const stage of ['beforeConversion','beforePayoneer']){
   const split=[];
   const payout=cents=>{const q={...p,price:cents/100},fees=EPC.fees(q,f);return q.price+q.buyerShipping-fees.total+(stage==='beforeConversion'?fees.conversion:0);};
   for(const [lo,hi]of intervals){const a=payout(lo),b=payout(hi);
     if(a*b<0){const root=lo-a*(hi-lo)/(b-a),cut=Math.floor(root);split.push([lo,cut],[cut+1,hi]);}else split.push([lo,hi]);
   }intervals=split.filter(([lo,hi])=>hi>=lo);
 }
 for(const [lo,hi] of intervals){if(hi<lo)continue;if(score(lo)>=-1e-9)return lo/100;
   if(score(hi)<-1e-9)continue;
   let l=lo,h=hi;while(l<h){const m=Math.floor((l+h)/2);if(score(m)>=-1e-9)h=m;else l=m+1;}return l/100;
 }return null;
};
