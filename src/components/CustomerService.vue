<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getDetailAPI } from "@/apis/detail";
import { sendDeepSeekChat } from "@/apis/deepseek";

const route = useRoute();
const visible = ref(false);
const inputMessage = ref("");
const chatBodyRef = ref(null);
const isLoading = ref(false);
const productInfo = ref(null);
const messages = ref([
  {
    id: 1,
    role: "assistant",
    text: "您好，我是小兔鲜智能客服。您可以直接问我商品推荐、尺码建议，或者让我帮您比较当前商品和其他商品。",
  },
]);

const currentProductId = computed(() => (route.path.startsWith("/detail/") ? route.params.id : ""));
const hasProductContext = computed(() => !!productInfo.value?.name);

// 将当前商品整理成给模型看的结构化文本，方便客服基于详情页上下文回答。
const productSummary = computed(() => {
  if (!productInfo.value) return "当前不在商品详情页，没有可用的商品上下文。";

  const product = productInfo.value;
  const specs = Array.isArray(product.specs)
    ? product.specs
        .map((item) => {
          const values = Array.isArray(item.values)
            ? item.values
                .map((val) => val.name || "")
                .filter(Boolean)
                .join("、")
            : "";
          return values ? `${item.name}: ${values}` : item.name;
        })
        .filter(Boolean)
        .join("；")
    : "";

  const categories = Array.isArray(product.categories)
    ? product.categories
        .map((item) => item.name)
        .filter(Boolean)
        .join(" / ")
    : "";

  return [
    `商品名称: ${product.name || "未知"}`,
    `商品价格: ${product.price || "未知"}`,
    `商品原价: ${product.oldPrice || "未知"}`,
    `商品描述: ${product.desc || "暂无"}`,
    `品牌: ${product.brand?.name || "未知"}`,
    `分类: ${categories || "未知"}`,
    `销量: ${product.saleCount ?? "未知"}`,
    `评价数: ${product.commentCount ?? "未知"}`,
    `收藏数: ${product.collectCount ?? "未知"}`,
    `规格: ${specs || "暂无"}`,
  ].join("\n");
});

// 滚动到底部，保证新消息出现后始终可见。
const scrollToBottom = async () => {
  await nextTick();
  const body = chatBodyRef.value;
  if (!body) return;
  body.scrollTop = body.scrollHeight;
};

const loadProductContext = async (id) => {
  if (!id) {
    productInfo.value = null;
    return;
  }

  try {
    // 当前页面是商品详情页时，自动加载该商品信息作为客服上下文。
    const res = await getDetailAPI(id);
    productInfo.value = res.result;
  } catch (error) {
    productInfo.value = null;
    console.error("Failed to load product context:", error);
  }
};

// 聊天窗开关。
const toggleChat = () => {
  visible.value = !visible.value;
  if (visible.value) {
    scrollToBottom();
  }
};

// 组装 DeepSeek 对话消息：系统提示 + 最近历史 + 当前用户输入。
const createRequestMessages = (userText) => {
  const baseMessages = [
    {
      role: "system",
      content: [
        "你是小兔鲜电商的智能客服。请用自然、简洁、专业的中文回答。",
        "你可以帮助用户咨询商品信息、推荐搭配、尺码建议、下单提醒，并进行商品对比。",
        "请输出纯文本，不要使用 Markdown 格式（例如 **、##、```、[]()）。",
        "如果用户要求对比商品，但没有提供足够信息，请明确说明需要什么商品名称、链接或编号。",
        "如果当前页面有商品上下文，请优先基于上下文回答；如果上下文不足，请直接说明限制，不要编造数据。",
        "回答时尽量给出可执行建议，必要时用分点方式输出。",
        "",
        "当前商品上下文如下：",
        productSummary.value,
      ].join("\n"),
    },
  ];

  const historyMessages = messages.value
    .slice(-8)
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({
      role: item.role,
      content: item.text,
    }));

  return [
    ...baseMessages,
    ...historyMessages,
    {
      role: "user",
      content: userText,
    },
  ];
};

// 去掉模型回复里的 Markdown 符号，避免聊天框里直接显示 **、#、` 之类的标记。
const normalizeAssistantReply = (text) => {
  if (!text) return "";

  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`{1,3}/g, "")
    .replace(/^\s{0,3}#{1,6}\s?/gm, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "- ")
    .trim();
};

// 发送消息并请求模型回复。
const sendMessage = async () => {
  const text = inputMessage.value.trim();
  if (!text || isLoading.value) return;

  const userMessage = {
    id: Date.now(),
    role: "user",
    text,
  };
  messages.value.push(userMessage);
  inputMessage.value = "";
  isLoading.value = true;
  await scrollToBottom();

  try {
    const content = await sendDeepSeekChat(createRequestMessages(text));
    messages.value.push({
      id: Date.now() + 1,
      role: "assistant",
      text: normalizeAssistantReply(content) || "我暂时没有拿到明确回复，请您再试一次。",
    });
  } catch (error) {
    console.error("DeepSeek chat failed:", error);
    ElMessage.warning("智能客服暂时不可用，请检查 DeepSeek API 配置");
    messages.value.push({
      id: Date.now() + 1,
      role: "assistant",
      text: "当前智能客服未能正常响应，请稍后再试，或把您想对比的商品名称发给我。",
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

// 快捷提问按钮，直接把预设问题放进输入框。
const quickAsk = (text) => {
  inputMessage.value = text;
  if (visible.value) {
    scrollToBottom();
  }
};

watch(
  currentProductId,
  (value) => {
    loadProductContext(value);
  },
  { immediate: true },
);

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="customer-service">
    <div class="chat-btn" @click="toggleChat">
      <i class="iconfont icon-help"></i>
      <span>客服</span>
    </div>

    <transition name="fade-slide">
      <div v-if="visible" class="chat-window">
        <div class="chat-header">
          <div class="title-wrap">
            <span class="title">智能客服</span>
            <span class="status" :class="{ active: hasProductContext }">
              {{ hasProductContext ? "已加载当前商品" : "全局咨询模式" }}
            </span>
          </div>
          <i class="iconfont icon-close" @click="toggleChat"></i>
        </div>

        <div class="chat-context" v-if="hasProductContext">
          <div class="context-label">当前商品</div>
          <div class="context-name">{{ productInfo.name }}</div>
        </div>

        <div class="quick-actions">
          <button type="button" @click="quickAsk('帮我总结一下当前商品的优点和适合人群')">
            总结商品
          </button>
          <button type="button" @click="quickAsk('帮我比较当前商品和其他同类商品，给出购买建议')">
            对比商品
          </button>
          <button type="button" @click="quickAsk('推荐适合我当前商品的搭配或替代款')">
            搭配推荐
          </button>
        </div>

        <div ref="chatBodyRef" class="chat-body">
          <div v-for="msg in messages" :key="msg.id" :class="['msg-item', msg.role]">
            <div class="content">{{ msg.text }}</div>
          </div>
          <div v-if="isLoading" class="msg-item assistant">
            <div class="content typing">正在思考中...</div>
          </div>
        </div>

        <div class="chat-footer">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="500"
            show-word-limit
            placeholder="例如：帮我比较当前商品和 XX，或者告诉我这件商品适合什么人群"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <div class="actions">
            <el-button @click="visible = false">收起</el-button>
            <el-button type="primary" :loading="isLoading" @click="sendMessage">发送</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.customer-service {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 999;

  .chat-btn {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, $xtxColor 0%, #1f9f8c 100%);
    border-radius: 50%;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(39, 186, 155, 0.28);
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 16px 36px rgba(39, 186, 155, 0.34);
    }

    i {
      font-size: 24px;
    }

    span {
      font-size: 12px;
      margin-top: 2px;
    }
  }

  .chat-window {
    position: absolute;
    right: 0;
    bottom: 78px;
    width: 360px;
    height: 560px;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.16);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(39, 186, 155, 0.12);
  }

  .chat-header {
    background: linear-gradient(135deg, $xtxColor 0%, #15947d 100%);
    color: #fff;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .title {
      font-size: 16px;
      font-weight: 600;
    }

    .status {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.18);

      &.active {
        background: rgba(255, 255, 255, 0.24);
      }
    }

    i {
      cursor: pointer;
      font-size: 18px;
    }
  }

  .chat-context {
    padding: 12px 16px 0;

    .context-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }

    .context-name {
      font-size: 14px;
      color: #333;
      line-height: 1.4;
      font-weight: 600;
    }
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px 16px 10px;

    button {
      height: 36px;
      border: 1px solid rgba(39, 186, 155, 0.18);
      border-radius: 10px;
      background: #f6fffd;
      color: $xtxColor;
      font-size: 12px;
      cursor: pointer;
      padding: 0 8px;
      transition:
        background 0.2s ease,
        transform 0.2s ease;

      &:hover {
        background: #ecfffb;
        transform: translateY(-1px);
      }
    }
  }

  .chat-body {
    flex: 1;
    padding: 12px 14px;
    overflow-y: auto;
    background: linear-gradient(180deg, #f8fbfa 0%, #f4f7f6 100%);

    .msg-item {
      margin-bottom: 12px;
      display: flex;

      &.user {
        justify-content: flex-end;

        .content {
          background: $xtxColor;
          color: #fff;
          border-radius: 14px 14px 4px 14px;
        }
      }

      &.assistant {
        justify-content: flex-start;

        .content {
          background: #fff;
          color: #333;
          border-radius: 14px 14px 14px 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
      }

      .content {
        padding: 10px 12px;
        max-width: 86%;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .typing {
        color: #666;
      }
    }
  }

  .chat-footer {
    padding: 12px 14px 14px;
    border-top: 1px solid #eef2f1;
    background: #fff;

    :deep(.el-textarea__inner) {
      border-radius: 12px;
      resize: none;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 10px;
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
