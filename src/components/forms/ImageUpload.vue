<template>

  <div>
    <a-upload 
      name="image" 
      listType="picture-card" 
      accept=".png, .jpg, .jpeg"
      :beforeUpload="beforeUpload" 
      :action="uploadAction" 
      :headers="uploadHeaders"
      :fileList="uploadFileList"
      :data="uploadData" 
      :showUploadList="true"
      @preview="onPreview"
      @change="onUploadChange">

      <div v-if="uploadFileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">选择图片</div>
      </div>
    </a-upload>

    <a-modal :visible="previewVisible" :footer="null" @cancel="onPreviewCancel">
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>

import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/ls'

const ACTION = process.env.VUE_APP_API_BASE_URL + '/common/upload/image'

export default {
  name: 'ZImageUpload',
  props: {
    imagePath: {
      type: String,
      required: true
    },
    value: String
  },
  data () {
    return {
      uploadFileList: this.value ? [{ uid: -1, name: this.value, status: 'done', url: this.value} ]: [],
      uploadAction: ACTION,
      uploadData: { path: this.imagePath },
      uploadHeaders: { 'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN) },
      previewVisible: false,
      previewImage: '',
    }
  },
  watch: {
    value: function (val, oldVal) {
      if (!val) {
        this.uploadFileList = []
      } else if (Array.isArray(this.uploadFileList) && this.uploadFileList.length > 0) {
        const [file] = this.uploadFileList
        console.log('value => ', val, file)
        if (file.url && file.url != val) {
          this.uploadFileList = val ? [{ uid: -1, name: val, status: 'done', url: val}] : []
        } else if (file.response && file.response.url != val) {
          this.uploadFileList = val ? [{ uid: -1, name: val, status: 'done', url: val}] : []
        } 
      } else {
        this.uploadFileList = val ? [{ uid: -1, name: val, status: 'done', url: val}] : []
      }
    }
  },
  methods: {
    onPreviewCancel() {
      this.previewVisible = false;
    },
    onPreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    onUploadChange(state) {
      console.log('upload change => ', state)
      const { file, fileList, event } = state
      this.uploadFileList = fileList
      if (file.status === 'removed') {
        this.$emit('change', null)
      } else if (file.response && file.response.status === 'done') {
        this.$emit('change', file.response.url)
      } else {
      }
    },
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不能大于 2MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card .ant-upload-btn {
    display: table-cell;
    vertical-align: middle;
    
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;

  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
