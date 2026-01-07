// 帮助中心模拟数据

export const faqs = [
  { 
    id: 1, 
    question: '如何重置密码？', 
    answer: '您可以通过登录页面的"忘记密码"链接重置密码。系统会向您的注册邮箱发送重置链接，点击链接即可设置新密码。', 
    isOpen: false 
  },
  { 
    id: 2, 
    question: '如何添加新用户？', 
    answer: '在"用户管理"页面，点击"添加用户"按钮，填写用户信息并设置角色和权限，点击保存即可添加新用户。', 
    isOpen: false 
  },
  { 
    id: 3, 
    question: '如何导出数据？', 
    answer: '在各个管理页面，您可以找到"导出"按钮，点击后选择导出格式（如Excel、CSV等），系统会生成并下载数据文件。', 
    isOpen: false 
  },
  { 
    id: 4, 
    question: '如何修改系统设置？', 
    answer: '在"系统设置"页面，您可以修改系统名称、版本、联系邮箱等基本信息，以及安全设置和邮件设置等。', 
    isOpen: false 
  },
  { 
    id: 5, 
    question: '如何管理用户权限？', 
    answer: '在"权限管理"页面，您可以创建和编辑角色，为角色分配不同的权限，然后将角色分配给用户，实现权限管理。', 
    isOpen: false 
  },
  { 
    id: 6, 
    question: '如何查看统计数据？', 
    answer: '在"数据统计"页面，您可以查看系统的各项统计数据，包括用户数、收入、订单数和访问量等。', 
    isOpen: false 
  }
]

// 帮助分类
export const helpCategories = [
  { id: 1, name: '常见问题', icon: 'fas fa-question-circle', description: '浏览最常见的问题和解答' },
  { id: 2, name: '用户指南', icon: 'fas fa-book', description: '详细的系统使用指南' },
  { id: 3, name: '视频教程', icon: 'fas fa-video', description: '观看视频教程学习使用' },
  { id: 4, name: '联系支持', icon: 'fas fa-life-ring', description: '获取技术支持和帮助' }
]

// 帮助文章
export const helpArticles = [
  { 
    id: 1, 
    title: '系统快速入门指南', 
    category: '用户指南', 
    content: '这是系统快速入门指南的内容，帮助用户快速了解系统的基本功能和使用方法。', 
    createdAt: '2023-01-15' 
  },
  { 
    id: 2, 
    title: '用户管理操作手册', 
    category: '用户指南', 
    content: '这是用户管理操作手册的内容，详细介绍了如何添加、编辑和删除用户。', 
    createdAt: '2023-01-20' 
  },
  { 
    id: 3, 
    title: '订单处理流程', 
    category: '用户指南', 
    content: '这是订单处理流程的内容，介绍了如何处理和管理订单。', 
    createdAt: '2023-02-01' 
  }
]