//D3 Scripting Part

//Get tooltip
const tooltip = document.getElementById('tooltip');

//Create a function that create our SVG element after awaiting fetching of both JSON data
async function createSVG() {
    const movieSales = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
        .then(res => res.json())
        .catch(err => console.log(err))
    // Object containing information of Movie Sales
    //Format: {"name": "Movies", "children": [{  "name": "Action", "children": [{ "name": "Avatar ", "category": "Action",  "value": "760505847" }, .....}
    //Roots and childrens.

    //Color Scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    format = d3.format(",d");
    //Define width and height of SVG and create under #container
    const width = 954;
    const height = 570;
    const svg = d3.select('#container').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'white');

    const treemap = d3.treemap()
        .size([width, height])
        .paddingInner(1);
      
      const root = d3.hierarchy(movieSales)
        .sum(d => d.value)
        .sort((a, b) =>  (b.height - a.height || b.value - a.value));
      
      treemap(root);
      
      const leaf = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`);
      
      leaf.append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category))
        .on('mouseover', (d, i) => {
            
          const { name, category, value } = d.data;
          tooltip.classList.add('show');
          tooltip.style.left = (d3.event.pageX - 170) + 'px';
          tooltip.style.top = (d3.event.pageY - 150) + 'px';
          tooltip.setAttribute('data-value', value);
    
          tooltip.innerHTML = `
            <p>Name: ${name}</p>
            <p>Category: ${category}</p>
            <p>Value: ${value}</p>
          `;
      }).on('mouseout', () => {
        tooltip.classList.remove('show');
      });
    
      leaf.append('text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 15 + i * 15)
        .text(d => d)
      
      const categories = root.leaves()
        .map(n => n.data.category)
        .filter((item, index, self) => self.indexOf(item) === index);
    
      // create the legend
      const blockSize = 20;
      const legendWidth = 200;
      const legendHeight = (blockSize + 2) * categories.length;
      
      const legend = d3.select('#legend')
        .append('svg')
        .attr('id', 'legend')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
       
      legend.selectAll('rect')
        .data(categories)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('fill', d => color(d))
        .attr('x', blockSize / 2)
        .attr('y', (_, i) => i * (blockSize + 1) + 10)
        .attr('width', blockSize)
        .attr('height', blockSize)
       
       legend.append('g')
          .selectAll('text')
          .data(categories)
          .enter()
          .append('text')
          .attr('fill', 'black')
          .attr('x', blockSize * 2)
          .attr('y', (_, i) => i * (blockSize + 1) + 25)
          .text(d => d)
}

//Run function
createSVG();

//Reference: Choropleth(https://observablehq.com/@d3/choropleth) by Mike Bostock
//Choropleth V5(https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f) by Adam Janes
//Florin Pop youtube video
