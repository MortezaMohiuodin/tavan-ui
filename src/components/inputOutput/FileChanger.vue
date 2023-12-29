<template>
  <v-dialog-extend
    v-model="isVisible"
    width="600"
  >
    <div class="tw-relative md:tw-p-4">
      <v-btn
        variant="text"
        icon="custom:close"
        size="x-small"
        class="tw-absolute tw-top-0 tw-right-0"
        @click="isVisible = false"
      />
      <div class="tw-min-h-[350px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-relative tw-rounded-2xl tw-mt-5">
        <Cropper
          ref="cropper"
          :src="file"
          :stencil-props="{
            handlers: {},
            movable: false,
            scalable: true,
          }"
          :resize-image="{
            adjustStencil: true,
          }"
          :default-size="defaultSize"
          image-restriction="stencil"
          class="tw-h-[350px] tw-w-full tw-border tw-border-[#e7e7e7] tw-rounded-2xl"
        />
        <div
          v-if="noImage"
          class="tw-h-full tw-w-full tw-bg-white md:tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-absolute tw-cursor-pointer tw-rounded-2xl"
          @click="noImage ? input.click() : ''"
        >
          عکس مورد نظر را اضافه کنید
        </div>
      </div>
      <div class="tw-flex tw-justify-center tw-mt-4">
        <v-btn
          icon="fa-solid fa-magnifying-glass-plus"
          variant="outlined"
          rounded="5"
          size="x-small"
          class="tw-ml-2"
          @click="zoomIn"
        />
        <v-btn
          icon="fa-solid fa-magnifying-glass-minus"
          variant="outlined"
          rounded="5"
          size="x-small"
          class="tw-ml-2"
          @click="zoomOut"
        />
        <v-btn
          icon="custom:flipHorizontal"
          variant="outlined"
          rounded="5"
          size="x-small"
          class="tw-ml-2"
          @click="flipX"
        />
        <v-btn
          icon="custom:flipVertical"
          variant="outlined"
          rounded="5"
          size="x-small"
          class="tw-ml-2"
          @click="flipY"
        />
        <v-btn
          icon="fa-solid fa-rotate-right"
          variant="outlined"
          rounded="5"
          size="x-small"
          class="tw-ml-2"
          @click="rotate"
        />
      </div>
      <div class="tw-flex tw-justify-center tw-mt-6">
        <v-btn
          variant="outlined"
          size="large"
          class="tw-w-[150px] tw-ml-4"
          rounded="xl"
          @click="input.click()"
        >
          <span>انتخاب عکس</span>
          <input
            ref="input"
            type="file"
            :accept="accept"
            class="tw-absolute tw-top-0 tw-left-0 tw-w-0 tw-h-0 tw-opacity-0 tw-hidden"
            @change="chooseFile"
          >
        </v-btn>
        <v-btn
          color="secondary"
          variant="flat"
          size="large"
          class="tw-ml-[4px] tw-w-[150px]"
          rounded="xl"
          @click="submit"
        >
          تایید
        </v-btn>
      </div>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { Cropper } from 'vue-advanced-cropper'
import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"
import 'vue-advanced-cropper/dist/style.css'
import { bytesToSize } from "@/helper/utility"

const props = defineProps({
  value: { type: [String, Object], default: '' },
  show: { type: Boolean, default: false },
  accept: { type: String, default: 'image/(jpeg|jpg|png)' },
})

let emit = defineEmits(['update:show', 'change'])

let isVisible = ref(false)

let image = ref({
  src: null,
  name: null,
  type: null,
  size: null,
})

const cropper = ref(null)
const input = ref(null)

const file = ref(null)

watch(
  () => props.show,
  show => {
    isVisible.value = show
  }, { immediate: true },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

watch(() => props.value,
  val => {
    if (!props.value) reset()
    if (typeof val === 'string') {
      file.value = val
      URLToFile(val)
    }
  }, { immediate: true })

const noImage = computed(() => {
  return !file.value
})

function submit() {
  if (noImage.value) return

  const { canvas } = cropper.value.getResult()

  canvas.toBlob(async blob => {
    emit('change', blob, image.value.name, image.value.size, image.value.type)
    isVisible.value = false
  }, image.value.type)
}

function URLToFile(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      if (image.value.src) URL.revokeObjectURL(image.value.src)
      image.value.src = blob
      image.value.size = bytesToSize(blob.size, false)
      image.value.type = blob.type.split('/')[1]
      image.value.name = `File.${image.value.type}`
      emit('change', blob, image.value.name, image.value.size, image.value.type)
    })
}

function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4)
  let header = ''
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16)
  }
  switch (header) {
  case '89504e47':
    return 'png'
  case '47494638':
    return 'gif'
  case 'ffd8ffe0':
  case 'ffd8ffe1':
  case 'ffd8ffe2':
  case 'ffd8ffe3':
  case 'ffd8ffe8':
    return 'jpeg'
  default:
    return fallback
  }
}

function chooseFile(event) {

  const { files } = event.target

  if (files && files[0]) {
    if (image.value.src) URL.revokeObjectURL(image.value.src)
    const blob = URL.createObjectURL(files[0])
    const reader = new FileReader()

    reader.onload = e => {
      file.value = blob
      image.value.src = blob
      image.value.name = files[0].name
      image.value.size = bytesToSize(files[0].size, false)
      image.value.type = getMimeType(e.target.result, files[0].type)

      if (image.value.type === 'application/pdf') {
        image.value.type = 'pdf'
        let file = new Blob([image.value.src], { type: image.value.type })
        emit('change', file, image.value.name, image.value.size, image.value.type)
        isVisible.value = false
      }
    }
    reader.readAsArrayBuffer(files[0])

  }
}

function reset() {
  image.value.src = null
  image.value.name = null
  image.value.type = null
  image.value.size = null
  file.value = null
}

function defaultSize({ imageSize, visibleArea }) {
  return {
    width: (visibleArea || imageSize).width,
    height: (visibleArea || imageSize).height,
  }
}

function zoomIn() {
  cropper.value.zoom(2)
}

function zoomOut() {
  cropper.value.zoom(0.5)
}

function rotate() {
  cropper.value.rotate(90)
}

function flipX() {
  cropper.value.flip(true, false)
}

function flipY() {
  cropper.value.flip(false, true)
}
</script>
