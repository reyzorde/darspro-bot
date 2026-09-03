require("dotenv").config();

const { Bot, Keyboard } = require("grammy");

// ========================================
// SOZLAMALAR
// ========================================

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

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

const bot = new Bot(TOKEN);


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

  await ctx.reply(
    `👋 Assalomu alaykum, ${firstName}!

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
// ADMIN ID NI BILISH UCHUN
// ========================================

bot.command("id", async (ctx) => {

  await ctx.reply(
    `🆔 Sizning Telegram ID'ingiz:

<code>${ctx.from.id}</code>`,
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

  const phone = contact.phone_number;

  const firstName =
    contact.first_name ||
    ctx.from?.first_name ||
    "Foydalanuvchi";

  const telegramId = ctx.from.id;

  const username = ctx.from.username
    ? `@${ctx.from.username}`
    : "username mavjud emas";

  const lastName =
    contact.last_name ||
    ctx.from?.last_name ||
    "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const currentTime = new Date().toLocaleString(
    "uz-UZ",
    {
      timeZone: "Asia/Tashkent",
    }
  );


  // ======================================
  // TERMINALGA CHIQARISH
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
  // ADMIN'GA YUBORISH
  // ======================================

  try {

    await bot.api.sendMessage(
      ADMIN_ID,

      `🔔 <b>YANGI HISOB YARATISH SO‘ROVI</b>

` +

      `👤 <b>F.I.O:</b>
` +
      `${fullName}

` +

      `📱 <b>Telefon:</b>
` +
      `<code>${phone}</code>

` +

      `🆔 <b>Telegram ID:</b>
` +
      `<code>${telegramId}</code>

` +

      `🔹 <b>Username:</b>
` +
      `${username}

` +

      `⏰ <b>Vaqt:</b>
` +
      `${currentTime}

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

      `👤 Ism: ${fullName}
` +
      `📱 Telefon: ${phone}

` +

      `━━━━━━━━━━━━━━━━━━

` +

      `💳 <b>TO‘LOV UCHUN KARTA</b>

` +

      `💳 Karta raqami:
` +
      `<code>9860 1766 2131 5389</code>

` +

      `👤 Qabul qiluvchi:
` +
      `<b>G'.S</b>

` +

      `━━━━━━━━━━━━━━━━━━

` +

      `💰 To‘lovni amalga oshirgach, administrator bilan bog‘laning.
      U sizga login va parolni beradi.

` + `To'lov summasi 54 900 so'm yoki 4yevro.
`+ `⚠️ Karta ma'lumotlarini diqqat bilan tekshiring.`,

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

bot.catch((error) => {

});



bot.start({

  onStart: (botInfo) => {
  },

});
