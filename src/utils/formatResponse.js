function formatResponse(block) {
  const story = block.body.star.story;
  const storyDecoded = new Buffer(story, 'hex').toString()
  block.body.star.storyDecoded = storyDecoded;
  return block;
}

module.exports = formatResponse;