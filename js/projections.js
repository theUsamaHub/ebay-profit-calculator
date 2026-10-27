'use strict';
EPC.monthly=(m)=>{const orders=m.daily*m.days,contribution=orders*m.profit,required=m.profit>0?Math.ceil((m.target+m.fixed)/m.profit):null;return {orders,revenue:orders*m.price,variable:orders*(m.price-m.profit),contribution,net:contribution-m.fixed,required,daily:required!==null&&m.days>0?required/m.days:null};};
EPC.conversion=(v)=>{const orders=v.visits*v.rate/100;return {orders,revenue:orders*v.price,profit:orders*v.profit,visits:v.rate>0&&v.profit>0?Math.ceil(v.target/v.profit/(v.rate/100)):null};};
EPC.capital=(c)=>{const minimum=c.cost*c.daily*c.gap,recommended=minimum*(1+c.reserve/100);return {minimum,recommended,orders:c.cost>0?Math.floor(c.available/c.cost):null,balance:c.available-recommended};};
