$(function () {
    'use strict';
    // HEADER: Adjust Slider Height
    var windowHeigh = $(window).height();
    //var upperH = $('.upper-bar').innerHeight();
    var navH = $('.navbar').innerHeight();
    $('.slider, .carousel-item').height(windowHeigh - navH);
});
// // ++++++++++++++++++++++++++ End Change the Color if the link is clicked ++++++++++++++++++++++++++++++++++++++++++//

// ++++++++++++++++++++++++++++++ Start scroll from navbar to the determined element +++++++++++++++++++++++++++++++//
$('.nav-item .westerwald').click(function () {

    $('html, body').animate({

        scrollTop: $('.west').offset().top

    }, 1000);
});

$('.nav-item .anwendun').click(function () {

    $('html, body').animate({

        scrollTop: $('.anwend').offset().top

    }, 1000);
});

$('.nav-item .exakte').click(function () {

    $('html, body').animate({

        scrollTop: $('.exakt').offset().top

    }, 1000);
});

$('.nav-item .heuristische').click(function () {

    $('html, body').animate({

        scrollTop: $('.heuristi').offset().top

    }, 1000);
});

$('.nav-item .observat').click(function () {

    $('html, body').animate({

        scrollTop: $('.observ').offset().top

    }, 1000);
});

$('.nav-impl #ssudoku').click(function () {

    $('html, body').animate({

        scrollTop: $('.mySudoku').offset().top

    }, 1000);
});

// ++++++++++++++++++++++++++++++ Start Select Algorithmen +++++++++++++++++++++++++++++++++
var expanded = false;

function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

/*
* In this methods send a list of Algorithms to Java Server in order to implement this selected Algorithms and send it
* back using AJAX.
*/

function submitSelectedAlgorithms() {
    /* declare an checkbox array */
    var chkArray = [];
    let mNumber;
    let selected;
    /* look for all checkboxes that have a class 'chk' attached to it and check if it was checked */
    $(".chk:checked").each(function () {
        chkArray.push($(this).val());
    });
    if (chkArray.length === 0) {
        Swal.fire({
            type: "warning",
            title: "Ankreuzen",
            text: "Bitte mindestens eines der Checkboxen anzreuzen",
        })
    } else if (chkArray.includes("Backtracking")) {

        mNumber = prompt(" geben Sie für den Backtracking-Algorithmus Anzahl der m Farben ein:",);

        if (is_natural(mNumber)) {
            if (mNumber == null || mNumber === "") {
                alert("Sie haben den Vorgang abgebrochen");
            } else {
                chkArray.push(mNumber);
                console.log(chkArray);
            }
        }
        selected = JSON.stringify(chkArray);
        console.log(selected);
        sendAlgorithms(selected);
    } else {
        selected = JSON.stringify(chkArray);
        var a = sendAlgorithms(selected);
        console.log(a);
    }
}

// Initialise sigma and Create Graph with help of Sigma Library
function createGraph(myObject) {
    // Initialise sigma:
    var s = new sigma(
        {
            renderer: {
                container: document.getElementById("sigmaContainer"),
                type: 'canvas'
            },
            settings: {
                edgeLabelSize: 'proportional',
                minArrowSize: 10
            }
        }
    );

    // Generate a random graph:
    var graph = {
        nodes: [],
        edges: []
    };
    var edge = myObject.graph.edges;
    for (i = 0; i < myObject.graph.V; i++) {
        graph.nodes.push({
            id: i,
            label: 'Node ' + i,
            x: Math.random(),
            y: Math.random(),
            size: 1,
            color: '#EE651D'
        });
    }

    var idd = 0;
    for (j = 0; j < edge.length; j++) {
        for (i = 0; i < edge[j].length; i++) {
            graph.edges.push({
                id: idd,
                // label: 'Edge ' +idd,
                source: '' + j,
                target: '' + edge[j][i],
                color: '#cd0000',
                type: 'curvedArrow',
            });
            console.log(edge[j][i]);
            ++idd;
        }
    }

    // load the graph
    s.graph.read(graph);
    // draw the graph
    s.refresh();
    // launch force-atlas for 5sec
    s.startForceAtlas2();
    window.setTimeout(function () {
        s.killForceAtlas2()
    }, 100);
}

function fillGraph(myGraph) {
    var graph = myGraph;
    console.log(graph);
}

function sendAlgorithms(selected) {
    let x = "";

    $.ajax({
        contentType: "application/json",
        type: "POST",
        data: selected,
        url: "/check",
        success: function (data) {

            if (isJson(data)) {
                let myObj = JSON.parse(data);

                fillGraph(myObj.graph);
                let y = "";
                x = "<div>" + "<hr>";
                x += "<h4>" + "Das Ergebnis der Implementierung der Algorithmen:" + "</h4>";
                for (var i = 0; i < myObj.algorithms.length; i++) {
                    if (myObj.algorithms[i].numberColors === 0) {
                        y += "<p>" + "Der Graph mit " + myObj.algorithms[i].algorithm + " kann nicht gefärbt werden" + "</p>";
                        myObj.algorithms[i].numberColors = "null";
                        myObj.algorithms[i].usedColors = "null";
                        myObj.algorithms[i].coloredNodes = "null";
                    } else
                        y += "<p>" + "Es wird für " + myObj.algorithms[i].algorithm + " " + myObj.algorithms[i].numberColors +
                            " Farben gebraucht." + "</p>"
                }
                x += "<p>" + y + "</p>";
                x += "<b>" + "<a " + " id = " + "showJsonText " + " onclick=" + "showAndHide()" + " >" + "Das ganze Ergebnis in JSON Format anzeigen"
                    + "</a>" + "</b>";
                x += "<pre>" + JSON.stringify(myObj, null, '\t') + "</pre>";
                x += "<b>" + "<a " + " id = " + "showJsonTh " + " onclick=" + "hide()" + " >" + "</a>" + "</b>";
                x += "<hr>" + "</div>";
                document.getElementById("showmyjson").innerHTML = x;
                // createGraph(myObj);

            } else
                document.getElementById("showmyjson").innerHTML = "<h3>" + data + "!" + "</h3>";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error while post to java');
        }
    });
    // return myObjectt;
}

function showAndHide() {

    document.getElementsByTagName('pre')[0].style.display =
        (document.getElementsByTagName('pre')[0].style.display !== "block") ?
            "block" : "none";
    if (document.getElementsByTagName('pre')[0].style.display === "block") {
        document.getElementById("showJsonText").innerText = "Das Ergebnis ausblenden"
        document.getElementById("showJsonTh").innerText = "Das Ergebnis ausblenden"
    } else {
        document.getElementById("showJsonText").innerText = "Das ganze Ergebnis in JSON Format anzeigen"
        document.getElementById("showJsonTh").innerText = ""
    }
}

function hide() {
    document.getElementsByTagName('pre')[0].style.display =
        (document.getElementsByTagName('pre')[0].style.display !== "block") ?
            "none" : "";
    document.getElementById("showJsonTh").innerText = ""
    document.getElementById("showJsonText").innerText = "Das ganze Ergebnis in JSON Format anzeigen"
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// ++++++++++++++++++++++++++++++ End Select Algorithmen ++++++++++++++++++++++++++++++++++++++++++++++++++++//
// ++++++++++++++++++++++++++++++ Start Show Graph +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function myFunction() {
    var x = document.getElementById("sigmaContainerParent");
    document.getElementById("sigmaContainer").innerHTML = "";
    if (x.style.display === "none" && document.getElementById('graphAnzeigen').firstChild.data === "Anzeigen") {
        x.style.display = "block";
        document.getElementById('graphAnzeigen').firstChild.data = "Ausblenden";
    } else {
        x.style.display = "none";
        document.getElementById('graphAnzeigen').firstChild.data = "Anzeigen";
    }
}

// +++++++++++++++++++++++++++++++++++ End hide Graph +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// +++++++++++++++++++++++++++++++++++ Start Susoku +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

function generateSudoku() {

    var grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    var hGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    shuffle(grid);
    hideTiles(grid, hGrid);

    this.getTileNumber = function (row, col) {
        return hGrid[row][col];
    };
}

function shuffle(grid) {

    let i, j, k, temp, col, col1, col2,
        row1, row2, sub, sub1, sub2, num1, num2;

    //swap the same columns of each subsquare
    for (i = 0; i < 25; i++) {
        col = Math.floor(Math.random() * 3);
        sub1 = Math.floor(Math.random() * 3);
        sub2 = Math.floor(Math.random() * 3);
        for (j = 0; j < grid.length; j++) {
            temp = grid[j][col + sub1 * 3];
            grid[j][col + sub1 * 3] = grid[j][col + sub2 * 3];
            grid[j][col + sub2 * 3] = temp;
        }
    }

    //swap all columns within each subsquare
    for (i = 0; i < 25; i++) {
        sub = Math.floor(Math.random() * 3);
        col1 = Math.floor(Math.random() * 3);
        col2 = Math.floor(Math.random() * 3);
        while (col1 === col2) col2 = Math.floor(Math.random() * 3);
        for (j = 0; j < grid.length; j++) {
            temp = grid[j][sub * 3 + col1];
            grid[j][sub * 3 + col1] = grid[j][sub * 3 + col2];
            grid[j][sub * 3 + col2] = temp;
        }
    }

    //swap all rows within each subsquare
    for (i = 0; i < 25; i++) {

        sub = Math.floor(Math.random() * 3);
        row1 = Math.floor(Math.random() * 3);
        row2 = Math.floor(Math.random() * 3);
        while (row1 === row2) row2 = Math.floor(Math.random() * 3);
        for (j = 0; j < grid.length; j++) {
            temp = grid[sub * 3 + row1][j];
            grid[sub * 3 + row1][j] = grid[sub * 3 + row2][j];
            grid[sub * 3 + row2][j] = temp;
        }
    }

    //swap one number with another
    for (i = 0; i < 25; i++) {
        num1 = Math.floor(Math.random() * 9 + 1);
        num2 = Math.floor(Math.random() * 9 + 1);
        while (num1 === num2) num2 = Math.floor(Math.random() * 9 + 1);
        for (j = 0; j < grid.length; j++) {
            for (k = 0; k < grid[j].length; k++) {
                if (grid[j][k] === num1)
                    grid[j][k] = num2;
                else if (grid[j][k] === num2)
                    grid[j][k] = num1;
            }
        }
    }
}

function hideTiles(aGrid, hiddenGrid) {
    // Randomly hide tiles, no guarantee for a unique solution
    let numTiles, k;

    for (var c = 0; c < 9; c++) {
        for (var d = 0; d < 9; d++) {
            hiddenGrid[c][d] = aGrid[c][d];
        }
    }

    for (var i = 0; i < 4; i++) {
        numTiles = Math.floor(Math.random() * 8 + 6);
        while (numTiles > 0) {
            k = Math.floor(Math.random() * 9);
            hiddenGrid[i][k] = 0;
            hiddenGrid[8 - i][8 - k] = 0;
            numTiles--;
        }
    }

    numTiles = Math.floor(Math.random() * 4 + 2);
    while (numTiles > 0) {
        k = Math.floor(Math.random() * 4);
        hiddenGrid[4][k] = 0;
        hiddenGrid[4][8 - k] = 0;
        numTiles--;
    }
}

function generateMyOwn() {

    var hGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    this.getTileNumber = function (row, col) {
        return hGrid[row][col];
    };
}

function is_natural(s) {
    if (s === "") {
        return true;
    } else {
        let n = parseInt(s);
        return n > 0 && n.toString() === s;
    }
}

function isNatural(s) {
    if (s === "") {
        return true;
    } else {
        let n = parseInt(s);
        return n > 0 && n < 10 && n.toString() === s;
    }
}

function isValid(arraySolution) {

    for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {

            let value = arraySolution[y][x];
            if (isNatural(value)) {
                if (value) {
                    // Check the line
                    for (let x2 = 0; x2 < 9; ++x2) {
                        if (x2 !== x && arraySolution[y][x2] === value) {
                            return false;
                        }
                    }

                    // Check the column
                    for (let y1 = 0; y1 < 9; ++y1) {
                        if (y1 !== y && arraySolution[y1][x] === value) {
                            return false;
                        }
                    }

                    // Check the square
                    let startY = Math.floor(y / 3) * 3;
                    for (let y2 = startY; y2 < startY + 3; ++y2) {
                        let startX = Math.floor(x / 3) * 3;
                        for (x2 = startX; x2 < startX + 3; ++x2) {
                            if ((x2 !== x || y2 !== y) && arraySolution[y2][x2] === value) {
                                return false;
                            }
                        }
                    }
                }
            } else {
                return false;
            }
        }
    }
    return true;
}
