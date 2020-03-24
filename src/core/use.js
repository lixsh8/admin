import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/settings'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import VueClipboard from 'vue-clipboard2'
import 'ant-design-vue/dist/antd.less'

// ...
import MultiTab from '@/components/parts/MultiTab'
import PageLoading from '@/components/parts/PageLoading'
import FormModal from '@/components/forms/FormModal'
import ZForm from '@/components/forms/Form'

// ...
import Auth from './auth'
import './filter'

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
Vue.use(VueCropper)
Vue.use(Auth)

Vue.component(FormModal.name, FormModal)
Vue.component(ZForm.name, ZForm)
