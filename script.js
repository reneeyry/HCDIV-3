const fullData = [
    { "Year": 2018, "Town": "BEDOK", "ResalePrice": 432483.60 },
    { "Year": 2018, "Town": "CLEMENTI", "ResalePrice": 579110.64 },
    { "Year": 2018, "Town": "GEYLANG", "ResalePrice": 521626.54 },
    { "Year": 2018, "Town": "TAMPINES", "ResalePrice": 433655.52 },
    { "Year": 2019, "Town": "BEDOK", "ResalePrice": 426143.42 },
    { "Year": 2019, "Town": "CLEMENTI", "ResalePrice": 530723.11 },
    { "Year": 2019, "Town": "GEYLANG", "ResalePrice": 513336.08 },
    { "Year": 2019, "Town": "TAMPINES", "ResalePrice": 442787.44 },
    { "Year": 2020, "Town": "BEDOK", "ResalePrice": 444349.37 },
    { "Year": 2020, "Town": "CLEMENTI", "ResalePrice": 565492.73 },
    { "Year": 2020, "Town": "GEYLANG", "ResalePrice": 547268.10 },
    { "Year": 2020, "Town": "TAMPINES", "ResalePrice": 450558.00 },
    { "Year": 2021, "Town": "BEDOK", "ResalePrice": 488178.00 },
    { "Year": 2021, "Town": "CLEMENTI", "ResalePrice": 639688.00 },
    { "Year": 2021, "Town": "GEYLANG", "ResalePrice": 589537.00 },
    { "Year": 2021, "Town": "TAMPINES", "ResalePrice": 487412.00 },
    { "Year": 2022, "Town": "BEDOK", "ResalePrice": 508718.00 },
    { "Year": 2022, "Town": "CLEMENTI", "ResalePrice": 657930.00 },
    { "Year": 2022, "Town": "GEYLANG", "ResalePrice": 597186.00 },
    { "Year": 2022, "Town": "TAMPINES", "ResalePrice": 535050.00 },
    { "Year": 2023, "Town": "BEDOK", "ResalePrice": 572050.00 },
    { "Year": 2023, "Town": "CLEMENTI", "ResalePrice": 671117.00 },
    { "Year": 2023, "Town": "GEYLANG", "ResalePrice": 640617.00 },
    { "Year": 2023, "Town": "TAMPINES", "ResalePrice": 577373.00 },
    { "Year": 2024, "Town": "BEDOK", "ResalePrice": 592193.00 },
    { "Year": 2024, "Town": "CLEMENTI", "ResalePrice": 723283.00 },
    { "Year": 2024, "Town": "GEYLANG", "ResalePrice": 771971.00 },
    { "Year": 2024, "Town": "TAMPINES", "ResalePrice": 636474.00 }
];

const margin = { top: 50, right: 100, bottom: 50, left: 80 };
const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear()
    .domain([2018, 2024])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([400000, 800000])
    .range([height, 0]);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(7).tickFormat(d3.format("d")));

svg.append("g")
    .call(d3.axisLeft(yScale).ticks(8).tickFormat(d => d / 1000 + "k"));

const line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.ResalePrice));

const tooltip = d3.select("#tooltip");

const groupedData = d3.groups(fullData, d => d.Town);

groupedData.forEach(([key, values]) => {
    svg.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", colorScale(key))
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.selectAll(`circle-${key}`)
        .data(values)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.ResalePrice))
        .attr("r", 4)
        .attr("fill", colorScale(key))
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 10 + "px")
                .html(`<strong>${d.Town}</strong><br>Year: ${d.Year}<br>Price: SGD ${d.ResalePrice.toLocaleString()}`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
});

const legend = svg.selectAll(".legend")
    .data(groupedData.map(d => d[0]))
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width + 20},${i * 20})`);

legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", d => colorScale(d));

legend.append("text")
    .attr("x", 15)
