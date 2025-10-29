const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 公開フォルダ設定でき /public のみ
app.use("/public", express.static(path.join(__dirname, "public")));

function isFromLINE(req) {
  const ref = (req.get("referer") || "").toLowerCase();
  const ua  = (req.get("user-agent") || "").toLowerCase();
  return (
    ref.includes("line.me") ||
    ref.includes("liff.line.me") ||
    ua.includes(" line/") ||
    ua.includes(" line ")
  );
}

// LINE専用ゲート
app.get("/gate", (req, res) => {
  if (!isFromLINE(req)) {
    return res.sendFile(path.join(__dirname, "public", "gate-deny.html"));
  }
  res.sendFile(path.join(__dirname, "secret", "unchinkeisan.html"));
});

// /secret 直口禁止
app.use("/secret", (_req, res) => res.status(403).send("Forbidden"));

// ルートアクセスは /gate にリダイレクト
app.get("/", (_req, res) => res.redirect(302, "/gate"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
