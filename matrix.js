function drawTable(size) {
    var tableString = "<table>";
    for (var y = 0; y <= size; y++) {
        var trString = "<tr>";
        for (var x = 0; x <= size; x++) {
            trString = trString + `<td id="${x}-${y}" style="background-color: blue;"></td>`;
        }
        trString = trString + "</tr>";
        tableString = tableString + trString;
    }
    return tableString;
}

function getRandomNumber(lim) {
    return Math.floor(Math.random() * (lim + 1));
}
$(document).ready(function() {
    var gridSize = 75;

    var clockCount = 0;
    var fishBreed = 7;
    var sharkBreed = 20;
    $("#matrixHere").append(drawTable(gridSize));
    var ocean = TAFFY([]);

    function oceanIsClear(xVal, yVal) {
        if (xVal > gridSize || yVal > gridSize) {
            return false;
        }
        if (ocean({
                x: xVal,
                y: yVal
            }).count() !== 0) {
                console.log(`${ocean({
                    x: xVal,
                    y: yVal
                }).first().type} is in the way`);
            return false;
        } else {
            return true;
        }
    }
    var animals = {

        initialPopulate(numSharks, numFish) {
            for (var i = 0; i < numSharks; i++) {
                var randomX = getRandomNumber(gridSize);
                var randomY = getRandomNumber(gridSize);
                if (!oceanIsClear(randomX, randomY)) {
                    debugger;
                } else {
                    insertAnimal("shark", randomX, randomY);
                }
                //$(`#${randomX}-${randomY}`).css("background-color", "red");
            }
            for (var i = 0; i < numFish; i++) {
                var randomX = getRandomNumber(gridSize);
                var randomY = getRandomNumber(gridSize);
                if (!oceanIsClear(randomX, randomY)) {
                    debugger;
                } else {
                    insertAnimal("fish", randomX, randomY);
                }
                //$(`#${randomX}-${randomY}`).css("background-color", "red");
            }
        },
        render: function() {
            // var sharks = ocean({
            //     type: "shark"
            // }).get();
            // console.log(sharks);
            ocean({
                type: "shark"
            }).each(function(shark, recordnumber) {
                $(`#${shark["x"]}-${shark["y"]}`).css("background-color", "red");
            });
            ocean({
                type: "fish"
            }).each(function(fish, recordnumber) {
                $(`#${fish["x"]}-${fish["y"]}`).css("background-color", "green");
            });
        }
    };

    function insertAnimal(typeName, xVal, yVal) {
        var countOfType = ocean({
            type: typeName
        }).count();
        ocean.insert({
            name: `${typeName}_${(countOfType + 1)}`,
            type: typeName,
            x: xVal,
            y: yVal
        });
        //$(`#${xVal}-${yVal}`).fadeOut(10).fadeIn(00);
    }
    function getRandomDirection(xVal, yVal){
        var num = getRandomNumber(3);
        switch (num){
            case 0:
                //up
                //console.log("up");
                return [(xVal), (yVal - 1)];
            case 1:
                //down
                //console.log("down");
                return [(xVal), (yVal + 1)];
            case 2:
                //left
                //console.log("left");
                return [(xVal - 1), (yVal)];
            case 3:
            //console.log("right");
            return [(xVal + 1), (yVal)];
            
        }
    }
    function performCycle() {
        //breed fish
        //for(cnt = 0; cnt < iterations; cnt++){
        clockCount++;
        console.log(clockCount);
        if (clockCount % fishBreed == 0) {
            ocean({
                type: "fish"
            }).each(function(fish, recordnumber) {
                //$(`#${fish["x"]}-${fish["y"]}`).css("background-color", "green");
                //todo improve finding positions
                var randomDirection = getRandomDirection(fish["x"], fish["y"]);
                if (oceanIsClear(randomDirection[0], randomDirection[1])) {
                    //console.log(`breeding fish ${randomDirection[0]} ${randomDirection[1]}`);
                    insertAnimal("fish", randomDirection[0], randomDirection[1]);
                } else {
                    //console.log("ocean aint clear");
                }
            });
        } else {
            // ocean({
            //     type: "fish"
            // }).each(function(fish, recordnumber) {
            //     //$(`#${fish["x"]}-${fish["y"]}`).css("background-color", "green");
            //     //todo improve finding positions
            //     var randomDirection = getRandomDirection(fish["x"], fish["y"]);
            //     if (oceanIsClear(randomDirection[0], randomDirection[0])) {
            //         console.log(`moving fish ${fish["x"] + 1} ${fish["y"]}`);
            //     } else {
            //         console.log("ocean aint clear");
            //     }
            // });
        }
        ocean({
            type: "shark"
        }).each(function(shark, recordnumber) {
            //$(`#${fish["x"]}-${fish["y"]}`).css("background-color", "green");
            //todo improve finding positions
            var randomDirection = getRandomDirection(shark["x"], shark["y"]);
            if (oceanIsClear(randomDirection[0], randomDirection[1])) {
                //console.log(`breeding fish ${randomDirection[0]} ${randomDirection[1]}`);
                //console.log(ocean(shark["___id"]).first());
                var id = shark["___id"];
                // console.log(id);
                ocean().filter({type: "shark", x : shark["x"], y : shark["y"]}).update({x : randomDirection[0], y : randomDirection[1]});
                $(`#${shark["x"]}-${shark["y"]}`).css("background-color", "blue");
               // ocean({type: "shark", x : shark["x"], y : shark["y"]}).remove();
            } else {
                var oType = ocean({ x : randomDirection[0], y : randomDirection[1]}).select("type");
                console.log(`shark obstructed, ${oType} in way`);
            }
        });
       

        //}

    }
    animals.initialPopulate(2, 15);
    setTimeout(function() {
        setInterval(function() {
            performCycle();
            animals.render();
        }, 100);
    }, 1000);
    // setTimeout(function() {
    // }, 500);



});