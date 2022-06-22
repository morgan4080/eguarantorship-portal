<script setup lang="ts">
import * as d3 from 'd3';
import {toRefs, defineProps, ref} from "vue";

const props = defineProps<{
  width: number,
  height: number,
  data: number[]
}>()

const { width, height, data } = toRefs(props);

const targetD3 = ref(null)

if (targetD3.value) {
  (() => {
    let svg = d3.select(targetD3.value)
    let width: any = svg.attr('width')
    let height: any = svg.attr('height')
    let radius = Math.min(width, height) / 2
    let g = svg.append('g').attr('transform', "translate(" + width / 2 + "," + height / 2 +")")
    // create ordinal scale
    let color = d3.scaleOrdinal(['#e40303', '#ff8c00', '#008026','#004dff', '#750787']);
    // create pie
    let pie = d3.pie()
    // create arc
    let arc: any = d3.arc()
        .innerRadius(radius/2)
        .outerRadius(radius)
    // create arcs
    let arcs = g.selectAll('arc')
        .data(pie(data.value))
        .enter().append('g')
        .attr('class', 'arc')
    // append path
    arcs.append('path')
        .attr('fill', (d, i: any) => color(i))
        .attr('d', arc);
    let textContainer = g.append('g');
    let text = textContainer.append('text');
    text.attr("transform", function() {
      let centroid = arc.centroid({startAngle: ((radius/2)+radius)/2, endAngle: ((radius/2)+radius)/2})
      return "translate(" + centroid[0] + "," + 0 + ")";
    }).attr('class', 'text-sm fill-eg-bg').text(`${data.value[0]}%`);
  })()
}

</script>
<template>
  <svg ref="targetD3" :width="width" :height="height"></svg>
</template>
