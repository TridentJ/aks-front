import { MockMethod } from "vite-plugin-mock";

// 模拟刷新token接口
export default [
  {
    url: "/api/authentication/refreshToken",
    method: "post",
    response: ({ body }) => {
      if (body.refreshToken) {
        return {
          code: 0,
          message: "success",
          data: {
            accessToken:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDYzNTc4MDIsInVzZXJJZCI6NDE3Mzg5NzY1ODczNjc5LCJ1c2VybmFtZSI6ImFkbWluIn0.vA7xo_cY8Ehu7xtD4if67AmxXwOyKj99GRafK0cvqAY",
            refreshToken:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3ODUxNTQ2MDIsInVzZXJJZCI6NDE3Mzg5NzY1ODczNjc5LCJ1c2VybmFtZSI6ImFkbWluIn0.0MKyivjCYFRJDK7Ewg0JcelPHWOvShxEzdL-mticxyo",
            // `expires`选择这种日期格式是为了方便调试，后端直接设置时间戳或许更方便（每次都应该递增）。如果后端返回的是时间戳格式，前端开发请来到这个目录`src/utils/auth.ts`，把第`38`行的代码换成expires = data.expires即可。
            expires: "2024/01/27 20:16:42"
          }
        };
      } else {
        return {
          code: 0,
          message: "success",
          data: {}
        };
      }
    }
  }
] as MockMethod[];
