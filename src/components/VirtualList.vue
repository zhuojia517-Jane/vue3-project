<template>
  <div
    ref="containerRef"
    class="vl-container"
    :style="{ height: containerHeight ? containerHeight + 'px' : '100%' }"
    @scroll="onScroll"
  >
    <div
      class="vl-phantom"
      :style="{ height: totalHeight + 'px', position: 'relative' }"
    >
      <div
        v-for="item in visibleItems"
        :key="item.__data[itemKey]"
        class="vl-item"
        :style="{
          position: 'absolute',
          top: itemTop(item) + 'px',
          left: itemLeft(item) + 'px',
          width: itemWidth + 'px',
          height: itemHeight + 'px',
        }"
      >
        <slot name="item" :item="item.__data" :index="item.__index">
          {{ item.__data }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemHeight: {
    type: Number,
    default: 340
  },
  itemWidth: {
    type: Number,
    default: 230
  },
  containerHeight: {
    type: Number,
    default: 600
  },
  buffer: {
    type: Number,
    default: 3
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  gap: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['loadMore'])

const containerRef = ref(null)
const scrollTop = ref(0)

const { width: containerWidth } = useElementSize(containerRef)

const cols = computed(() => {
  if (!containerWidth.value) return 1
  return Math.max(1, Math.floor((containerWidth.value + props.gap) / (props.itemWidth + props.gap)))
})

const rows = computed(() => {
  if (!props.items.length) return 0
  return Math.ceil(props.items.length / cols.value)
})

const totalHeight = computed(() => {
  return rows.value * props.itemHeight + Math.max(0, rows.value - 1) * props.gap
})

const itemsWithIndex = computed(() => {
  return props.items.map((item, index) => ({
    __index: index,
    __data: item
  }))
})

const visibleRange = computed(() => {
  const startRow = Math.max(0, Math.floor(scrollTop.value / (props.itemHeight + props.gap)) - props.buffer)
  const endRow = Math.min(
    rows.value,
    Math.ceil((scrollTop.value + props.containerHeight) / (props.itemHeight + props.gap)) + props.buffer
  )
  return { startRow, endRow }
})

const visibleItems = computed(() => {
  const { startRow, endRow } = visibleRange.value
  const startIndex = startRow * cols.value
  const endIndex = Math.min(endRow * cols.value, props.items.length)
  return itemsWithIndex.value.slice(startIndex, endIndex)
})

const itemTop = (item) => {
  const row = Math.floor(item.__index / cols.value)
  return row * (props.itemHeight + props.gap)
}

const itemLeft = (item) => {
  const col = item.__index % cols.value
  return col * (props.itemWidth + props.gap)
}

const onScroll = () => {
  scrollTop.value = containerRef.value.scrollTop
  checkLoadMore()
}

const checkLoadMore = () => {
  const el = containerRef.value
  if (!el) return
  const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  if (scrollBottom < props.itemHeight * 2) {
    emit('loadMore')
  }
}

watch(() => props.items.length, () => {
  checkLoadMore()
})

let prevItemsRef = null
watch(() => props.items, (newItems) => {
  if (prevItemsRef && newItems.length < prevItemsRef.length) {
    scrollTop.value = 0
    if (containerRef.value) containerRef.value.scrollTop = 0
  }
  prevItemsRef = newItems
}, { deep: false })

</script>

<style scoped>
.vl-container {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.vl-container::-webkit-scrollbar {
  width: 6px;
}

.vl-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
