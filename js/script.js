var timeLeft = 30;
var elem = document.getElementById('timer');
var timerId = setInterval(countdown, 1000);
let refresh;
let searched;
let pageCount = 1;
let apiRequesting = false;
function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
    } else if (searched) {
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
        if (timeLeft == 0) {
            timeLeft = 30;
        }
    }
}
function refreshFunc(stop) {
    const interval = setInterval(() => {
        refresh = true;
        createQuery();
    }, 30000);
    window.interval = interval;
}
function createQuery() {
    var query = document.getElementById('searchBar').value
    searched = true;

    console.log('dco', query);
    if (query) {
        console.log('refresh',refresh, !refresh);
        if (!refresh) {
            refreshFunc();
        }
        search(query,pageCount);
    }
}
async function search(query, pageCount) {
    var container = document.getElementById('imgList');
    const loader = document.querySelector('#demo');
    const skeleton = document.querySelector('#skeleton-loader');
    try {
        skeleton.style.display = 'block';
        loader.appendChild(skeleton);
        const apiData = await getData(query, pageCount);
        apiRequesting = false;
        skeleton.style.display = 'none';
        loader.style.display = 'none';
        console.log('try');
        console.log(apiData);
        if (refresh) {
            document.getElementById("demo").innerHTML = '';
        }
        if (apiData.articles) {
            apiData.articles.map((item, index) => {
                // document.getElementById("demo").innerHTML += item.title + "<br>" + "<br>" + "<br>";
                let row = document.createElement('div');
                row.className = 'row';
                let text = document.createElement('div');
                text.className = 'data';
                let image = document.createElement('img');
                image.className = 'img';
                text.innerHTML = `<a target="_blank" class= "link" href=${item.url}>${item.title}</a>`;
                if (item.urlToImage !== null) {
                    image.src = item.urlToImage;
                    image.width = 100
                    image.height = 50
                }
                else {
                    // var image = document.createElement('image');
                    image.src = 'http://static1.squarespace.com/static/582f2a75414fb5c5d7172211/t/5ba29eacb8a045e82a32378a/1537384155646/blank-thumbnail.jpg?format=1500w'
                        ;
                    image.width = 100
                    image.height = 50
                }
                row.appendChild(image);
                row.appendChild(text);
                container.appendChild(row);
            });
        }
    } catch (err) {
        console.log('Error in search', err);
        skeleton.style.display = 'none';
        loader.style.display = 'none';
        apiRequesting = true;
    }
}

async function getData(query, pageCount) {
    try {
        apiRequesting = true;
        const apiData = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=44c1f90dde454be693c048b711c354dc&pageSize=10&page=${pageCount}`)
        return apiData.json();
    } catch (err) {
        console.log('Error in api request', err);
    }
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    )
}

function percentageScrolled() {
    var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
    var docheight = getDocHeight()
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    var trackLength = docheight - winheight
    var pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    return pctScrolled;
}

function onScroll() {
    refresh = false;
    clearInterval(window.interval);
    percentageScrolled();
    if (searched && !apiRequesting && percentageScrolled() > 85) {
        pageCount++;
        console.log('onscroll',pageCount);
        createQuery();
    }
}

window.addEventListener('scroll', onScroll);

window.addEventListener('load', function () {
    let skeleton = document.querySelector('#skeleton-loader');
    console.log(skeleton);
    skeleton.style.display = 'none';
});