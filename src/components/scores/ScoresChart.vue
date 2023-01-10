<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'

const props = defineProps({})

const chartElem = ref<HTMLElement>()

function drawChart(): void {
  const data = [
    {
      series: 'Emma',
      data: [
        { x: 'Q1', y: 1 },
        { x: 'Q2', y: 1 },
        { x: 'Q3', y: 2 },
        { x: 'Q4', y: 3 },
        { x: 'Q5', y: 3 },
        { x: 'Q6', y: 4 },
        { x: 'Q7', y: 5 },
        { x: 'Q8', y: 5 },
        { x: 'Q9', y: 6 },
        { x: 'Q10', y: 7 },
      ],
      shape: 'circle',
    },
    {
      series: 'Laura',
      data: [
        { x: 'Q1', y: 0 },
        { x: 'Q2', y: 1 },
        { x: 'Q3', y: 1 },
        { x: 'Q4', y: 2 },
        { x: 'Q5', y: 3 },
        { x: 'Q6', y: 3 },
        { x: 'Q7', y: 4 },
        { x: 'Q8', y: 5 },
        { x: 'Q9', y: 6 },
        { x: 'Q10', y: 6 },
      ],
      shape: 'circle',
    },
  ]

  // @ts-ignore
  const svg = d3.select(chartElem.value).append('svg').attr('width', 800).attr('height', 600)

  const xScale = d3
    .scalePoint()
    .domain(data[0].data.map((d) => d.x))
    .range([0, 800])

  const yScale = d3.scaleLinear().domain([0, data[0].data.length]).range([600, 0])

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  data.forEach((seriesData) => {
    // @ts-ignore
    const lineGenerator = d3
      .line<{ x: string; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))

    lineGenerator.curve(d3.curveBumpX)

    const path = svg
      .append('path')
      .attr('d', lineGenerator(seriesData.data))
      .attr('stroke', colorScale(seriesData.series))
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-dasharray', function () {
        return this.getTotalLength()
      })
      .attr('stroke-dashoffset', function () {
        return this.getTotalLength()
      })

    const t = d3.transition().duration(5000).ease(d3.easeCubicOut)

    const shape = svg.append(seriesData.shape).attr('r', 5).attr('fill', colorScale(seriesData.series))

    path.transition(t).attr('stroke-dashoffset', 0)

    shape.transition(t).attrTween('transform', function () {
      return function (t) {
        const point = path.node()!.getPointAtLength(t * path.node()!.getTotalLength())
        return `translate(${Math.min(point.x, 795)}, ${point.y})`
      }
    })
  })

  const xAxis = d3.axisBottom(xScale)

  svg.append('g').attr('transform', `translate(0, 600)`).call(xAxis)

  const yAxis = d3.axisLeft(yScale)

  svg.append('g').attr('transform', `translate(0, 0)`).call(yAxis)
}

onMounted(() => {
  drawChart()
})
</script>

<template>
  <div id="chart" ref="chartElem" />
</template>

<style lang="scss" scoped>
.Chart {
}
</style>
