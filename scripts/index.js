"use strict"

const CRYPTO = (function() {
    const _getCryptonatorURL = (cryptoCode) => `https://api.cryptonator.com/api/ticker/${cryptoCode}-usd`;

    const _handleResponse = (data) => {
        if (data.success) {
            scope.base = data.ticker.base;
            scope.target = data.ticker.target;
            scope.price = data.ticker.price;
            scope.volume = data.ticker.volume;
            scope.change = data.ticker.change;
            scope.data = new Date(data.timestamp * 1000);

            scope.error = null;
        } else {
            scope.base = null;
            scope.target = null;
            scope.price = null;
            scope.volume = null;
            scope.change = null;
            scope.data = null;

            scope.error = data.error;
        }
    };

    document.querySelector('#cryptoInput').addEventListener('keypress', function(ele) {
        if (ele.key === "Enter") {
            if (this.value !== '') {
                let cryptoInput = this.value.trim(),
                    cryptonatorURL = _getCryptonatorURL(cryptoInput);

                axios.get(cryptonatorURL)
                     .then((res) => {
                         console.log(res);
                         _handleResponse(res.data);
                     })
                     .catch((err) => {
                          scope.error = err;
                     })
                
            }
        }
    })
})()