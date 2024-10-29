    
// Set up dimensions and margins
const margin = { top: 60, right: 30, bottom: 100, left: 60 }; // Increased top margin for title
const width = 1200 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create an SVG container within the #barchart div
const svg = d3.select("#barchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add a title to the chart
svg.append("text")
    .attr("x", width / 2) // Center horizontally
    .attr("y", -20) // Position above the plot area
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text("Popularity of the Name Amanda Over Time");

// Load the CSV file
d3.csv("name-data.csv")
    .then(data => {
        // Transform data to work with Amanda's column
        const filteredData = data.map(d => ({
            year: d.year,
            count: +d["Amanda"] // Access the "Amanda" column directly
        }));

        // Set up x-scale and y-scale
        const xScale = d3.scaleBand()
            .domain(filteredData.map(d => d.year))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.count)])
            .nice()
            .range([height, 0]);

        // Append bars to the SVG for each data point
        svg.selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.count))
            .attr("fill", "steelblue");

        // Add x-axis with reduced tick marks
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues(
                xScale.domain().filter((d, i) => i % 10 === 0) // Show every 10 years
            ))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-65)");

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(10));

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 40)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
            .text("Count");
    })
    .catch(error => {
        console.error("Error loading or processing the CSV file:", error);
    });
