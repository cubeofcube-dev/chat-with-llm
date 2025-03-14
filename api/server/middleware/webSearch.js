const axios = require('axios');
const OpenAI = require('openai');
const denyRequest = require('./denyRequest');
const { logger } = require('~/config');

const cli = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://oneapi.3of3.cn/v1',
  },
);

async function sendMessages(messages, tools = []) {
  const response = await cli.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    tools: tools,
  });
  return response.choices[0].message;
}

async function searchByKeywords(keywords, max_results, fetch_content) {
  logger.info(`searchByKeywords: ${keywords} | ${max_results} | ${fetch_content}`);

  // See: https://github.com/cubeofcube-dev/search-api
  const endpoint = process.env.WEB_SEARCH_ENDPOINT || 'http://localhost:8000/v1/search';
  const api_key = process.env.WEB_SEARCH_API_KEY;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${api_key}`,
    'Content-Type': 'application/json',
  };
  const req = {
    query: keywords,
    max_results: max_results,
    fetch_content: fetch_content,
  };

  try {
    const response = await axios.post(endpoint, req, { headers: headers });
    logger.info('[webSearch] search api response: '+ JSON.stringify(response.data.data, null , 2));
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    logger.error('[webSearch] Error in searchByKeywords: '+ error);
    return [];
  }
}

const searchTools = [
  {
    'type': 'function',
    'function': {
      'name': 'searchByKeywords',
      'description': 'Search the web for results based on keywords',
      'parameters': {
        'type': 'object',
        'properties': {
          'keywords': {
            'type': 'string',
            'description': 'The keywords to search for, e.g. "AI, Deep Learning"',
          },
          'max_results': {
            'type': 'integer',
            'description': 'The maximum number of results to return, default 3, max 10',
          },
          'fetch_content': {
            'type': 'boolean',
            'description': 'Whether to fetch the content of the search results, default true',
          },
        },
        'required': ['keyword'],
      },
    },
  },
];

async function webSearch(req, res, next) {
  const { isWebSearch, text } = req.body;
  if (isWebSearch) {
    logger.info('[webSearch] use web search middleware');
    try {
      let messages = [ { role: 'system', content: 'I am in China; and just reply: pong' } , { role: 'user', content: `${text}` } ];
      let message = await sendMessages(messages, searchTools);
      let { tool_calls } = message;
      if (tool_calls) {
        for (let tool_call of tool_calls) {
          let { name, arguments: args_string } = tool_call.function;
          if (name === 'searchByKeywords') {
            let { keywords, max_results = 3, fetch_content = true } = JSON.parse(args_string);
            let results = await searchByKeywords(keywords, max_results, fetch_content);

            let resultsText = `found '${results.length}' results for '${keywords}' from the search engine: \n\`\`\`json\n`;
            for (let result of results) {
              resultsText += `- ${JSON.stringify(result)}\n`;
            }
            resultsText += '```';
            logger.info('[webSearch] web search middleware done, new prompts:\n' + resultsText);

            let webSearchOptions = {
              isWebSearch: isWebSearch,
              resultsText: resultsText,
            };
            req.body.webSearchOptions = webSearchOptions;
          }
        }
      }
    } catch (error) {
      logger.error('[webSearch] Error in web search:'+ error);
      const errorMessage = 'error in web search';
      return await denyRequest(req, res, errorMessage);
    }
  }
  next();
}

module.exports = webSearch;
