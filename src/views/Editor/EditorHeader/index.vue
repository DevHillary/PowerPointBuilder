<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconFolderClose /> <span class="text">file</span></div>
        <template #overlay>
          <Menu>
            <FileInput accept=".pptist"  @change="files => importSpecificFile(files)">
              <MenuItem>import pptist file</MenuItem>
            </FileInput>
            <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => importPPTXFile(files)">
              <MenuItem>import pptx file（demo）</MenuItem>
            </FileInput>
            <MenuItem @click="setDialogForExport('pptx')">Export file</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> <span class="text">Edit</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">undo</MenuItem>
            <MenuItem @click="redo()">redo</MenuItem>
            <MenuItem @click="createSlide()">Add a page</MenuItem>
            <MenuItem @click="deleteSlide()">Delete the page</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ gridLineSize ? 'Close the grid lines' : 'Open the grid lines' }}</MenuItem>
            <MenuItem @click="toggleRuler()">{{ showRuler ? 'Close the scale' : 'Open the scale' }}</MenuItem>
            <MenuItem @click="resetSlides()">Reset the slides</MenuItem>
            <MenuItem @click="openSelectPanel()">{{ showSelectPanel ? 'Close the selection panel' : 'Open the selection panel' }}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconPpt /> <span class="text">demo</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">From the very beginning</MenuItem>
            <MenuItem @click="enterScreening()">Starting from the current page</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconHelpcenter /> <span class="text">help</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="goLink('https://training.ratemyservice.co.ke/')">feedback</MenuItem>
            <MenuItem @click="goLink('https://training.ratemyservice.co.ke/')">Common problems</MenuItem>
            <MenuItem @click="hotkeyDrawerVisible = true">shortcuts</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="export">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconShare size="18" fill="#666" />
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="The slide show">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="19" fill="#666" style="margin-top: 1px;" />
        </div>
      </Tooltip>
      <a href="" target="https://training.ratemyservice.co.ke/_blank">
        <div class="menu-item"><Icongithub size="18" fill="#666" /></div>
      </a>
    </div>

    <Drawer
      width="320"
      placement="right"
      :closable="false"
      :visible="hotkeyDrawerVisible"
      @close="hotkeyDrawerVisible = false"
    >
      <HotkeyDoc />
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="Being imported..." />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useImport from '@/hooks/useImport'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import {
  Tooltip,
  Dropdown,
  Menu,
  Drawer,
} from 'ant-design-vue'
const MenuItem = Menu.Item

const mainStore = useMainStore()
const { gridLineSize, showRuler, showSelectPanel } = storeToRefs(mainStore)

const { enterScreening, enterScreeningFromStart } = useScreening()
const { createSlide, deleteSlide, resetSlides } = useSlideHandler()
const { redo, undo } = useHistorySnapshot()
const { importSpecificFile, importPPTXFile, exporting } = useImport()

const setDialogForExport = mainStore.setDialogForExport

const toggleGridLines = () => {
  mainStore.setGridLineSize(gridLineSize.value ? 0 : 50)
}

const toggleRuler = () => {
  mainStore.setRulerState(!showRuler.value)
}

const openSelectPanel = () => {
  if (!showSelectPanel.value) mainStore.setSelectPanelState(true)
  else mainStore.setSelectPanelState(false)
}

const hotkeyDrawerVisible = ref(false)

const goLink = (url: string) => window.open(url)
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;

  .text {
    margin-left: 4px;
  }
}

.left .menu-item:hover {
  background-color: #f9f9f9;
}
</style>