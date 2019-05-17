function statSpiderGraph() {
    
    //console.log(dataList[0].dexterity);

    var str = monster.strength;
    var dex = monster.dexterity;
    var con = monster.constitution;
    var int = monster.intelligence;
    var wis = monster.wisdom;
    var cha = monster.charisma;

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