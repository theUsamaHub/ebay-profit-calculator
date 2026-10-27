'use strict';
EPC.defaultFees = { final:13.6, international:1.55, low:0.3, high:0.4, threshold:10, insertion:0, advertising:0, adMode:'percent', adFixed:0, conversion:0, conversionEnabled:false, payoneer:0, payoneerEnabled:false, returns:0, finalBase:'total', internationalBase:'total', adBase:'total', conversionBase:'payout', payoneerBase:'payout', reference:'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822', internationalReference:'https://export.ebay.com/en/fees-regulations-policies/seller-fees/international-fees/' };
EPC.base = (p, type, payout=0) => ({price:p.price,revenue:p.price+p.buyerShipping,total:p.price+p.buyerShipping+p.tax,payout:Math.max(0,payout)})[type] ?? 0;
EPC.fees = (p,f) => {
 const final=EPC.base(p,f.finalBase)*f.final/100, international=EPC.base(p,f.internationalBase)*f.international/100;
 const fixed=p.price+p.buyerShipping+p.tax<=f.threshold+1e-10?f.low:f.high;
 const advertising=f.adMode==='manual'?f.adFixed:EPC.base(p,f.adBase)*f.advertising/100;
 const beforeConversion=final+international+fixed+f.insertion+advertising;
 const conversion=f.conversionEnabled?EPC.base(p,f.conversionBase,p.price+p.buyerShipping-beforeConversion)*f.conversion/100:0;
 const total=beforeConversion+conversion;
 const payoneer=f.payoneerEnabled?EPC.base(p,f.payoneerBase,p.price+p.buyerShipping-total)*f.payoneer/100:0;
 return {final,international,fixed,insertion:f.insertion,advertising,conversion,total,payoneer};
};
