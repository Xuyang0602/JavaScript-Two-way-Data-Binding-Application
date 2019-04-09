
"use strict";

let scope = {};

(function twoWayDataBinding() {
    let bindingItems = document.querySelectorAll('[tw-binding]');

    bindingItems.forEach((e) => {
        let propToBind = e.getAttribute("tw-binding");
        addScope(propToBind);
        if (e.type == "text"){
            e.onkeyup = function(){
                scope[propToBind] = e.value;
            }
        }

    })

    function addScope(propToBind) {
        if (!scope.hasOwnProperty(propToBind)) {
            let value;
            Object.defineProperty(scope, propToBind, {
                get() { return value },
                set(newValue) {
                    value = newValue;
                    bindingItems.forEach((e) => {
                        if (e.getAttribute("tw-binding") == propToBind) {
                            if (e.type == "text")
                                e.value = newValue;
                            else if (!e.type) e.innerHTML = newValue;
                        }
                    })
                }
            })
        }
    }
})();
