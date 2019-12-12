function render(data){
  let width  = window.innerWidth,
      height = window.innerHeight,
      margin = { top:70 , left:70 , right:20 , bottom:30 },
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
      // last_updated
      // PopMale
      const color = d3.scaleOrdinal(d3.schemeAccent)
      color.domain(data.map(d => d.PopMale))
      let yValue = data.map( d=> d.PopMale)
      // let xValue = data.map( d=> d.Time )
      let xValue = data.map( d=> d.PopTotal )

      let yScale = d3.scaleLinear().domain([d3.min(yValue),d3.max(yValue)]).range([innerHeight,0])
      let xScale = d3.scaleLinear().domain([d3.min(xValue),d3.max(xValue)]).range([0,innerWidth])
      // let xScale = d3.scaleTime().domain([0,d3.max(xValue)]).range([0,innerWidth])
      let xAxis = d3.axisBottom(xScale)
      let yAxis = d3.axisLeft(yScale)
      let svg = d3.select("#chart").append("svg").attr("viewBox",`0 0 ${width} ${height}`).style("background-color","red")
      let g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",d=>xScale(d.PopTotal))
        .attr("cy",d=>yScale(d.PopMale))
        .attr("r",5)
        .attr("fill",d=>color(d))
      g.append("g").call(xAxis).attr("transform",`translate(0,${innerHeight})`)
      g.append("g").call(yAxis).attr("transform",`translate(0,0)`)
}


d3.csv("data.csv").then(data=>{
  data.forEach(d=>{
    d.PopMale = +d.PopMale;
    d.PopTotal = +d.PopTotal
  })
  render(data)
})
