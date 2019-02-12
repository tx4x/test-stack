const fetch = require('node-fetch');
const cheerio = require('cheerio')


const getLastDTScript = async () => {
    try {
      const response = await fetch('http://localhost:8020/debugui/debug/config/uem?configSelection=APPLICATION-E84CEFA5042EEF39&tenantUuid=1');
      const body = await response.text();
      const $ = cheerio.load(body);
      let innerText = $('#core_content>p:contains("data-dtconfig")').text();
      // http:
      innerText = innerText.replace('https','http').replace('8021','8020');
      // dbg mode:
      // innerText = innerText.replace('ruxitagentjs','ruxitagentjsdbg');
      const dnVersion = innerText.substr(innerText.indexOf('<script'));
      const script = cheerio.load(dnVersion)('script');
      return {
        src: script.attr('src'),
        data: script.attr('data-dtconfig') + '|app=23A87FC6C688A6BD'
      };
    } catch (error) {
      console.log(error);
      return '';
    }
};
getLastDTScript().then((d)=>{
  console.log();
})
