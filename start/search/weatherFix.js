removeTransformCSS();
addTransformCSS();

function removeTransformCSS() {
    var styleSheets = document.styleSheets;
    for (var i = 0; i < styleSheets.length; i++) {
        var rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];
            if (rule.selectorText === ".widght" && rule.style.transform === "translateX(-70%)") {
                styleSheets[i].deleteRule(j);
                return; // Exit once the rule is found and removed
            }
        }
    }
}

//shift the widgh to the left when weather is enabled by editing the css in index.html
function addTransformCSS() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'widght-transform-style';
    style.innerHTML = '.widght { transform: translateX(-70%); }';
    document.getElementsByTagName('head')[0].appendChild(style);
}