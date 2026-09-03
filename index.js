require("dotenv").config();

const { Bot, Keyboard } = require("grammy");

// ========================================
// SOZLAMALAR
// ========================================

const TOKEN = process.env.BOT_TOKEN?.trim();
const ADMIN_ID = process.env.ADMIN_ID?.trim();

const CARD_NUMBER = process.env.CARD_NUMBER?.trim();
const CARD_OWNER = process.env.CARD_OWNER?.trim();

const PRICE_UZS = process.env.PRICE_UZS?.trim() || "54 900";
const PRICE_EUR = process.env.PRICE_EUR?.trim() || "4";


// ========================================
// .ENV TEKSHIRISH
// ========================================

if (!TOKEN) {
  console.error("❌ BOT_TOKEN topilmadi!");
  console.error("👉 .env faylingizni tekshiring.");
  process.exit(1);
}

if (!ADMIN_ID) {
  console.error("❌ ADMIN_ID topilmadi!");
  console.error("👉 .env faylingizga ADMIN_ID qo‘shing.");
  process.exit(1);
}

if (!CARD_NUMBER) {
  console.error("❌ CARD_NUMBER topilmadi!");
  console.error("👉 .env faylingizni tekshiring.");
  process.exit(1);
}

if (!CARD_OWNER) {
  console.error("❌ CARD_OWNER topilmadi!");
  console.error("👉 .env faylingizni tekshiring.");
  process.exit(1);
}


// ========================================
// BOT
// ========================================

const bot = new Bot(TOKEN);


// ========================================
// HTML ESCAPE
// ========================================

function escapeHTML(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


// ========================================
// ASOSIY KLAVIATURA
// ========================================

const mainKeyboard = new Keyboard()
  .text("💳 Hisob yaratish")
  .row()
  .text("🆘 Yordam markazi")
  .resized()
  .persistent();


// ========================================
// /START
// ========================================

bot.command("start", async (ctx) => {
  const firstName =
    ctx.from?.first_name || "Foydalanuvchi";

  const safeFirstName = escapeHTML(firstName);

  await ctx.reply(
    `👋 Assalomu alaykum, ${safeFirstName}!

` +
    `🎓 <b>DarsPro</b> xizmatiga xush kelibsiz!

` +
    `Kerakli bo‘limni tanlang 👇`,
    {
      parse_mode: "HTML",
      reply_markup: mainKeyboard,
    }
  );

  console.log(
    `✅ START | ${firstName} | ID: ${ctx.from.id}`
  );
});


// ========================================
// /ID
// ========================================

bot.command("id", async (ctx) => {
  await ctx.reply(
    `🆔 Sizning Telegram ID'ingiz:

` +
    `<code>${ctx.from.id}</code>`,
    {
      parse_mode: "HTML",
    }
  );
});


// ========================================
// HISOB YARATISH
// ========================================

bot.hears("💳 Hisob yaratish", async (ctx) => {
  const contactKeyboard = new Keyboard()
    .requestContact("📱 Kontaktni yuborish")
    .row()
    .text("⬅️ Orqaga")
    .resized()
    .oneTime();

  await ctx.reply(
    `💳 <b>HISOB YARATISH</b>

` +
    `Hisob yaratish uchun telefon raqamingizni yuboring 📱

` +
    `Quyidagi <b>Kontaktni yuborish</b> tugmasini bosing 👇`,
    {
      parse_mode: "HTML",
      reply_markup: contactKeyboard,
    }
  );
});


// ========================================
// KONTAKT QABUL QILISH
// ========================================

bot.on("message:contact", async (ctx) => {
  const contact = ctx.message.contact;

  // ======================================
  // FAQAT O'Z KONTAKTINI QABUL QILISH
  // ======================================

  if (
    contact.user_id &&
    contact.user_id !== ctx.from.id
  ) {
    await ctx.reply(
      `❌ <b>Noto‘g‘ri kontakt!</b>

` +
      `Iltimos, boshqa odamning kontaktini emas, ` +
      `o‘zingizning telefon raqamingizni yuboring.`,
      {
        parse_mode: "HTML",
        reply_markup: mainKeyboard,
      }
    );

    console.log(
      `⚠️ BOSHQA KONTAKT | ` +
      `User ID: ${ctx.from.id} | ` +
      `Contact User ID: ${contact.user_id}`
    );

    return;
  }


  // ======================================
  // FOYDALANUVCHI MA'LUMOTLARI
  // ======================================

  const phone = contact.phone_number;

  const firstName =
    contact.first_name ||
    ctx.from?.first_name ||
    "Foydalanuvchi";

  const lastName =
    contact.last_name ||
    ctx.from?.last_name ||
    "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const telegramId = ctx.from.id;

  const username = ctx.from.username
    ? `@${ctx.from.username}`
    : "username mavjud emas";

  const currentTime = new Date().toLocaleString(
    "uz-UZ",
    {
      timeZone: "Asia/Tashkent",
    }
  );


  // ======================================
  // TERMINAL
  // ======================================

  console.log("");
  console.log("========================================");
  console.log("👤 YANGI FOYDALANUVCHI");
  console.log("========================================");
  console.log("👤 Ism:", fullName);
  console.log("📱 Telefon:", phone);
  console.log("🆔 Telegram ID:", telegramId);
  console.log("🔹 Username:", username);
  console.log("⏰ Vaqt:", currentTime);
  console.log("========================================");
  console.log("");


  // ======================================
  // HTML ESCAPE
  // ======================================

  const safeFullName = escapeHTML(fullName);
  const safePhone = escapeHTML(phone);
  const safeUsername = escapeHTML(username);
  const safeTime = escapeHTML(currentTime);


  // ======================================
  // ADMIN'GA XABAR
  // ======================================

  try {
    await bot.api.sendMessage(
      ADMIN_ID,

      `🔔 <b>YANGI HISOB YARATISH SO‘ROVI</b>

` +

      `👤 <b>F.I.O:</b>
` +
      `${safeFullName}

` +

      `📱 <b>Telefon:</b>
` +
      `<code>${safePhone}</code>

` +

      `🆔 <b>Telegram ID:</b>
` +
      `<code>${telegramId}</code>

` +

      `🔹 <b>Username:</b>
` +
      `${safeUsername}

` +

      `⏰ <b>Vaqt:</b>
` +
      `${safeTime}

` +

      `━━━━━━━━━━━━━━━━━━

` +

      `💳 Foydalanuvchiga to‘lov karta ma'lumotlari yuborildi.`,

      {
        parse_mode: "HTML",
      }
    );

    console.log("✅ Ma'lumot admin'ga yuborildi.");

  } catch (error) {
    console.error(
      "❌ Admin'ga yuborishda xato:",
      error.message
    );
  }


  // ======================================
  // FOYDALANUVCHIGA KARTA MA'LUMOTLARI
  // ======================================

  try {
    await ctx.reply(

      `✅ <b>Kontakt muvaffaqiyatli qabul qilindi!</b>

` +

      `👤 Ism: ${safeFullName}
` +
      `📱 Telefon: ${safePhone}

` +

      `━━━━━━━━━━━━━━━━━━

` +

      `💳 <b>TO‘LOV UCHUN KARTA</b>

` +

      `💳 Karta raqami:
` +
      `<code>${escapeHTML(CARD_NUMBER)}</code>

` +

      `👤 Qabul qiluvchi:
` +
      `<b>${escapeHTML(CARD_OWNER)}</b>

` +

      `━━━━━━━━━━━━━━━━━━

` +

      `💰 <b>To‘lov summasi:</b>
` +
      `${escapeHTML(PRICE_UZS)} so‘m yoki ${escapeHTML(PRICE_EUR)} yevro.

` +

      `To‘lovni amalga oshirgach, administrator bilan bog‘laning.
` +
      `U sizga login va parolni beradi.

` +

      `⚠️ Karta ma'lumotlarini diqqat bilan tekshiring.`,

      {
        parse_mode: "HTML",
        reply_markup: mainKeyboard,
      }
    );

  } catch (error) {
    console.error(
      "❌ Foydalanuvchiga xabar yuborishda xato:",
      error.message
    );
  }
});


// ========================================
// YORDAM MARKAZI
// ========================================

bot.hears("🆘 Yordam markazi", async (ctx) => {
  const firstName =
    ctx.from?.first_name || "Foydalanuvchi";

  const username = ctx.from.username
    ? `@${ctx.from.username}`
    : "username mavjud emas";

  const telegramId = ctx.from.id;

  const safeFirstName = escapeHTML(firstName);
  const safeUsername = escapeHTML(username);

  // ======================================
  // FOYDALANUVCHIGA
  // ======================================

  await ctx.reply(
    `🆘 <b>YORDAM MARKAZI</b>

` +

    `Savolingiz qabul qilindi ✅

` +

    `📞 Siz bilan tez orada bog‘lanishadi.

` +

    `Iltimos, biroz kuting. Rahmat! 🙏`,
    {
      parse_mode: "HTML",
      reply_markup: mainKeyboard,
    }
  );


  // ======================================
  // ADMIN'GA
  // ======================================

  try {
    await bot.api.sendMessage(
      ADMIN_ID,

      `🆘 <b>YORDAM SO‘ROVI</b>

` +

      `👤 <b>Ism:</b>
` +
      `${safeFirstName}

` +

      `🆔 <b>Telegram ID:</b>
` +
      `<code>${telegramId}</code>

` +

      `🔹 <b>Username:</b>
` +
      `${safeUsername}

` +

      `📞 Foydalanuvchi yordam so‘radi.`,

      {
        parse_mode: "HTML",
      }
    );

    console.log(
      `✅ Yordam so‘rovi admin'ga yuborildi | ID: ${telegramId}`
    );

  } catch (error) {
    console.error(
      "❌ Yordam so‘rovini admin'ga yuborishda xato:",
      error.message
    );
  }
});


// ========================================
// ORQAGA
// ========================================

bot.hears("⬅️ Orqaga", async (ctx) => {
  await ctx.reply(
    `🏠 <b>ASOSIY MENYU</b>

` +
    `Kerakli bo‘limni tanlang 👇`,
    {
      parse_mode: "HTML",
      reply_markup: mainKeyboard,
    }
  );
});


// ========================================
// NOMA'LUM MATN
// ========================================

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  // Komandalar
  if (text.startsWith("/")) {
    return;
  }

  // Tugmalar
  if (
    text === "💳 Hisob yaratish" ||
    text === "🆘 Yordam markazi" ||
    text === "⬅️ Orqaga"
  ) {
    return;
  }

  await ctx.reply(
    `🤔 <b>Tushunmadim.</b>

` +
    `Iltimos, quyidagi menyudan foydalaning 👇`,
    {
      parse_mode: "HTML",
      reply_markup: mainKeyboard,
    }
  );
});


// ========================================
// BOT XATOLARINI USHLASH
// ========================================

bot.catch((err) => {
  console.error("");
  console.error("========================================");
  console.error("❌ BOT XATOSI");
  console.error("========================================");
  console.error(err.error);
  console.error("========================================");
  console.error("");
});


// ========================================
// BOTNI ISHGA TUSHIRISH
// ========================================

bot.start({
  onStart: (botInfo) => {
    console.log("");
    console.log("========================================");
    console.log("🤖 DarsPro BOT ISHGA TUSHDI");
    console.log("========================================");
    console.log(`📱 Username: @${botInfo.username}`);
    console.log(`🆔 Bot ID: ${botInfo.id}`);
    console.log("========================================");
    console.log("");
  },
});
