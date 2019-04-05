let scope = {};

(function twoWayDataBingding() {
    let bindingItems = document.querySelectorAll('[tw-binding]');
    console.log(bindingItems);

    bindingItems.forEach((ele) => {
        let propToBind = ele.getAttribute('tw-binding');
        console.log(propToBind);
        addScope(propToBind);
        if (ele.type === 'text') {
            ele.onkeyup = () => {
                scope[propToBind] = ele.value;
                console.log(`the property ${propToBind} was updated to value: ${ele.value}`);
            }
        }
    });

    function addScope(propToBind) {
        if (!scope.hasOwnProperty(propToBind)) {
            let value;
            Object.defineProperty(scope, propToBind, {
                get() { return value },
                set(newValue) {
                    value = newValue;
                    bindingItems.forEach((ele) => {
                        if (ele.getAttribute('tw-binding') == propToBind) {
                            if (ele.type == 'text') ele.valu = newValue;
                            else if (!ele.type) ele.innerHTML = newValue;
                        }
                    });
                }
            })
        }
    };

    console.log(scope);
})();