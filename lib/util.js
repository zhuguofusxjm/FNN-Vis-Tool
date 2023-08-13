function test() {

    alert("111111111111")

}

function changeDirection() {
    d3.json("output.json").then(function(data) {
    // 神经网络数据
    const neuralNetwork = data.neuralNetwork;

    // 交换SVG的宽度和高度
    const svg = d3.select("#neural-network");
    const originalWidth = +svg.attr("width");
    const originalHeight = +svg.attr("height");
    svg.attr("width", Math.max(originalWidth, originalHeight) )
       .attr("height", Math.max(originalWidth, originalHeight));

    // 调整节点和连接线的位置
    const nodes = svg.selectAll("circle")
        .attr("cx", d => d.y) // 将原本的 x 属性改为 y
        .attr("cy", d => d.x); // 将原本的 y 属性改为 x

    const links = svg.selectAll("line")
        .attr("x1", d => neuralNetwork[d.source].y)
        .attr("y1", d => neuralNetwork[d.source].x)
        .attr("x2", d => neuralNetwork[d.target].y)
        .attr("y2", d => neuralNetwork[d.target].x);

    // 在每个节点旁边添加文本标签显示名字
    const nodelabels = svg.selectAll("text")
        .attr("x", d => d.y) // 将原本的 x 属性改为 y
        .attr("y", d => d.x); // 将原本的 y 属性改为 x
    });
}

function updateVisualization(jsonFile) {
    svg.selectAll("circle").remove()
    svg.selectAll("line").remove()
    svg.selectAll(".node-label").remove()
    d3.json(jsonFile).then(function(data) {
        // 神经网络数据
        const neuralNetwork = data.neuralNetwork;

        // 创建连接
        const connections = data.connections;

        // 计算SVG的宽度和高度
        const maxX = d3.max(neuralNetwork, d => d.x);
        const maxY = d3.max(neuralNetwork, d => d.y);
        const svgWidth = maxX + margin.left + margin.right + nodeRadius * 2;
        const svgHeight = maxY + margin.top + margin.bottom + nodeRadius * 2;

        svg.attr("width", svgWidth)
           .attr("height", svgHeight);

        const bodyElement = document.body;
        bodyElement.style.height = svgHeight + "px";

        // 创建节点和连接
        const nodes = svg.selectAll("circle")
            .data(neuralNetwork)
            .enter()
            .append("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 15)
            .style("fill", "white")
            .style("stroke", d => colorMap[d.layer])
            .style("stroke-width", 3); // 添加点击事件处理函数

        // 创建连接线
        const links = svg.selectAll("line")
            .data(connections)
            .enter()
            .append("line")
            .attr("x1", d => neuralNetwork[d.source].x)
            .attr("y1", d => neuralNetwork[d.source].y)
            .attr("x2", d => neuralNetwork[d.target].x)
            .attr("y2", d => neuralNetwork[d.target].y)
            .style("stroke", "gray")
            .style("stroke-width", 2);


        // 遮盖掉连接线
        const nodeCircles = svg.selectAll("circle");
        nodeCircles.raise(); // 提升圆圈的层级，遮盖住连接线

        // 在每个节点旁边添加文本标签显示名字
        const nodeLabels = svg.selectAll(".node-label")
            .data(neuralNetwork)
            .enter()
            .append("text")
            .attr("class", "node-label")
            .attr("x", d => d.x) // 水平位置与节点一致
            .attr("y", d => d.y+30)
            .attr("dy", "0.35em") // 调整垂直对齐以使文本垂直居中
            .attr("text-anchor", "middle") // 设置文本的水平对齐方式为中心对齐
            .style("fill", "black") // 设置文本颜色
            .text((d, i) => d.name)
            .style("opacity", 1); // 初始状态下文本标签可见

        // 添加点击事件处理函数
        nodes.on("click", (event, d) => handleNodeClick(event, d, connections));
//        nodeLabels.on("mouseover", (event, d) => handleNodeMouseOver(event, d, connections));
//        nodeLabels.on("mouseout", (event, d) => handleNodeMouseOut(event, d, connections));

        // 移除多余的节点
        nodes.exit().remove();
        links.exit().remove();
    });
}


function handleNodeClick(event, d, connections) {
    const svg = d3.select("#neural-network");
    const nodeCircles = svg.selectAll("circle");

    // 1.获取相邻的节点
    const connectedNodesIndices = connections
        .filter(connection => connection.source === d.index || connection.target === d.index)
        .map(connection => connection.source === d.index ? connection.target : connection.source);
    //带上本节点
    connectedNodesIndices.push(d.index);

    // 2.获取与节点相关的连接线
    const connectedLinks = connections.filter(connection => {
        return connectedNodesIndices.includes(connection.source) || connectedNodesIndices.includes(connection.target);
    });

    // 3.更新连接线的样式
    const links = svg.selectAll("line")
    links.style("stroke", link => {
        return connectedNodesIndices.includes(link.source) && connectedNodesIndices.includes(link.target) ? "gray" : "white";
    });

    // 4.将相关的连接线置于顶层
    svg.selectAll("line").filter(connection => {
        return connectedNodesIndices.includes(connection.source) || connectedNodesIndices.includes(connection.target);
    }).raise();

    // 5.更新节点样式
    const nodes = svg.selectAll("circle")
    nodes.style("stroke-width", node => {
        if (d.index == node.index) {
            return 5;
        } else {
            return 2; // 置灰色
        }
    });
    nodes.style("stroke", node => {
        if (connectedNodesIndices.includes(node.index)) {
            return colorMap[node.layer];
        } else {
            return "gray"; // 置灰色
        }
    }).raise();
    nodes.classed("selected", node => connectedNodesIndices.includes(node.index)).raise();

    // 6.将相邻文本显示出来，其它隐藏
    svg.selectAll(".node-label").style("opacity", 0.2);
    svg.selectAll(".node-label")
        .filter(nodelabel => connectedNodesIndices.includes(nodelabel.index)).style("opacity", 1);

    // 7.更新文本标签的遮盖顺序
    const nodeLabels = svg.selectAll(".node-label")
    nodeLabels.raise();
}

// 处理节点鼠标悬停事件
function handleNodeMouseOver(event, d, connections) {
    // 获取相邻的节点
    const connectedNodesIndices = connections
        .filter(connection => connection.source === d.index || connection.target === d.index)
        .map(connection => connection.source === d.index ? connection.target : connection.source);
    //带上本节点
    connectedNodesIndices.push(d.index);

    svg.selectAll(".node-label")
        .filter(nodelabel => connectedNodesIndices.includes(nodelabel.index)).style("opacity", 1)

    // 获取相邻节点的调剂信息，您可以自行定义获取信息的方式
    const adjacentsInfo = connectedNodesIndices.map(index => {
        return `Node ${index}: Adjacent Info`; // 替换为您的相邻节点信息
    });

    // 创建一个提示框并设置其内容
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .html(adjacentsInfo.join("<br>")); // 将相邻节点信息以换行符连接

    // 显示提示框
    tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
}

// 处理节点鼠标移出事件
function handleNodeMouseOut(event, d, connections) {
    // 获取相邻的节点
    const connectedNodesIndices = connections
        .filter(connection => connection.source === d.index || connection.target === d.index)
        .map(connection => connection.source === d.index ? connection.target : connection.source);
    //带上本节点
    connectedNodesIndices.push(d.index);

    svg.selectAll(".node-label")
        .filter(nodelabel => connectedNodesIndices.includes(nodelabel.index)).style("opacity", 0)
}