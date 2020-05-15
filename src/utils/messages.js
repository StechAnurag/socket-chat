const generateMsg = (username, text) => ({ username, text, createdAt: Date.now() });

const generateLocMsg = (username, url) => ({ username, url, createdAt: Date.now() });

exports.generateMsg = generateMsg;
exports.generateLocMsg = generateLocMsg;
