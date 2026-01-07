<template>
  <el-card class="welcome-item-card" shadow="hover" :body-style="{ padding: '20px' }">
    <div class="welcome-item-content">
      <div class="welcome-item-icon">
        <slot name="icon"></slot>
      </div>
      <div class="welcome-item-details">
        <el-divider content-position="left">
          <h3 class="welcome-item-heading">
            <slot name="heading"></slot>
          </h3>
        </el-divider>
        <div class="welcome-item-description">
          <slot></slot>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.welcome-item-card {
  margin-bottom: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.welcome-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.welcome-item-content {
  display: flex;
  gap: 1rem;
}

.welcome-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 12px;
  flex-shrink: 0;
}

.welcome-item-details {
  flex: 1;
}

.welcome-item-heading {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.welcome-item-description {
  color: var(--el-text-color-secondary);
  font-size: 0.95rem;
}

.welcome-item-description a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.welcome-item-description a:hover {
  text-decoration: underline;
}

:deep(.el-divider) {
  margin: 0 0 12px 0;
}
</style>
