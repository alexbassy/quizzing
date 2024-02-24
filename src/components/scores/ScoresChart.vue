<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { useSubscription } from '@vueuse/rxjs'
import { combineLatest, concat, distinctUntilChanged, fromEvent, map, of, switchMap, throttleTime } from 'rxjs'
import { group } from 'radash'
import useRound from '@/composable/useRound'
import { getPlayableQuestions$ } from '@/lib/store/client'
import { QuestionEntry, QuestionType } from '@/lib/store/db'
import { onMounted$ } from '@/composable/useObservable'
import { getTransformation } from '@/lib/d3-helpers'
import getChartData, { ScoreDataPoint, ScoresData } from './getChartData'

const chartContainerElement = ref<HTMLElement>()
const chartElement = ref<HTMLElement>()

const round$ = useRound()

const noPoints = ref<boolean | null>(null)

const chartData$ = round$.pipe(map(round => round?.id), distinctUntilChanged(), switchMap((id) => (id ? getChartData(id) : of([]))))

const questionsInRound$ = round$.pipe(
  switchMap((round) => (round?.quizId ? getPlayableQuestions$(round.quizId) : of([])))
)

useSubscription(
  combineLatest([chartData$, questionsInRound$]).subscribe(([chartData, questions]) => {
    if (!chartData.length) {
      noPoints.value = true
      return
    }
    noPoints.value = null
    const playableQuestions = questions.filter((q) => q.type !== QuestionType.Category)
    drawChart(chartData, playableQuestions)
  })
)

const chartWidth = ref(450)
const chartHeight = ref(450)

let container: d3.Selection<SVGSVGElement, unknown, null, any>

function getContainerSize() {
  if (!chartElement.value) return
  const { width, height } = chartElement.value.getBoundingClientRect()
  chartWidth.value = width
  chartHeight.value = height
  chartContainerElement.value!.style.minHeight = `${height}px`
}

useSubscription(
  concat(onMounted$(), fromEvent(window, 'resize'))
    .pipe(throttleTime(100, undefined, { leading: true }))
    .subscribe(getContainerSize)
)

function drawSvg(): void {
  if (!chartElement.value) return
  container = d3.select(chartElement.value).append('svg')
  updateSvgElement()
}

function updateSvgElement(): void {
  container.attr('viewBox', `0 0 ${chartWidth.value} ${chartHeight.value}`)
}

onMounted(() => {
  drawSvg()
})

function drawChart(data: ScoresData[], questions: QuestionEntry[]): void {
  getContainerSize()
  updateSvgElement()

  const X_MARGIN = 50

  const xScale = d3
    .scalePoint()
    .domain(questions.map((q) => q.id!))
    .range([0, chartWidth.value - X_MARGIN * 2])

  // this should be the number of questions?
  const yScale = d3
    .scaleLinear()
    .domain([0, 20])
    .range([chartHeight.value - 50, 0])

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  // Draw clip path for avatar
  const avatarSize = 40
  container
    .append('clipPath')
    .attr('id', 'clipCircle')
    .append('circle')
    .attr('cx', avatarSize / 2)
    .attr('cy', avatarSize / 2)
    .attr('r', avatarSize / 2)

  const playersWithSameScore = group(data, (d) => d.score)

  data.forEach((seriesData) => {
    // @ts-ignore
    const lineGenerator = d3
      .line<ScoreDataPoint>()
      .x((d) => xScale(d.questionId))
      .y((d) => yScale(d.score))

    lineGenerator.curve(d3.curveBumpX)

    const path = container
      .append('path')
      .attr('d', lineGenerator(seriesData.data))
      .attr('stroke', colorScale(seriesData.series))
      .attr('stroke-width', 4)
      .attr('fill', 'none')
      .attr('stroke-dasharray', (_d, i, nodes) => nodes[i].getTotalLength())
      .attr('stroke-dashoffset', (_d, i, nodes) => nodes[i].getTotalLength())

    const t = d3.transition().duration(5000).ease(d3.easeCubicOut)

    // Make the circle an avatar here
    // const shape = container.append('circle').attr('r', 10).attr('fill', colorScale(seriesData.series))

    // create a group and within a circle 4px bigger than the avatar to serve as a border
    const avatarGroup = container.append('g').classed('playerAvatar', true)

    avatarGroup
      .append('circle')
      .attr('cx', avatarSize / 2)
      .attr('cy', avatarSize / 2)
      .attr('r', avatarSize / 2 + 4)
      .attr('fill', colorScale(seriesData.series))

    // add the avatar to the group
    if (seriesData.player.photo) {
      avatarGroup
        .append('image')
        .attr('xlink:href', URL.createObjectURL(seriesData.player.photo))
        .attr('width', avatarSize)
        .attr('height', avatarSize)
        .attr('clip-path', 'url(#clipCircle)')
    } else {
      avatarGroup
        .append('circle')
        .attr('cx', avatarSize / 2)
        .attr('cy', avatarSize / 2)
        .attr('r', avatarSize / 2)
        .attr('fill', colorScale(seriesData.series))
    }

    // Animate the line going across the page
    path.transition(t).attr('stroke-dashoffset', 0)

    avatarGroup
      .transition(t)
      .attrTween('transform', () => (t) => {
        const avatarOffset = -avatarSize / 2
        let { x, y } = path.node()!.getPointAtLength(t * path.node()!.getTotalLength())
        x += avatarOffset
        y += avatarOffset
        return `translate(${Math.min(x, chartWidth.value - 5)}, ${y})`
      })
      .on('end', function () {
        // if any avatars have the same score, push them to the right
        if (playersWithSameScore[seriesData.score]) {
          const index =
            playersWithSameScore[seriesData.score]!.findIndex((d) => d.player.id === seriesData.player.id) ??
            0
          d3.timeout(() => {
            const transform = getTransformation(avatarGroup.attr('transform'))
            const offsetX = index * ((avatarSize + 8) * -1)

            const interpolate = d3.interpolateTransformSvg(
              `translate(${transform.translateX}, ${transform.translateY})`,
              `translate(${transform.translateX + offsetX}, ${transform.translateY})`
            )

            avatarGroup
              .transition()
              .duration(500)
              .attrTween('transform', () => (t) => interpolate(t))
          })
        }
      })
  })

  d3.selectAll('.playerAvatar').raise()

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickValues([])

  container
    .append('g')
    .attr('transform', `translate(0, ${chartHeight.value - 50})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(yScale)

  container.append('g').attr('transform', `translate(0, 0)`).call(yAxis)
}
</script>

<template>
  <div class="w-full h-full">
    <div v-if="noPoints === null" ref="chartContainerElement" class="scoresChartContainer">
      <div id="chart" ref="chartElement" class="scoresChart" />
    </div>

    <div v-else class="w-full h-full flex flex-column align-items-center justify-content-center">
      <i class="pi pi-chart-bar text-6xl mb-3" />
      No points to display
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scoresChartContainer {
  width: 100%;
  height: calc(100vh - var(--create-header-height) - 2rem);
  margin: 2rem;
}

.scoresChart {
  width: 100%;
  height: 100%;
}
</style>
