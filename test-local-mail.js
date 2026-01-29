const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// Load handler
const handler = require('./api/mail.js');

function makeReq(bodyObj) {
  const bodyStr = JSON.stringify(bodyObj);
  const s = new Readable();
  s._read = function(){};
  // emulate headers
  s.headers = { 'content-type': 'application/json' };
  s.method = 'POST';
  // push body and end
  process.nextTick(() => { s.push(bodyStr); s.push(null); });
  return s;
}

function makeRes() {
  return {
    headers: {},
    setHeader(k,v){ this.headers[k]=v; },
    status(code){ this.statusCode = code; return this; },
    json(obj){ console.log('=== RESPONSE ==='); console.log('status:', this.statusCode); console.log(JSON.stringify(obj, null, 2)); return; },
    end(){ console.log('end called'); }
  };
}

(async ()=>{
  process.env.DEBUG_MAIL = '1';
  const req = makeReq({ name: 'Local Test', phone: '+100', service_requested: 'demo' });
  const res = makeRes();
  try {
    await handler(req, res);
  } catch (err) {
    console.error('Handler threw:', err);
  }
})();
