import "./styles.css";
import { create, select } from "d3";

document.getElementById("app").innerHTML = `
<h1>Truchet Tiles Experiment</h1>
<div>
  For more information, please check
  <a href="https://en.wikipedia.org/wiki/Truchet_tiles" target="_blank" rel="noopener noreferrer">here</a>.
</div>
<div style="margin:20px;width:100%; display:flex; justify-content:space-around;" id="tiles"></div>
<div style="display:flex; flex-direction:column; align-items:center;" id="container">
<span><canvas style="max-width:700px;" id="canvas" height="720px" width="720px"/></span>
</div>
`;
const dimension = 700;
const pxSize = 4;
const xToY = (x) => (y) => x - y;
const xToY8 = xToY(8);
const levels = [25, 50, 75];

levels.forEach((ele) =>
  select("#tiles")
    .append("span")
    .append("svg")
    .attr("width", 100)
    .attr("height", 100)
    .append("polygon")
    .attr("points", `0,100 100,100 ${ele},${100 - ele} 0,0 `)
    .attr("fill", "#BF0000")
);

const svg = select("#container")
  .append("span")
  .append("svg")
  .attr("width", dimension)
  .attr("height", dimension);
const svg2 = select("#container")
  .append("span")
  .append("svg")
  .attr("width", dimension)
  .attr("height", dimension);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.crossOrigin = "anonymous";
img.src =
  "https://images.unsplash.com/photo-1661041524618-220a2a2b8b74?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80";
img.onload = () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = "none";
  console.log("Image loaded");
  console.log(picker(ctx, 500, 500));

  let hslMat = new Array(dimension).fill([]);
  for (let x = 0; x < hslMat.length; x += pxSize) {
    hslMat[x] = new Array(dimension);
    for (let y = 0; y < hslMat[x].length; y += pxSize) {
      hslMat[x][y] = picker(ctx, x, y);
    }
  }

  for (let x = 0; x < dimension; x += pxSize) {
    for (let y = 0; y < dimension; y += pxSize) {
      let lum = 0;

      if (hslMat[x][y] < 0.25) lum = 0.25;
      else if (hslMat[x][y] >= 0.25 && hslMat[x][y] < 0.75) lum = 0.5;
      else lum = 0.75;

      svg
        .append("polygon")
        .attr(
          "points",
          `${x},${y + pxSize} ${x + pxSize},${y + pxSize} ${
            x + pxSize * (1 - lum)
          },${y + pxSize * lum} ${x},${y} `
        )
        .attr("fill", `rgba(0,0,0,1)`);
      svg2
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 2)
        .attr("fill", `rgba(0,0,0,${1 - hslMat[x][y]})`);
    }
  }
};

function picker(ctx, x, y) {
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;
  const max = Math.max(...data.slice(0, 3));
  const min = Math.min(...data.slice(0, 3));
  const avg = (max + min) / 2;

  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  return avg / 255;
}
