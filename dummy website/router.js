var routesDB = {};
var historyArr = [];
var currentRoute = '/';
var page = 0;

function routerInit() {
    console.log(">> Static router active");
    controlElement = document.querySelector('body');
    if(localStorage.getItem('staticRouterDB')) routesDB = JSON.parse(localStorage.getItem('staticRouterDB'));
    setAnchors();
}

function setControlElement(queryString) {
    controlElement = document.querySelector(queryString);
    if (!controlElement) console.log('Control element not found.');
    else console.log('Control element set to ' + queryString);
}

function gotoRoute(destRouteUrl) {
    historyArr.push(currentRoute);
    currentRoute = destRouteUrl;
    page++;
    console.log('goto: ' + destRouteUrl)
    getHtml(routesDB[destRouteUrl]).then(
        (res) => {
            controlElement.innerHTML = res.html;
            history.pushState({ destRouteUrl }, page, destRouteUrl);
            document.title = res.title;
        }
    );
    setTimeout(setAnchors, 100);
}

async function getHtml(url) {
    try {
        let res = await fetch(url);
        res = await res.text();
        let parser = new DOMParser();
        let pageDOM = parser.parseFromString(res, 'text/html');
        let scriptString = '';
        let scripts = pageDOM.getElementsByTagName('script');
        for (let script of scripts) {
            // scriptString += script.innerHTML;
            addScript(script);
        }
        if (res) return { html: res + scriptString, title: pageDOM.title };
        else return 'Error'
    }
    catch (err) { console.log(err); }

}

function addRoute(route, url) {
    routesDB[route] = url;
    console.log("Route added" + route)
    localStorage.setItem('staticRouterDB', JSON.stringify(routesDB))
}

function setAnchors() {
    let anchors = document.getElementsByTagName('a');
    for (let i = 0; i < anchors.length; i++) {
        anchor = anchors[i];
        let route = '/' + anchor.href.split('/')[3];
        anchor.onclick = (event) => {
            event.preventDefault();
            gotoRoute(route);
        }
    }
}

function addScript(script) {
    // if (script.src === 'router.js') {console.log('ddnt add'); return;}
    let head = document.getElementsByTagName('head')[0];
    let newScript = document.createElement('script');
    if (script.src) newScript.src = script.src;
    else if (script.innerHTML) newScript.innerHTML = script.innerHTML;
    newScript.classList.add('insertedByRouter');
    head.appendChild(newScript);
}

function removeInsertedScripts()
{
    let tempArr = document.getElementsByClassName('insertedByRouter');
    // for(let scr in tempArr) console.log(scr.src || scr.innerHTML);
}

routerInit();
window.onpopstate = function (event) {
    event.preventDefault();
    console.log(event.state);
    lastRoute = historyArr.pop();

    // gotoRoute(event.state.destRouteUrl);
    if (lastRoute) gotoRoute(lastRoute);
    setTimeout(() => {
        historyArr.pop();
    }, 200);
}


