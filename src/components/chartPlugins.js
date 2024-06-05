// chartPlugins.js
export const backgroundColorPlugin = {
  id: "backgroundColorPlugin",
  beforeDraw: (chart) => {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;
    ctx.save();

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      ctx.fillStyle = "#2F4F4F";

      chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
        const { x, y: barY, width, height } = bar;
        const radius = 5;
        ctx.beginPath();
        ctx.moveTo(left + radius, barY - height / 2);
        ctx.lineTo(right - radius, barY - height / 2);
        ctx.quadraticCurveTo(
          right,
          barY - height / 2,
          right,
          barY - height / 2 + radius
        );
        ctx.lineTo(right, barY + height / 2 - radius);
        ctx.quadraticCurveTo(
          right,
          barY + height / 2,
          right - radius,
          barY + height / 2
        );
        ctx.lineTo(left + radius, barY + height / 2);
        ctx.quadraticCurveTo(
          left,
          barY + height / 2,
          left,
          barY + height / 2 - radius
        );
        ctx.lineTo(left, barY - height / 2 + radius);
        ctx.quadraticCurveTo(
          left,
          barY - height / 2,
          left + radius,
          barY - height / 2
        );
        ctx.fill();
      });
    });

    ctx.restore();
  },
};
