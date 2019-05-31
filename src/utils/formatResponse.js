function formatResponse(block) {
  const story = block.body.star.story;
  if (!story) return block;
  const storyDecoded = new Buffer(story, 'hex').toString()
  block.body.star.storyDecoded = storyDecoded;
  return block;
}

module.exports = formatResponse;