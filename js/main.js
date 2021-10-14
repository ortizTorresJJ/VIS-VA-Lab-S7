const _urlData = 'https://www.datos.gov.co/resource/6hgx-q9pi.json'


width = 600
height = 420

var nelementos = 0
var tipoElementos = ["cero"]
var ENuevoElemento = 0
var auxIndex = 0

var NumBarX = 0

var margin = {
    top:100,
    rigth:100,
    bottom:100,
    left:300
}

function NClasses (elemento)
{
    for (let i = 0; i < Object.keys(elemento).length; i++) 
    {
        //console.log("elemento NClasses:")
        //console.log(elemento[i].estado_proyecto)
        ENuevoElemento=1;
        for (let j = 0; j < tipoElementos.length; j++) 
        {
            
            //console.log("tipoElementos j: " + tipoElementos[j] + " j= " + j)
            //if(elemento[i].estado_proyecto!=tipoElementos[j])
            if( elemento[i].estado_proyecto.localeCompare(tipoElementos[j])==0 )//si llega a haber uno igual, quite la ocion de anadir
            {
                ENuevoElemento = 0
            }
        }
        if(ENuevoElemento == 1)
        {
            ENuevoElemento = 1;
            tipoElementos.push(elemento[i].estado_proyecto)
        }
    }
    /*if(ENuevoElemento == 1)
    {
        tipoElementos.push(elemento.estado_proyecto)
        ENuevoElemento = 0
    }*/
    //tipoElementos[0]
    return tipoElementos
}

function addClasses (CLASE)
{
    tipoElementos.push(elemento.estado_proyecto)
}

var getData = (url)=>{
    axios.get(url).then(response=>{
        let data = response.data
        let dataFiltrada = data.filter(d=>d.estado_proyecto == 'FINALIZADO')
        let dataFiltrada2= data.filter(d=>d.estado_proyecto == 'POR EVALUAR')
        let clases = Object.keys(dataFiltrada).length
        let dataVis = dataFiltrada.reduce((l,c)=>{
            l[c.ano_convocatoria] = +c.monto_financiado_ap+(l[c.ano_convocatoria]||0)
            return l
        },{})
        let dataVis2= dataFiltrada2.reduce((l,c)=>{
            l[c.ano_convocatoria] = +c.monto_financiado_ap+(l[c.ano_convocatoria]||0)
            return l
        },{})

        let dataVisComoObjeto = Object.keys(dataVis).map(d=>({anio: d, val:dataVis[d]}))
        let dataVisComoObjeto2= Object.keys(dataVis2).map(d=>({anio: d, val:dataVis2[d]}))
        //console.log(dataVis)

        console.log("Nclases:")
        /*console.log( NClasses([{'estado_proyecto': 'a', 'Hola': 'io'},
        {'estado_proyecto': 'b','k': 'jo'},
        {'estado_proyecto': 'b', 'Hola': 'io'},
        {'estado_proyecto': '2', 'Hola': 'io'},
        {'estado_proyecto': 'ko','k': 'jo'}]) )*/
        console.log( NClasses(data) )
        console.log("hola mundokk")
        console.log("dataFiltrada")
        console.log(dataFiltrada)
        console.log("dataVis como numeros")
        console.log(dataVis)
        console.log("dataVis como Objeto")
        console.log(dataVisComoObjeto)
        console.log("len dataVisComoObjeto")
        console.log(dataVisComoObjeto.length)

        NumBarX = dataVisComoObjeto.length

        VIS(dataVisComoObjeto, dataVisComoObjeto2, "steelblue", "red")
        //VIS(dataVisComoObjeto2, "red")
    })
}

var VIS = (data, data2, colorete, colorete2)=>{
    x = d3.scaleBand()
        .domain(data.map(d => d.anio))
        .rangeRound([margin.left, width - margin.rigth])
    y = d3.scaleLinear()
        //.domain([(d3.max(data, d=>+d.val)), (d3.min(data, d=>+d.val)-100)])
        .domain([(d3.max(data, d=>+d.val)), (0-100)])
        .range([margin.top , height-margin.bottom])

    x2= d3.scaleBand()
        .domain(data2.map(d2 => d2.anio))
        .rangeRound([margin.left, width - margin.rigth])
    y2= d3.scaleLinear()
        //.domain([(d3.max(data, d=>+d.val)), (d3.min(data, d=>+d.val)-100)])
        .domain([(d3.max(data2, d2=>+d2.val)), (0-100)])
        .range([margin.top , height-margin.bottom])

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))

        svg = d3.select(".datavis > svg")
        .attr("id", "datavis")
        .attr("viewBox", [0, 0, width, height])

        svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        .attr("fill", colorete)
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        //.attr("x", (d) => x(d.anio))
        .attr("x", (d) => x(d.anio)-(20/2)+(width/2-margin.rigth)/(2*NumBarX))
        //.attr("y", d => y(+d.val))
        .attr("y", d => y(0))
        .attr("width", 20)
        .transition()
        .duration(4000)
        .attr('y', d => y(d.val))
        //.attr("height", d => y(d3.min(data, d => +d.val) - 100) - y(+d.val))
        .attr("height", d =>  y(height)- y(+d.val))

        /*svg.selectAll('.bars').data([data2]).join('g').attr('class', 'bars')
        .attr("fill", colorete2)
        .selectAll("rect")
        .data(d => d)
        .join("rect")*/
        .attr("x2", (d2) => x2(d2.anio)+(20/2)+(width/2-margin.rigth)/(2*NumBarX))
        .attr("y2", d2 => y2(0))
        .attr("width", 20)
        .transition()
        .duration(4000)
        .attr('y', d2 => y2(d2.val))
        //.attr("height", d => y(d3.min(data, d => +d.val) - 100) - y(+d.val))
        .attr("height", d2 =>  y2(height)- y2(+d2.val))

        /*svg.selectAll('.bars').data([data2]).join('g').attr('class', 'bars')
        .attr("fill", colorete2)
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        //.attr("x", (d) => x(d.anio))
        .attr("x", (d) => x(d.anio)+(20/2)+(width/2-margin.rigth)/(2*NumBarX))
        //.attr("y", d => y(+d.val))
        .attr("y", d => y(0))
        .attr("width", 20)
        .transition()
        .duration(4000)
        .attr('y', d => y(d.val))
        //.attr("height", d => y(d3.min(data, d => +d.val) - 100) - y(+d.val))
        .attr("height", d =>  y(height)- y(+d.val))*/

    svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
        .call(xAxis)
    
    svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
        .call(yAxis)
}

getData(_urlData)