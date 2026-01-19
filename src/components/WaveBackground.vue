<template>
  <div ref="container" class="absolute inset-0 w-full h-full overflow-hidden">
    <!-- Three.js 画布将在这里渲染 -->
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  particleColor: {
    type: String,
    default: '#3b82f6' // Tailwind blue-500
  },
  waveSpeed: {
    type: Number,
    default: 0.5
  },
  waveHeight: {
    type: Number,
    default: 50
  },
  particleCountX: {
    type: Number,
    default: 30
  },
  particleCountY: {
    type: Number,
    default: 20
  },
  separation: {
    type: Number,
    default: 100
  },


  cameraZ: {
    type: Number,
    default: 1200
  },
  cameraY: {
    type: Number,
    default: 800
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
});

const container = ref(null);
let scene = null;
let camera = null;
let renderer = null;
let particles = null;
let material = null;
let animationId = null;
let count = 0;

// 内部控制变量
let waveSpeed = props.waveSpeed;
let waveHeight = props.waveHeight;

const init = () => {
  if (!container.value) return;

  // 1. 创建场景
  scene = new THREE.Scene();

  // 2. 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    1,
    10000
  );
  // 设置俯视20度视角
  camera.position.y = props.cameraY;
  camera.position.z = props.cameraZ;
  camera.rotation.x = THREE.MathUtils.degToRad(20); // 俯视20度
  camera.lookAt(0, 0, 0);

  // 3. 创建渲染器（关键：启用透明背景）
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true // 启用透明度
  });
  
  // 设置背景颜色
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
  
  container.value.appendChild(renderer.domElement);

  // 4. 创建粒子系统
  createParticles();


};

// 存储固定的X和Z位置，避免在渲染循环中重复计算
let basePositions = [];

const createParticles = () => {
  const numParticles = props.particleCountX * props.particleCountY;
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);
  basePositions = [];

  let i = 0, j = 0;

  // 初始化粒子位置
  for (let ix = 0; ix < props.particleCountX; ix++) {
    for (let iy = 0; iy < props.particleCountY; iy++) {
      const x = ix * props.separation - ((props.particleCountX * props.separation) / 2);
      const z = iy * props.separation - ((props.particleCountY * props.separation) / 2);
      
      positions[i] = x;
      positions[i + 1] = 0; // y坐标初始为0
      positions[i + 2] = z;
      
      basePositions.push({ x, z });
      scales[j] = 1;
      i += 3;
      j++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // 使用着色器材质创建圆形粒子，参考HTML版本实现
  material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(props.particleColor) }
    },
    vertexShader: `
      attribute float scale;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = scale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    alphaTest: 0.5
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  render();
};

const render = () => {
  if (!particles || !camera || !scene || !renderer) return;

  // 更新粒子位置创建波浪效果
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;

  let i = 0, j = 0;

  for (let ix = 0; ix < props.particleCountX; ix++) {
    for (let iy = 0; iy < props.particleCountY; iy++) {
      // 使用预计算的固定位置
      const { x, z } = basePositions[i / 3];
      positions[i] = x;
      positions[i + 2] = z;
      
      // 波浪运动计算
      positions[i + 1] = 
        Math.sin((ix + count) * 0.3) * waveHeight + 
        Math.sin((iy + count) * 0.5) * waveHeight;
      
      // 粒子大小变化
      scales[j] = 
        (Math.sin((ix + count) * 0.3) + 1) * 10 + 
        (Math.sin((iy + count) * 0.5) + 1) * 10;

      i += 3;
      j++;
    }
  }

  // 标记属性需要更新
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render(scene, camera);
  count += waveSpeed * 0.1; // 控制波浪速度
};

const handleResize = () => {
  if (!camera || !renderer || !container.value) return;
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
};



// 暴露方法供父组件调用
const updateParticleColor = (color) => {
  if (material) {
    material.uniforms.color.value = new THREE.Color(color);
  }
};

const updateWaveSpeed = (speed) => {
  waveSpeed = speed;
};

const updateWaveHeight = (height) => {
  waveHeight = height;
};



// 监听props变化，实时更新效果
watch(() => props.particleColor, (newColor) => {
  updateParticleColor(newColor);
});

watch(() => props.waveSpeed, (newSpeed) => {
  waveSpeed = newSpeed;
});

watch(() => props.waveHeight, (newHeight) => {
  waveHeight = newHeight;
});



defineExpose({
  updateParticleColor,
  updateWaveSpeed,
  updateWaveHeight,
  restart: () => {
    if (particles) {
    scene.remove(particles);
    particles.geometry.dispose();
    particles.material.dispose();
  }
  createParticles();
  }
});

onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  if (particles) {
    scene.remove(particles);
    particles.geometry.dispose();
    particles.material.dispose();
  }
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.overflow-hidden {
  overflow: hidden;
}
</style>