const generateMsg = text => {
  return {
    text,
    createdAt: Date.now()
  };
};

const generateLocMsg = url => {
  return {
    url,
    createdAt: Date.now()
  };
};

exports.generateMsg = generateMsg;
exports.generateLocMsg = generateLocMsg;
