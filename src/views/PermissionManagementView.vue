<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-2xl font-bold text-surface-800 dark:text-white">权限管理</h2>
      <BaseButton variant="primary" @click="showRoleModal = true">
        <i class="fas fa-plus mr-2"></i>
        添加角色
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <BaseCard title="角色列表" :padding="false" :has-table="true">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">角色名称</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">描述</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">用户数</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">状态</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
                <tr v-for="role in roles" :key="role.id" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="role.iconBg">
                        <i :class="[role.icon, 'text-white text-sm']"></i>
                      </div>
                      <span class="font-medium text-surface-800 dark:text-white">{{ role.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">{{ role.description }}</td>
                  <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">{{ role.userCount }}</td>
                  <td class="px-4 py-3">
                    <BaseTag :variant="role.status === 'active' ? 'success' : 'danger'">
                      {{ role.status === 'active' ? '启用' : '禁用' }}
                    </BaseTag>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <BaseButton variant="ghost" size="sm" @click="handleEditRole(role)">
                        <i class="fas fa-edit"></i>
                      </BaseButton>
                      <BaseButton variant="ghost" size="sm" @click="handleConfigureRole(role)">
                        <i class="fas fa-cog"></i>
                      </BaseButton>
                      <BaseButton variant="ghost" size="sm">
                        <i class="fas fa-trash text-danger-500"></i>
                      </BaseButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>

      <div class="space-y-4">
        <BaseCard title="权限分配">
          <div class="space-y-3">
            <div v-for="(module, index) in permissionModules" :key="index" class="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <i :class="[module.icon, 'text-primary-500']"></i>
                  <span class="font-medium text-surface-800 dark:text-white">{{ module.name }}</span>
                </div>
                <BaseButton variant="ghost" size="sm" @click="module.expanded = !module.expanded">
                  <i :class="['fas transition-transform', module.expanded ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                </BaseButton>
              </div>
              <div v-if="module.expanded" class="space-y-2">
                <label v-for="(perm, pIndex) in module.permissions" :key="pIndex" class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="perm.enabled" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                  <span class="text-sm text-surface-600 dark:text-surface-300">{{ perm.name }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <BaseButton variant="primary" class="w-full">保存权限配置</BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseModal v-model="showRoleModal" title="添加角色">
      <div class="space-y-4">
        <div>
          <label class="label">角色名称</label>
          <input type="text" v-model="newRole.name" class="input" placeholder="请输入角色名称" />
        </div>
        <div>
          <label class="label">角色描述</label>
          <textarea v-model="newRole.description" class="input" rows="3" placeholder="请输入角色描述"></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showRoleModal = false">取消</BaseButton>
          <BaseButton variant="primary" @click="handleAddRole">添加</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseButton from '../components/UI/BaseButton.vue'
import BaseTag from '../components/UI/BaseTag.vue'
import BaseModal from '../components/UI/BaseModal.vue'

const showRoleModal = ref(false)

const newRole = reactive({
  name: '',
  description: ''
})

const roles = ref([
  { id: 1, name: '超级管理员', description: '拥有所有系统权限', icon: 'fa-user-shield', iconBg: 'bg-gradient-to-br from-danger-500 to-danger-400', userCount: 2, status: 'active' },
  { id: 2, name: '管理员', description: '管理系统核心功能', icon: 'fa-user-cog', iconBg: 'bg-gradient-to-br from-primary-600 to-primary-400', userCount: 5, status: 'active' },
  { id: 3, name: '商家', description: '管理店铺和商品', icon: 'fa-store', iconBg: 'bg-gradient-to-br from-success-500 to-success-400', userCount: 12, status: 'active' },
  { id: 4, name: '客服', description: '处理客户咨询和售后', icon: 'fa-headset', iconBg: 'bg-gradient-to-br from-accent-500 to-accent-400', userCount: 8, status: 'active' },
  { id: 5, name: '财务', description: '管理财务和结算', icon: 'fa-wallet', iconBg: 'bg-gradient-to-br from-warning-500 to-warning-400', userCount: 3, status: 'inactive' }
])

const permissionModules = ref([
  { name: '用户管理', icon: 'fa-users', expanded: true, permissions: [
    { name: '查看用户列表', enabled: true }, { name: '添加用户', enabled: true },
    { name: '编辑用户', enabled: true }, { name: '删除用户', enabled: false }
  ]},
  { name: '产品管理', icon: 'fa-box', expanded: false, permissions: [
    { name: '查看产品', enabled: true }, { name: '添加产品', enabled: true },
    { name: '编辑产品', enabled: true }, { name: '删除产品', enabled: false }
  ]},
  { name: '订单管理', icon: 'fa-shopping-cart', expanded: false, permissions: [
    { name: '查看订单', enabled: true }, { name: '处理订单', enabled: true },
    { name: '取消订单', enabled: false }, { name: '退款处理', enabled: false }
  ]},
  { name: '数据统计', icon: 'fa-chart-bar', expanded: false, permissions: [
    { name: '查看统计', enabled: true }, { name: '导出报表', enabled: true }
  ]}
])

const handleEditRole = (role) => {
  console.log('编辑角色:', role)
}

const handleConfigureRole = (role) => {
  console.log('配置权限:', role)
}

const handleAddRole = () => {
  roles.value.push({
    id: roles.value.length + 1,
    name: newRole.name,
    description: newRole.description,
    icon: 'fa-user',
    iconBg: 'bg-gradient-to-br from-surface-500 to-surface-400',
    userCount: 0,
    status: 'active'
  })
  newRole.name = ''
  newRole.description = ''
  showRoleModal.value = false
}
</script>
