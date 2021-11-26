$(document).ready(function() {
  //DDFQ15ErrUZxUfSCPfotL7jVar64UuvTRq
    $.getJSON("https://www.chain.so/api/v2/address/DOGE/DDz1H7AcqPgmKzFEP3pBHW5b1GWuWEoAAP", function(data) {
       // $('#totaldonationsdoge').text(data.data.balance);
       //data.data.balance
       console.log(data.data.balance);
       var dogePerc = data.data.balance/50000000*100;
       console.log(dogePerc);
       document.getElementById("progressdoge").style.background = 'linear-gradient(to right, red, red ' + dogePerc + '%,transparent '  + dogePerc + '%,transparent 100%)';
     });

    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/5d62c251719e40f1ae2e87a0e2e5eb65'));
    console.log('Getting contract tokens balance.....');
    //0x26928E56d5c46C89434d570e40BA8230FfD5C8E6
    var addr = ('0x95A9bd206aE52C4BA8EecFc93d18EACDd41C88CC');
    console.log("Address: " + addr);
    var contractAddr = ('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'); //SHIBA
    var tknAddress = (addr).substring(2);
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress);
    web3.eth.call({
    to: contractAddr,
    data: contractData
    }, function(err, result) {
    	if (result) {
    		var tokens = web3.utils.toBN(result).toString();
    		console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether'));
        // $('#totaldonationsshiba').text(web3.utils.fromWei(tokens, 'ether'));
        //web3.utils.fromWei(tokens, 'ether')
        console.log(web3.utils.fromWei(tokens, 'ether'))
        var shibaPerc = web3.utils.fromWei(tokens, 'ether')/10000000*100;
        console.log(shibaPerc);
        document.getElementById("progressshiba").style.background = 'linear-gradient(to right, red, red ' + shibaPerc + '%,transparent ' + shibaPerc + '%,transparent 100%)';
    	}
    	else {
    		console.log(err); // Dump errors here
    	}
    });

});
