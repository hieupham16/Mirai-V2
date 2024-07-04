exports.config = {
  name: "test",
  version: "24.10",
  hasPermission: 2,
  credits: "",
  description: "test khiên avatar của bot",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5
};

exports.run = async ({ api, event, args }) => {
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return api.sendMessage("Vui lòng chọn 'on' hoặc 'off'", event.threadID, event.messageID);
  }

  const botID = api.getCurrentUserID();
  const isShielded = args[0] === 'on';

  console.log(`Bot ID: ${botID}`);

  const form = {
    av: botID,
    variables: JSON.stringify({
      "0": {
        is_shielded: isShielded,
        actor_id: botID,
        client_mutation_id: Math.round(Math.random() * 19).toString()  // Ensure client_mutation_id is a string
      }
    }),
    doc_id: "1477043292367183"
  };

  console.log("Flog:", form);

  api.httpPost("https://www.facebook.com/api/graphql/", form, (err, res) => {  // cái này xem fca em có httpPost ko thì axios thôi 
    if (err) {
      console.error("HTTP Post Error:", err);
      return api.sendMessage(`Đã xảy ra lỗi, vui lòng thử lại sau: ${err.message}`, event.threadID, event.messageID);
    }

    let response;
    try {
      response = JSON.parse(res);
      console.log("API Response:", response);
    } catch (e) {
      console.error("JSON err:", e);
      return api.sendMessage(`loi ne: ${e.message}`, event.threadID, event.messageID);
    }

    if (response.errors) {
      console.error("graphql err:", response.errors);
      return api.sendMessage(`deo goi dc api graphql: ${response.errors[0].message}`, event.threadID, event.messageID);
    }

    const status = isShielded ? 'bật' : 'tắt';
    api.sendMessage(`» Đã ${status} khiên avatar của bot thành công`, event.threadID, event.messageID);
  });
};
