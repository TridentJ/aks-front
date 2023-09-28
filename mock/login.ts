// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/authentication/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        console.log("password:" + body.password);
        return {
          code: 0,
          message: "success",
          data: {
            username: "admin",
            roles: ["All_Admin"],
            accessToken:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDYzNTc4MDIsInVzZXJJZCI6NDE3Mzg5NzY1ODczNjc5LCJ1c2VybmFtZSI6ImFkbWluIn0.vA7xo_cY8Ehu7xtD4if67AmxXwOyKj99GRafK0cvqAY",
            refreshToken:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3ODUxNTQ2MDIsInVzZXJJZCI6NDE3Mzg5NzY1ODczNjc5LCJ1c2VybmFtZSI6ImFkbWluIn0.0MKyivjCYFRJDK7Ewg0JcelPHWOvShxEzdL-mticxyo",
            expires: "2024/01/27 20:16:42"
          }
        };
      } else {
        return {
          code: 0,
          message: "success",
          data: {
            username: "admin",
            // 一个用户可能有多个角色
            roles: ["All_Admin"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      }
    }
  }
] as MockMethod[];
