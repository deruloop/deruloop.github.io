$(document).ready(function() {
    $.getJSON("https://www.chain.so/api/v2/address/DOGE/DK1i69bM3M3GutjmHBTf7HLjT5o3naWBEk", function(data) { $('#totaldonations').text(data.data.balance); });
    // $.getJSON("https://www.chain.so/api/v2/address/DOGE/DK1i69bM3M3GutjmHBTf7HLjT5o3naWBEk", function(data) { $('#totaldonations').text(data.data.balance); });
    // $('#TotalRaised').load('http://dogechain.info/chain/Dogecoin/q/getreceivedbyaddress/DK1i69bM3M3GutjmHBTf7HLjT5o3naWBEk'); });
});
