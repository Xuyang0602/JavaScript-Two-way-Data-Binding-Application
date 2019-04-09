"use strict"

// /* **********************************************
// **
// ** UI Elements Module
// **
// ** - this module will be responsible for controling UI Elements 
// ** ******************************************** */
const UI = (function () {
    const loader = document.querySelector("#loader"),
        errorMsg = document.querySelector("#error-message"),
        cryptoCurrencyInf = document.querySelector("#crypto-currency-info"),
        priceChangeIcon = document.querySelector("#price-change-icon"),
        updateBar = document.querySelector("#update-bar"),
        progress = updateBar.children[0];

    let updateInterval;

    const _hidePanelBody = () => {
        document.querySelectorAll(".panel-body").forEach((item) => {
            item.classList.add('display-none');
        })
    };

    // show the laoder
    const showLoader = () => {
        _hidePanelBody();
        loader.classList.remove('display-none')
    }

    // show error
    const showError = () => {
        _hidePanelBody();
        errorMsg.classList.remove('display-none')
    }

    // show information about cryptocurrency
    const showCryptoCurrencyInfo = () => {
        _hidePanelBody();
        cryptoCurrencyInf.classList.remove('display-none')
    }


    // animate the update bar
    const animateUpdateBar = () => {
        let width = 1;
        updateBar.classList.remove('display-none')
        updateInterval = setInterval(() => {
            if (width >= 100) {
                clearInterval(updateInterval);
                width = 1;
            }
            else {
                width += 1 / 60;
                progress.style.width = width + '%';
            }
        }, 10)
    }

    const stopUpdate = () => {
        updateBar.classList.add('display-none');
        progress.style.width = '1%';
        clearInterval(updateInterval);
    }

    // toggle between icons
    const showPriceLossIcon = () => priceChangeIcon.setAttribute('src', './assets/loss.png');
    const showPriceUpIcon = () => priceChangeIcon.setAttribute('src', './assets/line-chart.png');


    return {
        showLoader,
        showError,
        showCryptoCurrencyInfo,
        showPriceLossIcon,
        showPriceUpIcon,
        animateUpdateBar,
        stopUpdate
    }
})();



// /* **********************************************
// **
// ** Get Crypto Data Module
// **
// ** - this module will be responsible getting the crypto data
// ** ******************************************** */
const CRYPTO = (function () {

    const cryptoInput = document.querySelector("#crypto-code-input"),
         _getCryptonatorURL = (cryptoCode) => `https://api.cryptonator.com/api/ticker/${cryptoCode}-usd`;

    let criptoInterval;

    // handle incoming response from the cryptonator
    const _handleResponse = (data) => {
        if (!data.success) {
            // put error message
            scope.error = data.error;

            UI.showError();
            cryptoInput.classList.add("input-error-hint")
            UI.stopUpdate();
            clearInterval(criptoInterval);
        } else {
            // shpw update bar
            UI.animateUpdateBar();

            // put data 
            scope.base = data.ticker.base;
            scope.target = data.ticker.target;
            scope.price = parseFloat(data.ticker.price, 10).toFixed(4);
            scope.volume = (data.ticker.volume > 99) ? (data.ticker.volume / 1000).toFixed(1) + 'K' : data.ticker.volume;
            data.ticker.change < 0 ? UI.showPriceLossIcon() : UI.showPriceUpIcon();
            scope.change = data.ticker.change
            scope.date = new Date(data.timestamp * 1000)
           
            // show data 
            UI.showCryptoCurrencyInfo()

          

            // remove error class in case is there
            cryptoInput.classList.remove('input-error-hint')

            // clear input
            cryptoInput.value = '';
        }
    }

    const _getCryptoCurrencyData = (url) => {
        // show loading screen
        UI.showLoader();
        axios.get(url)
            .then((res) => {
                _handleResponse(res.data);
                criptoInterval = setTimeout(() => {
                    UI.stopUpdate();
                    _getCryptoCurrencyData(url);
                }, 60000)
            })
            .catch((err) => {
                scope.error = err;
                UI.showError();
                UI.stopUpdate();
                clearInterval(criptoInterval);
            })
    };

    cryptoInput.addEventListener('keypress', function (e) {
        if (e.key.toLowerCase() == "enter") {
            let cryptoCode = this.value.trim().toLowerCase(),
                cryptonatorURL = _getCryptonatorURL(cryptoCode);

            clearInterval(criptoInterval);
            UI.stopUpdate();
            _getCryptoCurrencyData(cryptonatorURL);
        }
    })
})();
