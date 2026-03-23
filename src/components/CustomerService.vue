<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const messages = ref([
  { id: 1, text: '您好！小兔鲜客服为您服务。', role: 'robot' }
])

const toggleChat = () => {
  visible.value = !visible.value
}

const sendMessage = () => {
  if (!message.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    text: message.value,
    role: 'user'
  })
  
  const userMsg = message.value
  message.value = ''
  
  // 模拟机器人回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now(),
      text: `收到您的消息："${userMsg}"。我们的客服人员稍后会联系您。`,
      role: 'robot'
    })
  }, 1000)
}
</script>

<template>
  <div class="customer-service">
    <!-- 悬浮按钮 -->
    <div class="chat-btn" @click="toggleChat">
      <i class="iconfont icon-help"></i>
      <span>客服</span>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="visible" class="chat-window">
      <div class="chat-header">
        <span>在线客服</span>
        <i class="iconfont icon-close" @click="toggleChat"></i>
      </div>
      <div class="chat-body">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          :class="['msg-item', msg.role]"
        >
          <div class="content">{{ msg.text }}</div>
        </div>
      </div>
      <div class="chat-footer">
        <el-input 
          v-model="message" 
          placeholder="请输入您的问题..." 
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button @click="sendMessage">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.customer-service {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 999;

  .chat-btn {
    width: 60px;
    height: 60px;
    background: $xtxColor;
    border-radius: 50%;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }

    i {
      font-size: 24px;
    }
    span {
      font-size: 12px;
    }
  }

  .chat-window {
    position: absolute;
    right: 0;
    bottom: 70px;
    width: 300px;
    height: 400px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .chat-header {
      background: $xtxColor;
      color: #fff;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      i {
        cursor: pointer;
      }
    }

    .chat-body {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background: #f5f5f5;

      .msg-item {
        margin-bottom: 10px;
        display: flex;
        
        &.user {
          justify-content: flex-end;
          .content {
            background: $xtxColor;
            color: #fff;
          }
        }

        &.robot {
          justify-content: flex-start;
          .content {
            background: #fff;
            color: #333;
          }
        }

        .content {
          padding: 8px 12px;
          border-radius: 6px;
          max-width: 80%;
          font-size: 14px;
          word-break: break-all;
        }
      }
    }

    .chat-footer {
      padding: 10px;
      border-top: 1px solid #eee;
    }
  }
}
</style>
