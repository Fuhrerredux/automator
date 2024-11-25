<!-- <template>
  <div class="relative w-full h-96 bg-gray-100 border border-gray-300">
    <canvas
      ref="canvas"
      class="absolute top-0 left-0 w-full h-full"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @contextmenu="handleContextMenu"
      @dblclick="addBox"
      @wheel="handleWheel"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const boxes = ref<{ x: number; y: number; width: number; height: number; text: string }[]>([]);
const selectedBoxIndices = ref<Set<number>>(new Set());
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);


// Grid parameters
const GRID_SIZE = 20; // Size of each grid cell in pixels
const ZOOM_FACTOR = 1.1; // Zoom factor


const isContextMenuOpen = ref(false);

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    if (ctx.value) {
      resizeCanvas();
      draw();
    }
  }
});


watch(boxes, () => draw(), { deep: true });

const resizeCanvas = () => {
  if (canvas.value) {
    canvas.value.width = canvas.value.clientWidth;
    canvas.value.height = canvas.value.clientHeight;
  }
};

const snapToGrid = (value: number) => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};


const draw = () => {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

    // Apply zoom and pan transformations
    ctx.value.save();
    ctx.value.translate(panX.value, panY.value);
    ctx.value.scale(zoomLevel.value, zoomLevel.value);

    // Draw grid lines
    ctx.value.strokeStyle = '#ddd';
    ctx.value.lineWidth = 0.5;
    for (let x = 0; x < canvas.value!.width / zoomLevel.value; x += GRID_SIZE) {
      ctx.value.beginPath();
      ctx.value.moveTo(x, 0);
      ctx.value.lineTo(x, canvas.value!.height / zoomLevel.value);
      ctx.value.stroke();
    }
    for (let y = 0; y < canvas.value!.height / zoomLevel.value; y += GRID_SIZE) {
      ctx.value.beginPath();
      ctx.value.moveTo(0, y);
      ctx.value.lineTo(canvas.value!.width / zoomLevel.value, y);
      ctx.value.stroke();
    }

    // Draw boxes on top of the grid
    boxes.value.forEach((box, index) => {
      ctx.value!.beginPath();
      ctx.value!.rect(box.x, box.y, box.width, box.height);
      ctx.value!.strokeStyle = selectedBoxIndices.value.has(index) ? '#00f' : '#000';
      ctx.value!.lineWidth = selectedBoxIndices.value.has(index) ? 2 : 1;
      ctx.value!.stroke();
      ctx.value!.fillStyle = '#fff';
      ctx.value!.fill();
      ctx.value!.fillStyle = '#000';
      ctx.value!.fillText(box.text, box.x + 5, box.y + 15);
    });

    ctx.value.restore(); // Restore the context to default
  }
};

const handleMouseDown = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const x = (event.clientX - rect.left) / zoomLevel.value - panX.value;
  const y = (event.clientY - rect.top) / zoomLevel.value - panY.value;

  if (event.ctrlKey || event.metaKey) {
    const boxIndex = boxes.value.findIndex(
      (box) => x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height
    );

    if (boxIndex !== -1) {
      if (selectedBoxIndices.value.has(boxIndex)) {
        selectedBoxIndices.value.delete(boxIndex);
      } else {
        selectedBoxIndices.value.add(boxIndex);
      }
      draw();
    }
  } else {
    const boxIndex = boxes.value.findIndex(
      (box) => x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height
    );

    if (boxIndex !== -1) {
      selectedBoxIndices.value.clear();
      selectedBoxIndices.value.add(boxIndex);
      dragStartX.value = x - boxes.value[boxIndex].x;
      dragStartY.value = y - boxes.value[boxIndex].y;
      isDragging.value = true;
    } else {
      selectedBoxIndices.value.clear();
      draw();
    }
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value && selectedBoxIndices.value.size > 0) {
    const rect = canvas.value!.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoomLevel.value - panX.value;
    const y = (event.clientY - rect.top) / zoomLevel.value - panY.value;

    selectedBoxIndices.value.forEach(index => {
      const box = boxes.value[index];
      box.x = snapToGrid(x - dragStartX.value);
      box.y = snapToGrid(y - dragStartY.value);
    });

    draw();
  } else if (event.buttons === 1) { // Left mouse button held for panning
    const rect = canvas.value!.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoomLevel.value;
    const y = (event.clientY - rect.top) / zoomLevel.value;

    panX.value += x - dragStartX.value;
    panY.value += y - dragStartY.value;

    dragStartX.value = x;
    dragStartY.value = y;

    draw();
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  const zoomAmount = event.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
  zoomLevel.value *= zoomAmount;

  // Ensure zoom level stays within reasonable bounds
  zoomLevel.value = Math.max(0.1, Math.min(10, zoomLevel.value));

  // Adjust pan position to keep the mouse cursor in the same place
  const rect = canvas.value!.getBoundingClientRect();
  const x = (event.clientX - rect.left) / zoomLevel.value - panX.value;
  const y = (event.clientY - rect.top) / zoomLevel.value - panY.value;

  panX.value -= x * (zoomAmount - 1);
  panY.value -= y * (zoomAmount - 1);

  draw();
};

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault(); // Prevent the default context menu
  isContextMenuOpen.value = true; // Set flag to true to prevent selection logic
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    items: [
      {
        label: "Edit Text",
        onClick: () => {
          editText();
        }
      },
      {
        label: "Remove",
        onClick: () => {
          removeSelectedBoxes();
        }
      }
    ]
  });
};

const addBox = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const boxWidth = 100;
  const boxHeight = 60;
  const boxText = 'New Box';

  boxes.value.push({
    x: snapToGrid(x - boxWidth / 2),
    y: snapToGrid(y - boxHeight / 2),
    width: boxWidth,
    height: boxHeight,
    text: boxText
  });
  draw();
};

const removeSelectedBoxes = () => {
  if (selectedBoxIndices.value.size > 0) {
    // Convert Set to Array, sort in descending order to remove higher indices first
    const indices = Array.from(selectedBoxIndices.value).sort((a, b) => b - a);
    indices.forEach(index => boxes.value.splice(index, 1));
    selectedBoxIndices.value.clear();
    draw();
  }
};

const editText = () => {
  if (selectedBoxIndices.value.size === 1) {
    const index = Array.from(selectedBoxIndices.value)[0];
    const newText = prompt("Enter new text:", boxes.value[index].text);
    if (newText !== null) {
      boxes.value[index].text = newText;
      draw();
    }
  }
};

</script>

 -->
