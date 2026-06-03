import axios from "axios";

//创建axios实例,设置baseurl 和超时设置
const deepSeekHttp = axios.create({
  baseURL: "https://api.deepseek.com",
  timeout: 60000,
});

//导出函数sendDeepSeekChat
export async function sendDeepSeekChat(messages) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DeepSeek API key");
  }

  const model = import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-chat";
  //为啥这里用post方法? 因为我们需要发送一个包含消息内容的请求体，而POST方法适合用于发送数据到服务器。相比之下，GET方法通常用于请求数据，不适合携带大量数据或敏感信息。使用POST方法可以确保我们的消息内容被正确传递并且不会暴露在URL中，从而提高安全性和可靠性。
  const { data } = await deepSeekHttp.post(
    "/chat/completions",
    {
      model,
      messages,
      temperature: 0.3,
      max_tokens: 900,
    },
    {
      headers: {
        //这里还是需要请求头吗? 是的，仍然需要设置请求头来包含API密钥和指定内容类型。API密钥用于身份验证，确保只有授权用户才能访问API，而内容类型则告诉服务器请求体的格式，以便正确解析和处理请求。
        //跟token有什么关系吗? 这里的token指的是API密钥，它是一个字符串，用于验证请求的身份。虽然它被称为“token”，但它实际上是一个密钥，而不是一个访问令牌。这个API密钥需要在请求头中以Bearer Token的形式传递，以便服务器能够识别和授权请求。
        //跟token冲突吗? 不会冲突，因为这里的API密钥是一个独立的字符串，用于身份验证，而不是一个访问令牌。只要正确设置请求头，服务器就能正确识别和授权请求，不会与其他类型的令牌发生冲突。
        //那两者都会一块携带吗? 是的，API密钥（作为Bearer Token）会在请求头中携带，而访问令牌（如果有的话）也可以在请求头中携带。只要正确设置请求头，服务器就能正确识别和授权请求，不会发生冲突。
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  return data?.choices?.[0]?.message?.content?.trim() || "";
}
