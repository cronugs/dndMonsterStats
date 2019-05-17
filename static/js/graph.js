function statSpiderGraph() {
    
    //console.log(dataList[0].dexterity);

    var str = dataList[index].strength;
    var dex = dataList[index].dexterity;
    var con = dataList[index].constitution;
    var int = dataList[index].intelligence;
    var wis = dataList[index].wisdom;
    var cha = dataList[index].charisma;

    var data = [str, dex, con, int, wis, cha];

    //console.log(data[4].attribute);

    new RGraph.Radar({
        id: 'cvs',
        data: [str, dex, con, int, wis, cha],
        options: {
            tooltips: [
                'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'
            ],
            backgroundCirclesPoly: true,
            backgroundCirclesSpacing: 30,
            colors: ['transparent'],
            axesColor: 'transparent',
            highlights: true,
            colorsStroke: ['yellow'],
            linewidth: 2,
            labels: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'],
            labelsAxes: 'e',
            labelsAxesColor: 'black',
            textSize: 12,
            textColor: 'white',
            //clearto: 'white',
            labelsAxesBoxed: false,
            labelsAxesBoxedZero: false
        }
    }).grow();

    function clearRadar() {
        RGraph.Radar.clear();
    }

}