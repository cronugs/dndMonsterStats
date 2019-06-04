function statSpiderGraph() {

    var str = monster.strength;
    var dex = monster.dexterity;
    var con = monster.constitution;
    var int = monster.intelligence;
    var wis = monster.wisdom;
    var cha = monster.charisma;

    spidy = new RGraph.Radar({
        id: 'cvs',
        data: [str, dex, con, int, wis, cha],
        options: {
            tooltips: [
                'Strength ' + str, 'Dexterity ' + dex,
                 'Constitution ' + con, 'Intelligence ' + int, 
                 'Wisdom ' + wis, 'Charisma ' + cha
            ],
            backgroundCirclesPoly: true,
            backgroundCirclesSpacing: 30,
            colors: ['transparent'],
            axesColor: 'transparent',
            highlights: true,
            colorsStroke: ['yellow'],
            linewidth: 2,
            labels: ['Strength ' + str, 'Dexterity ' + dex, 'Constitution ' + con,
             'Intelligence ' + int, 'Wisdom ' + wis, 'Charisma ' + cha],
            //labelsAxes: 'e',
            labelsAxesColor: 'black',
            textSize: 12,
            textColor: 'white',
            //clearto: 'white',
            labelsAxesBoxed: false,
            labelsAxesBoxedZero: true,
            textAccessible: false,
            textAccessibleOverflow: 'visible'
            
        }
    }).grow();  
    

}