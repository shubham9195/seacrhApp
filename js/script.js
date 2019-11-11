let pageCount = 1
var timeLeft = 30;
var elem = document.getElementById('timer');
var timerId = setInterval(countdown, 1000);
let searched;
let refresh;
var interval
function refreshFunc(stop) {
     interval = setInterval(() => {
        refresh = true;
        searchFun();
    }, 30000);
}
function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        refreshFunc();
    } else if (searched) {
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
    }
}
function searchFun() {
    clearInterval(interval)
    timeLeft = 30;
    const query = document.getElementById('searchInput').value
    if (query) {
        document.getElementById('row').innerHTML = "";
            refreshFunc();
        search(query, pageCount)
    }
}
async function search(query, pageCount) {
    var apiData = await getData(query, pageCount);
    if (apiData.articles) {
        searched = true
        console.log('check data ', apiData.articles);
        apiData.articles.map((item, index) => {
            console.log('check data', item.title);
            let src
            if (item.urlToImage !== null) {
                src = item.urlToImage
            }
            else {
                src = 'http://static1.squarespace.com/static/582f2a75414fb5c5d7172211/t/5ba29eacb8a045e82a32378a/1537384155646/blank-thumbnail.jpg?format=1500w';
            }
            document.getElementById('row').innerHTML += `<div class="column" id="imgList"><img src=${src} width="100" height="50"/><p class="description"><a target="_blank" class= "link" href=${item.url}>${item.title}</a></p></div>`
        })

    }
}
async function getData(query, pageCount) {
    try {
        var apiData = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=44c1f90dde454be693c048b711c354dc&pageSize=10&page=${pageCount}`)
        return apiData.json();
    } catch (err) {
        console.log('Error in api request', err);
    }
}
var debounce_timer;
let onScroll = window.onscroll = function () {
    if (debounce_timer) {
        window.clearTimeout(debounce_timer);
    }
    debounce_timer = window.setTimeout(function () {
        refresh = false
        pageCount++;
        search();
        console.log('onscroll', pageCount);
    }, 1000);
};
window.addEventListener('scroll', onScroll);