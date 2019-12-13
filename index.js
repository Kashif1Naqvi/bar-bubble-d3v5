function render(data){
  let width  = window.innerWidth,
      height = window.innerHeight,
      margin = { top:140 , left:130 , right:150 , bottom:30 },
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
      let selectedData = ['PopMale','PopFemale','PopTotal']
      let select = d3.select("#selectedData")
        select.selectAll("option")
          .data(selectedData)
            .enter()
              .append("option")
              .attr("value",function(d,i){
                return d
              })
              .text(function(d,i){
                return d
              });

      const color = d3.scaleOrdinal(d3.schemeSet1).domain(data.map(d => d.PopFemale))


      let yValue = data.map( d=> d.PopTotal)
      let xValue = data.map( d=> d.Time)




      var z = d3.scaleSqrt().domain([200,200000001]).range([1,11]);




      let xScale = d3.scaleTime().domain([d3.min(xValue), d3.max(xValue)]).range([0,innerWidth])



      let yScale = d3.scaleLinear().domain([d3.min(yValue),d3.max(yValue)]).range([innerHeight,0]).nice()



      let xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).ticks(25)
      let yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).ticks(25)
      let line  = d3.line()
                    .x(d=>xScale(d.Time))
                    .y(d=>yScale(d.PopFemale))

      let svg = d3.select("#chart").append("svg").attr("viewBox",`0 0 ${width} ${height}`)
      let g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      let tooltip =d3.select("#chart").append("g").attr("transform",`translate(0,${height/2  })`).attr("class","tooltips")

      g.append("path")
        .attr("d",line(data))
        .attr("stroke","lightcoral")
        .attr("fill","none")
  let text = g.append("text").attr("transform",`translate(0,${-innerHeight})`).text("Hello world")
  let circle =  g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",d=>xScale(d.Time))
        .attr("cy",d=>yScale(d.PopTotal))
        .attr("r",d => z(d.PopTotal))
        .attr("fill",d=>color(d))
        .attr("opacity",.9)
        .on("mouseover",function(d,i){
            tooltip.html(`
              <div>
                <p>Location:<br>${d.Location}</p>
                <hr>
                <p>Population By</p>
                 <li>Male:${Math.round(d.PopMale)}</li>
                 <li>Female:${Math.round(d.PopFemale)}</li>
                <li>Total:${Math.round(d.PopTotal)}</li>
              </div>`)
                    .style("top",  (d3.event.pageY ) + "px")
                    .style("left",(d3.event.pageX + 10 )+ "px")
                  })

                  .on("mouseout",function(d,i){
                    tooltip.html("")
                  })
        // g.selectAll("text")
        //  .data(data)
        //  .enter()
        //  .append("text")
        //  .attr("x",d=>xScale(d.Time))
        //  .attr("y",d=>yScale(d.PopFemale))
        //  .text(d=>d.text)
        //  .attr("text-anchor","middle")
        //  .attr("fill","blue")

  let xGroup=    g.append("g").call(xAxis).attr("transform",`translate(0,${innerHeight})`)
  let yGroup=    g.append("g").call(yAxis).attr("transform",`translate(0,0)`).attr("class","yAxis")
      xGroup.select(".domain").remove()
      yGroup.selectAll('.domain').remove()
      function update(selectedData){
        let dataFilter  = data.map(function(d){
          return {
            Time : d.Time,
            value:d[selectedData]
          }
        })

        circle.data(dataFilter).transition()
              .duration(1000)
              .attr("cx",d=>xScale(d.Time))
              .attr("cy",d=>yScale(d.value))

              // .attr("r",d => z(d.value))

      }
      d3.select("#selectedData")
        .on("change",function(d,i){
         let dataObject = d3.select(this).property("value")
            update(dataObject)
        })
}

d3.csv("data.csv").then(data=>{
  data.forEach(d=>{
      d.PopMale = +d.PopMale
      d.PopFemale = +d.PopFemale
      d.popTotal = +d.PopTotal
      d.Time = new Date(d.Time)

  })
  render(data)
})
