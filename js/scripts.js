$(document).ready(function() {
    $.getJSON("https://www.chain.so/api/v2/address/DOGE/DDFQ15ErrUZxUfSCPfotL7jVar64UuvTRq", function(data) { $('#totaldonationsdoge').text(data.data.balance); });

    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/5d62c251719e40f1ae2e87a0e2e5eb65'));
    console.log('Getting contract tokens balance.....');
    var addr = ('0x26928E56d5c46C89434d570e40BA8230FfD5C8E6');
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
        $('#totaldonationsshiba').text(web3.utils.fromWei(tokens, 'ether'));
    	}
    	else {
    		console.log(err); // Dump errors here
    	}
    });

});
