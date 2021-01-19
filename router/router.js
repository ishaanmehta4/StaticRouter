console.log(">> Static router active");
controlElement = document.querySelector('body');
var routesDB = {};

function setControlElement(queryString) {
    controlElement = document.querySelector(queryString);
    if (!controlElement) console.log('Control element not found.');
    else console.log('Control element set to ' + queryString);
}


function gotoRoute(destRouteUrl)
{
    history.pushState({} , '', destRouteUrl);    
    getHtml(routesDB[destRouteUrl]).then(
        (res) => (controlElement.innerHTML = res));
}

async function getHtml(url) {
    try {
        let res = await fetch(url);
        res = await res.text();
       if(res) return res;
       else return 'Error'
    }
    catch (err) { console.log(err); }

}

function addRoute(route, url)
{
    routesDB[route] = url;
}

setTimeout(() => {
    gotoRoute('/about');    
}, 2000);

